const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  auctionId: { type: String, required: true, index: true },
  buyerId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  bidTime: { type: Date, default: () => new Date(), index: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' }
}, { versionKey: false });

const Bid = mongoose.model('Bid', BidSchema, 'bids');

module.exports = { Bid };





