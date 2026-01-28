const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { celebrate, Joi } = require('celebrate');
const Auction = require('../models/Auction');
const { Bid } = require('../models/Bid');
const { Farmer } = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { auctionSchemas } = require('../middleware/validation');
const { rateLimits } = require('../middleware/rateLimits');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/auctions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'auction-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create new auction
router.post('/', authenticateToken, requireRole(['farmer']), upload.array('images', 5), celebrate({ body: auctionSchemas.create }), async (req, res) => {
  try {
    const {
      productName,
      category,
      quantity,
      unit,
      basePrice,
      minIncrement,
      reservePrice,
      instantBuyPrice,
      description,
      quality,
      delivery,
      location,
      duration,
      autoExtend,
      instantBuy
    } = req.body;

    const farmerId = req.user.id;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (parseInt(duration) * 24 * 60 * 60 * 1000));

    // Handle uploaded images
    const images = req.files ? req.files.map(file => `/api/auctions/uploads/auctions/${file.filename}`) : [];

    // Get farmer details
    const farmerData = await Farmer.findById(farmerId).lean();

    const auctionData = {
      // Basic Information
      title: `${productName} - ${quantity}${unit}`,
      productName,
      category,
      description,
      
      // Product Details
      productDetails: {
        quantity: parseFloat(quantity),
        unit,
        quality: quality || 'standard',
        grade: 'A',
        variety: productName,
        harvestDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        storageConditions: 'Cool, dry place'
      },
      
      // Pricing
      pricing: {
        basePrice: parseFloat(basePrice),
        minIncrement: parseFloat(minIncrement) || 50,
        reservePrice: parseFloat(reservePrice) || parseFloat(basePrice),
        currentBid: parseFloat(basePrice),
        instantBuyPrice: parseFloat(instantBuyPrice) || null,
        currency: 'INR'
      },
      
      // Images
      images,
      
      // Participants
      farmerId,
      farmerName: `${farmerData.firstName || ''} ${farmerData.lastName || ''}`.trim(),
      winnerId: null,
      winnerName: null,
      
      // Auction Timeline
      timeline: {
        startTime,
        endTime,
        biddingStartTime: startTime,
        biddingEndTime: endTime,
        harvestingStartTime: null,
        harvestingEndTime: null,
        loadingStartTime: null,
        loadingEndTime: null,
        deliveryStartTime: null,
        deliveryEndTime: null
      },
      
      // Auction Status & Stage
      status: 'active',
      stage: 'bidding',
      stageDetails: {
        bidding: {
          startTime,
          endTime,
          totalBids: 0,
          highestBid: parseFloat(basePrice),
          bidHistory: []
        }
      },
      
      // Location & Delivery
      location: {
        farmAddress: location || farmerData.address?.street || '',
        coordinates: farmerData.address?.coordinates || { latitude: 0, longitude: 0 },
        deliveryRadius: 200,
        deliveryOptions: ['pickup', 'delivery'],
        estimatedDeliveryTime: '72 hours'
      },
      
      // Terms & Conditions
      terms: {
        paymentTerms: '50% advance, 50% on delivery',
        deliveryTerms: 'Within 72 hours of payment',
        returnPolicy: '7 days return policy',
        qualityGuarantee: '100% quality guarantee'
      },
      
      // Statistics
      stats: {
        totalBids: 0,
        totalViews: 0,
        totalWatchers: 0,
        averageBidAmount: parseFloat(basePrice)
      },
      
      // System Fields
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: farmerId
    };

    const created = await Auction.create(auctionData);
    // Emit websocket event for new auction
    const io = req.app.get('io');
    if (io) io.emit('auction:created', { id: created._id.toString(), ...created.toObject() });
    res.status(201).json({ success: true, message: 'Auction created successfully', auction: { id: created._id.toString(), ...created.toObject() } });
  } catch (error) {
    console.error('Error creating auction:', error);
    if (error && error.joi) {
      return res.status(400).json({ success: false, message: 'Validation failed', details: error.joi.details });
    }
    res.status(500).json({ success: false, message: 'Failed to create auction' });
  }
});

// Get all auctions (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { status, stage, category, farmerId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (stage) filter.stage = stage;
    if (category) filter.category = category;
    if (farmerId) filter.farmerId = farmerId;

    const auctions = await Auction.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, auctions: auctions.map(a => ({ id: a._id.toString(), ...a })) });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch auctions' });
  }
});

