const mongoose = require('mongoose');

const BidHistorySchema = new mongoose.Schema({
	bidderId: { type: String, required: true },
	bidderName: { type: String, default: '' },
	amount: { type: Number, required: true },
	timestamp: { type: Date, default: () => new Date() }
}, { _id: false });

const AuctionSchema = new mongoose.Schema({
	// Basic
	title: { type: String, default: '' },
	productName: { type: String, required: true },
	category: { type: String, default: '' },
	description: { type: String, default: '' },

	// Product Details
	productDetails: {
		quantity: { type: Number, required: true },
		unit: { type: String, required: true },
		quality: { type: String, default: 'standard' },
		grade: { type: String, default: 'A' },
		variety: { type: String, default: '' },
		harvestDate: { type: Date, default: () => new Date() },
		expiryDate: { type: Date, default: () => new Date(Date.now() + 365*24*60*60*1000) },
		storageConditions: { type: String, default: 'Cool, dry place' }
	},

	// Pricing
	pricing: {
		basePrice: { type: Number, required: true },
		minIncrement: { type: Number, default: 50 },
		reservePrice: { type: Number },
		currentBid: { type: Number },
		instantBuyPrice: { type: Number },
		currency: { type: String, default: 'INR' }
	},

	images: { type: [String], default: [] },

	// Participants
	farmerId: { type: String, required: true, index: true },
	farmerName: { type: String, default: '' },
	winnerId: { type: String, default: null },
	winnerName: { type: String, default: null },

	// Timeline
	timeline: {
		startTime: { type: Date, default: () => new Date() },
		endTime: { type: Date, required: true },
		biddingStartTime: { type: Date, default: () => new Date() },
		biddingEndTime: { type: Date, required: true },
		harvestingStartTime: { type: Date, default: null },
		harvestingEndTime: { type: Date, default: null },
		loadingStartTime: { type: Date, default: null },
		loadingEndTime: { type: Date, default: null },
		deliveryStartTime: { type: Date, default: null },
		deliveryEndTime: { type: Date, default: null }
	},

	status: { type: String, default: 'active' },
	stage: { type: String, default: 'bidding' },
	stageDetails: {
		bidding: {
			startTime: { type: Date, default: () => new Date() },
			endTime: { type: Date, required: true },
			totalBids: { type: Number, default: 0 },
			highestBid: { type: Number },
			bidHistory: { type: [BidHistorySchema], default: [] }
		}
	},

	location: {
		farmAddress: { type: String, default: '' },
		coordinates: {
			latitude: { type: Number, default: 0 },
			longitude: { type: Number, default: 0 }
		},
		deliveryRadius: { type: Number, default: 200 },
		deliveryOptions: { type: [String], default: ['pickup', 'delivery'] },
		estimatedDeliveryTime: { type: String, default: '72 hours' }
	},

	terms: {
		paymentTerms: { type: String, default: '50% advance, 50% on delivery' },
		deliveryTerms: { type: String, default: 'Within 72 hours of payment' },
		returnPolicy: { type: String, default: '7 days return policy' },
		qualityGuarantee: { type: String, default: '100% quality guarantee' }
	},

	stats: {
		totalBids: { type: Number, default: 0 },
		totalViews: { type: Number, default: 0 },
		totalWatchers: { type: Number, default: 0 },
		averageBidAmount: { type: Number, default: 0 }
	},

	isActive: { type: Boolean, default: true },
	isFeatured: { type: Boolean, default: false },
	createdAt: { type: Date, default: () => new Date() },
	updatedAt: { type: Date, default: () => new Date() },
	createdBy: { type: String }
}, { versionKey: false });

module.exports = mongoose.model('Auction', AuctionSchema, 'auctions');


