const express = require('express');
const { celebrate, Joi } = require('celebrate');
const Payment = require('../models/Payment');
const Auction = require('../models/Auction');
const { Buyer } = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { paymentSchemas } = require('../middleware/validation');
const { rateLimits } = require('../middleware/rateLimits');

const router = express.Router();

// Create a new payment
router.post('/', rateLimits.payment, authenticateToken, celebrate({ body: paymentSchemas.create }), async (req, res) => {
  try {
    const {
      auctionId,
      amount,
      paymentMethod,
      paymentDetails
    } = req.body;

    const buyerId = req.user.id;

    // Check if auction exists
    const auction = await Auction.findById(auctionId).lean();
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    // Check if buyer is the winner
    if (auction.winnerId !== buyerId) {
      return res.status(403).json({ success: false, message: 'Only the auction winner can make payments' });
    }

    // Enforce escrow debit/hold
    const buyer = await Buyer.findById(buyerId).lean();
    if (!buyer) return res.status(404).json({ success: false, message: 'Buyer not found' });
    const payAmount = parseFloat(amount);
    if (!buyer.escrowBalance || buyer.escrowBalance < payAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient escrow balance' });
    }

    // Calculate commission (5% of total amount)
    const commission = parseFloat(amount) * 0.05;
    const farmerAmount = parseFloat(amount) - commission;

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const paymentData = {
      // Basic Information
      auctionId,
      farmerId: auction.farmerId,
      buyerId,
      
      // Payment Details
      amount: parseFloat(amount),
      commission,
      farmerAmount,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      
      // Status & Escrow
      status: 'completed',
      escrowStatus: 'held',
      
      // Transaction Details
      transactionId,
      paidAt: new Date().toISOString(),
      releasedAt: null,
      
      // Dispute Information
      disputeStatus: null,
      disputeReason: null,
      disputeInitiatedAt: null,
      disputeResolvedAt: null,
      
      // System Fields
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await Payment.create(paymentData);
    // Debit escrow balance
    await Buyer.updateOne({ _id: buyerId }, { $inc: { escrowBalance: -payAmount }, $set: { updatedAt: new Date() } });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment: { id: created._id.toString(), ...created.toObject() }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment' });
  }
});

// Get payments for an auction
router.get('/auction/:auctionId', authenticateToken, async (req, res) => {
  try {
    const { auctionId } = req.params;
    
    const payments = await Payment.find({ auctionId }).sort({ paidAt: -1 }).lean();
    res.json({ success: true, payments: payments.map(p => ({ id: p._id.toString(), ...p })) });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Get user's payments
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own payments or is admin
    if (req.user.id !== userId && !['admin', 'super_admin'].includes(req.user.userType)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const payments = await Payment.find({ buyerId: userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, payments: payments.map(p => ({ id: p._id.toString(), ...p })) });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Release payment to farmer (for admin/farmer admin)
router.put('/:paymentId/release', authenticateToken, requireRole(['admin', 'super_admin']), celebrate({ body: paymentSchemas.release }), async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentRef = db.collection('payments').doc(paymentId);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const payment = paymentDoc.data();

    if (payment.escrowStatus !== 'held') {
      return res.status(400).json({ success: false, message: 'Payment is not in escrow' });
    }

    await paymentRef.update({
      escrowStatus: 'released',
      releasedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Payment released to farmer successfully' });
  } catch (error) {
    console.error('Error releasing payment:', error);
    res.status(500).json({ success: false, message: 'Failed to release payment' });
  }
});

// Initiate dispute for payment
router.post('/:paymentId/dispute', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const paymentRef = db.collection('payments').doc(paymentId);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const payment = paymentDoc.data();

    // Check if user is buyer or farmer for this payment
    if (req.user.id !== payment.buyerId && req.user.id !== payment.farmerId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (payment.disputeStatus) {
      return res.status(400).json({ success: false, message: 'Dispute already exists for this payment' });
    }

    await paymentRef.update({
      disputeStatus: 'pending',
      disputeReason: reason || 'User initiated dispute',
      disputeInitiatedAt: new Date().toISOString(),
      escrowStatus: 'disputed',
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Dispute initiated successfully' });
  } catch (error) {
    console.error('Error initiating dispute:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate dispute' });
  }
});

// Get payment summary for an auction
router.get('/summary/:auctionId', authenticateToken, async (req, res) => {
  try {
    const { auctionId } = req.params;
    
    const snapshot = await db.collection('payments')
      .where('auctionId', '==', auctionId)
      .get();

    const payments = [];
    snapshot.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });

    // Calculate summary
    const summary = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
      totalCommission: payments.reduce((sum, payment) => sum + payment.commission, 0),
      totalFarmerAmount: payments.reduce((sum, payment) => sum + payment.farmerAmount, 0),
      completedPayments: payments.filter(p => p.status === 'completed'),
      heldInEscrow: payments.filter(p => p.escrowStatus === 'held'),
      releasedPayments: payments.filter(p => p.escrowStatus === 'released'),
      disputedPayments: payments.filter(p => p.disputeStatus === 'pending')
    };

    res.json({ success: true, summary, payments });
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment summary' });
  }
});

module.exports = router;

