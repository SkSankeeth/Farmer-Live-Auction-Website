const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  // Basic Information
  auctionId: { type: String, required: true, index: true },
  farmerId: { type: String, required: true, index: true },
  buyerId: { type: String, required: true, index: true },
  
  // Payment Details
  amount: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  farmerAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  
  // Payment Method
  paymentMethod: { type: String, default: 'upi' },
  paymentDetails: {
    transactionId: { type: String, default: '' },
    gateway: { type: String, default: '' },
    referenceId: { type: String, default: '' }
  },
  
  // Status
  status: { type: String, default: 'completed', enum: ['pending', 'completed', 'failed', 'refunded'] },
  escrowStatus: { type: String, default: 'held', enum: ['held', 'released', 'disputed'] },
  
  // Timestamps
  paidAt: { type: Date, default: () => new Date() },
  releasedAt: { type: Date, default: null },
  
  // Dispute Information
  disputeStatus: { type: String, default: 'none', enum: ['none', 'initiated', 'resolved'] },
  disputeReason: { type: String, default: '' },
  disputeInitiatedAt: { type: Date, default: null },
  disputeResolvedAt: { type: Date, default: null },
  
  // System Fields
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() }
}, { versionKey: false });

module.exports = mongoose.model('Payment', PaymentSchema, 'payments');




