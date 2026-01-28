const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Bid } = require('../models/Bid');
const Auction = require('../models/Auction');

const router = express.Router();

// Get all bids for an auction
router.get('/auction/:auctionId', authenticateToken, async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await Bid.find({ auctionId }).sort({ bidTime: -1 }).lean();
    res.json({ success: true, bids });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bids' });
  }
});

// Get user's bids
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own bids or is admin
    if (req.user.id !== userId && req.user.userType !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const bids = await Bid.find({ buyerId: userId }).sort({ bidTime: -1 }).lean();
    res.json({ success: true, bids });
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bids' });
  }
});

// Cancel a bid (only if auction hasn't ended)
router.delete('/:bidId', authenticateToken, requireRole(['buyer']), async (req, res) => {
  try {
    const { bidId } = req.params;
    const buyerId = req.user.id;

    const bid = await Bid.findById(bidId).lean();
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }
    
    if (bid.buyerId !== buyerId) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own bids' });
    }

    // Check if auction has ended
    const auction = await Auction.findById(bid.auctionId).lean();
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const endTime = auction?.timeline?.biddingEndTime || auction?.endDate || auction?.endTime;
    if (endTime && new Date() > new Date(endTime)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel bid after auction has ended' });
    }

    await Bid.deleteOne({ _id: bidId });

    res.json({ success: true, message: 'Bid cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling bid:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel bid' });
  }
});

module.exports = router;

