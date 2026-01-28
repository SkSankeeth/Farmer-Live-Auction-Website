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

const BusinessInfoSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: { type: String, default: 'transport' },
  gstNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  businessLicense: { type: String, default: '' },
  bankDetails: {
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    accountHolderName: { type: String, default: '' }
  }
}, { _id: false });

const ServiceAreaSchema = new mongoose.Schema({
  cities: { type: [String], default: [] },
  states: { type: [String], default: [] },
  radius: { type: Number, default: 100 }
}, { _id: false });

const VehicleSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  make: { type: String, default: '' },
  model: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  capacity: { type: Number, required: true },
  licensePlate: { type: String, required: true },
  rcNumber: { type: String, default: '' },
  insuranceNumber: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const VerificationSchema = new mongoose.Schema({
  isVerified: { type: Boolean, default: false },
  documents: {
    businessLicense: { type: String, default: 'pending' },
    vehicleRC: { type: String, default: 'pending' },
    insurance: { type: String, default: 'pending' },
    permit: { type: String, default: 'pending' }
  },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: String, default: null }
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  isAvailable: { type: Boolean, default: true },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' }
  },
  workingDays: { type: [String], default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] },
  currentLocation: { type: String, default: '' }
}, { _id: false });

const PricingSchema = new mongoose.Schema({
  baseFare: { type: Number, required: true },
  distanceRate: { type: Number, default: 0 },
  weightRate: { type: Number, default: 0 },
  minimumFare: { type: Number, default: 0 }
}, { _id: false });

const StatsSchema = new mongoose.Schema({
  totalDeliveries: { type: Number, default: 0 },
  completedDeliveries: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { _id: false });

const TransporterSchema = new mongoose.Schema({
  // Basic Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  profileImage: { type: String, default: '' },
  
  // Business Information
  businessInfo: { type: BusinessInfoSchema, required: true },
  
  // Address
  address: { type: AddressSchema, default: () => ({}) },
  
  // Service Area
  serviceArea: { type: ServiceAreaSchema, required: true },
  
  // Vehicle Fleet
  vehicleFleet: { type: [VehicleSchema], default: [] },
  drivers: { type: [DriverSchema], default: [] },
  
  // Verification
  verification: { type: VerificationSchema, default: () => ({}) },
  
  // Availability
  availability: { type: AvailabilitySchema, default: () => ({}) },
  
  // Pricing
  pricing: { type: PricingSchema, required: true },
  
  // Statistics
  stats: { type: StatsSchema, default: () => ({}) },
  
  // System Fields
  userType: { type: String, default: 'transporter' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  lastLoginAt: { type: Date, default: () => new Date() }
}, { versionKey: false });

module.exports = mongoose.model('Transporter', TransporterSchema, 'transporters');