// Get auction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Auction.findById(id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    const auction = { id: doc._id.toString(), ...doc };
    // Bids collection omitted in this migration step; integrate when bids model is added
    res.json({ success: true, auction, bids: [] });
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch auction' });
  }
});

// Place a bid
router.post('/:id/bid', rateLimits.bidding, authenticateToken, requireRole(['buyer']), celebrate({ body: auctionSchemas.bid }), async (req, res) => {
  try {
    const { id } = req.params;
    const { bidAmount } = req.body;
    const buyerId = req.user.id;

    const auctionDoc = await Auction.findById(id).lean();
    if (!auctionDoc) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const auction = auctionDoc;
    
    // Check if auction is still active
    if (auction.status !== 'active' || auction.stage !== 'bidding') {
      return res.status(400).json({ success: false, message: 'Auction is not accepting bids' });
    }

    // Check if auction has ended
    const endTime = new Date(auction.timeline?.biddingEndTime || auction.timeline?.endTime);
    if (new Date() > endTime) {
      return res.status(400).json({ success: false, message: 'Auction has ended' });
    }

    // Check if bid is valid
    const currentBid = auction.pricing.currentBid;
    const minIncrement = auction.pricing.minIncrement;
    
    if (bidAmount <= currentBid) {
      return res.status(400).json({ 
        success: false, 
        message: `Bid must be higher than current bid (₹${currentBid})` 
      });
    }

    if (bidAmount < currentBid + minIncrement) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum bid increment is ₹${minIncrement}` 
      });
    }

    // Get buyer details and enforce approval & escrow
    const { Buyer } = require('../models/User');
    const buyer = await Buyer.findById(buyerId).lean();
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }
    const isApproved = buyer.verification?.isVerified || buyer.isApproved;
    if (!isApproved) {
      return res.status(403).json({ success: false, message: 'Buyer is not approved to bid' });
    }
    if (!buyer.escrowBalance || buyer.escrowBalance <= 0) {
      return res.status(403).json({ success: false, message: 'Insufficient escrow balance' });
    }
    const buyerData = { firstName: buyer.firstName || '', lastName: buyer.lastName || '' };

    // Create bid entry for bid history
    const bidEntry = {
      bidderId: buyerId,
      bidderName: `${buyerData.firstName || ''} ${buyerData.lastName || ''}`.trim(),
      amount: parseFloat(bidAmount),
      timestamp: new Date().toISOString()
    };

    // Create bid document (persist to bids collection)
    await Bid.create({ auctionId: id, buyerId, amount: parseFloat(bidAmount) });

    const updatedBidHistory = [...(auction.stageDetails?.bidding?.bidHistory || []), bidEntry];

    await Auction.updateOne(
      { _id: id },
      {
        $set: {
          'pricing.currentBid': parseFloat(bidAmount),
          'stageDetails.bidding.totalBids': (auction.stageDetails?.bidding?.totalBids || 0) + 1,
          'stageDetails.bidding.highestBid': parseFloat(bidAmount),
          'stageDetails.bidding.highestBidder': buyerId,
          'stageDetails.bidding.bidHistory': updatedBidHistory,
          'stats.totalBids': (auction.stats?.totalBids || 0) + 1,
          'stats.averageBidAmount': updatedBidHistory.reduce((sum, bid) => sum + bid.amount, 0) / updatedBidHistory.length,
          updatedAt: new Date()
        }
      }
    );
    // Emit websocket event for bid update
    const io = req.app.get('io');
    if (io) io.emit('auction:bid', { auctionId: id, amount: parseFloat(bidAmount), bidderId: buyerId });

    res.json({ success: true, message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ success: false, message: 'Failed to place bid' });
  }
});

// Update auction stage
router.put('/:id/stage', authenticateToken, celebrate({ body: auctionSchemas.updateStage }), async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, stageData } = req.body;
    const userId = req.user.id;

    const auctionDoc = await Auction.findById(id).lean();
    if (!auctionDoc) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    const auction = auctionDoc;
    const validStages = ['bidding', 'harvesting', 'loading', 'billing', 'in_transit', 'delivery', 'completed'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: 'Invalid stage' });
    }

    // Check permissions based on stage
    if (stage === 'harvesting' && auction.farmerId !== userId) {
      return res.status(403).json({ success: false, message: 'Only the farmer can update harvesting stage' });
    }

    if (stage === 'delivery' && auction.winner?.buyerId !== userId) {
      return res.status(403).json({ success: false, message: 'Only the winning buyer can confirm delivery' });
    }

    const updateData = {
      stage,
      updatedAt: new Date()
    };

    // Update stage-specific details
    if (stageData) {
      updateData[`stageDetails.${stage}`] = {
        ...auction.stageDetails[stage],
        ...stageData,
        updatedAt: new Date()
      };
    }

    // Handle stage transitions
    if (stage === 'harvesting' && auction.stage === 'bidding') {
      // Ensure auction bidding window has ended
      const endTime = new Date(auction.timeline?.biddingEndTime || auction.timeline?.endTime);
      if (new Date() <= endTime) {
        return res.status(400).json({ success: false, message: 'Auction has not ended yet' });
      }
      if (!auction.stageDetails?.bidding?.highestBidder) {
        return res.status(400).json({ success: false, message: 'No bids received for this auction' });
      }
      // Set winner (id and name) and advance to harvesting
      updateData.winnerId = auction.stageDetails.bidding.highestBidder;
      try {
        const { Buyer } = require('../models/User');
        const wb = await Buyer.findById(updateData.winnerId).lean();
        if (wb) updateData.winnerName = `${wb.firstName || ''} ${wb.lastName || ''}`.trim();
      } catch {}
      updateData.status = 'active';
    }

    if (stage === 'completed') {
      updateData.status = 'completed';
    }

    await Auction.updateOne({ _id: id }, { $set: updateData });

    // Create tracking record
    // Tracking collection omitted during initial migration

    res.json({
      success: true,
      message: `Auction moved to ${stage} stage`,
      auction: { id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating auction stage:', error);
    res.status(500).json({ success: false, message: 'Failed to update auction stage' });
  }
});

// Update tracking for in-transit stage
router.post('/:id/tracking', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { location, status, notes } = req.body;
    const userId = req.user.id;

    const auctionDoc = await Auction.findById(id).lean();
    if (!auctionDoc) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    const auction = auctionDoc;

    if (auction.stage !== 'in_transit') {
      return res.status(400).json({ success: false, message: 'Auction is not in transit' });
    }

    const trackingUpdate = {
      timestamp: new Date(),
      location,
      status,
      notes,
      updatedBy: userId
    };

    await Auction.updateOne(
      { _id: id },
      {
        $push: { 'stageDetails.inTransit.trackingUpdates': trackingUpdate },
        $set: { 'stageDetails.inTransit.currentLocation': location, updatedAt: new Date() }
      }
    );

    res.json({
      success: true,
      message: 'Tracking update added',
      trackingUpdate
    });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ success: false, message: 'Failed to update tracking' });
  }
});

// Get farmer's auctions
router.get('/farmer/:farmerId', authenticateToken, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check if user is requesting their own auctions or is admin
    if (req.user.id !== farmerId && !['admin', 'super_admin'].includes(req.user.userType)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const auctions = await Auction.find({ farmerId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, auctions: auctions.map(a => ({ id: a._id.toString(), ...a })) });
  } catch (error) {
    console.error('Error fetching farmer auctions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch auctions' });
  }
});

// Get buyer's won auctions
router.get('/buyer/:buyerId', authenticateToken, async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    // Check if user is requesting their own auctions or is admin
    if (req.user.id !== buyerId && !['admin', 'super_admin'].includes(req.user.userType)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const auctions = await Auction.find({ winnerId: buyerId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, auctions: auctions.map(a => ({ id: a._id.toString(), ...a })) });
  } catch (error) {
    console.error('Error fetching buyer auctions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch auctions' });
  }
});

// Serve uploaded images
router.get('/uploads/auctions/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads/auctions', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ success: false, message: 'Image not found' });
  }
});

// Delete auction (farmer only)
router.delete('/:id', authenticateToken, requireRole(['farmer']), async (req, res) => {
  try {
    const { id } = req.params;
    const auctionDoc = await Auction.findById(id).lean();
    if (!auctionDoc) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    const auction = auctionDoc;
    
    if (auction.farmerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own auctions' });
    }

    if (auction.status !== 'draft' && auction.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cannot delete auction in progress or completed' });
    }

    await Auction.deleteOne({ _id: id });
    // Associated bids deletion to be implemented with bids model

    res.json({ success: true, message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ success: false, message: 'Failed to delete auction' });
  }
});

module.exports = router;
