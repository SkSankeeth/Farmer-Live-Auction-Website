const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
	street: { type: String, default: '' },
	city: { type: String, default: '' },
	state: { type: String, default: '' },
	pincode: { type: String, default: '' },
	coordinates: {
		latitude: { type: Number, default: 0 },
		longitude: { type: Number, default: 0 }
	}
}, { _id: false });

const VerificationSchema = new mongoose.Schema({
	isVerified: { type: Boolean, default: false },
	kycStatus: { type: String, default: 'pending' },
	documents: { type: Object, default: {} },
	verifiedAt: { type: Date, default: null },
	verifiedBy: { type: String, default: null }
}, { _id: false });

const BankDetailsSchema = new mongoose.Schema({
	accountNumber: { type: String, default: '' },
	ifscCode: { type: String, default: '' },
	bankName: { type: String, default: '' },
	accountHolderName: { type: String, default: '' }
}, { _id: false });

const FarmerDetailsSchema = new mongoose.Schema({
	farmName: { type: String, default: '' },
	farmSize: { type: Number, default: 0 },
	farmType: { type: String, default: 'conventional' },
	crops: { type: [String], default: [] },
	certification: { type: [String], default: [] },
	establishedYear: { type: Number, default: new Date().getFullYear() },
	farmImage: { type: String, default: '' }
}, { _id: false });

const BusinessInfoSchema = new mongoose.Schema({
	businessName: { type: String, default: '' },
	businessType: { type: String, default: '' },
	gstNumber: { type: String, default: '' },
	panNumber: { type: String, default: '' },
	bankDetails: { type: BankDetailsSchema, default: () => ({}) }
}, { _id: false });

const PreferencesSchema = new mongoose.Schema({
	preferredCategories: { type: [String], default: [] },
	maxDistance: { type: Number, default: 100 },
	preferredPaymentMethods: { type: [String], default: ['upi', 'bank_transfer'] },
	notificationSettings: {
		email: { type: Boolean, default: true },
		sms: { type: Boolean, default: true },
		push: { type: Boolean, default: true }
	}
}, { _id: false });

const BaseUserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true, index: true },
	password: { type: String, required: true },
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	phone: { type: String, default: '' },
	profileImage: { type: String, default: '' },
	address: { type: AddressSchema, default: () => ({}) },
	userType: { type: String, enum: ['farmer', 'buyer', 'admin', 'super_admin', 'transporter'], required: true },
	isActive: { type: Boolean, default: true },
	verification: { type: VerificationSchema, default: () => ({}) },
	// Escrow balance for buyers (optional for others)
	escrowBalance: { type: Number, default: 0 },
	createdAt: { type: Date, default: () => new Date() },
	updatedAt: { type: Date, default: () => new Date() },
	lastLoginAt: { type: Date, default: () => new Date() },

	// Role-specific
	farmDetails: { type: FarmerDetailsSchema, default: undefined },
	businessInfo: { type: BusinessInfoSchema, default: undefined },
	preferences: { type: PreferencesSchema, default: undefined },
	adminDetails: { type: Object, default: undefined },
	superAdminDetails: { type: Object, default: undefined },

	// Stats (kept flexible)
	stats: { type: Object, default: {} }
}, { versionKey: false });

// Create distinct collections per role for backward compatibility with existing code expectations
const Farmer = mongoose.model('Farmer', BaseUserSchema, 'farmers');
const Buyer = mongoose.model('Buyer', BaseUserSchema, 'buyers');
const Admin = mongoose.model('Admin', BaseUserSchema, 'admins');
const SuperAdmin = mongoose.model('SuperAdmin', BaseUserSchema, 'super_admins');

module.exports = { Farmer, Buyer, Admin, SuperAdmin };






