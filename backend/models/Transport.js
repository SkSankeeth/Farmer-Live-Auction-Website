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

const CargoSchema = new mongoose.Schema({
  type: { type: String, required: true },
  weight: { type: Number, required: true },
  volume: { type: Number, default: 0 },
  description: { type: String, default: '' },
  specialRequirements: { type: String, default: '' }
}, { _id: false });

const VehicleDetailsSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  capacity: { type: Number, required: true },
  licensePlate: { type: String, default: '' },
  driverName: { type: String, default: '' },
  driverPhone: { type: String, default: '' }
}, { _id: false });

const PricingSchema = new mongoose.Schema({
  baseFare: { type: Number, required: true },
  distanceRate: { type: Number, default: 0 },
  weightRate: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' }
}, { _id: false });

const TrackingSchema = new mongoose.Schema({
  currentLocation: { type: String, default: '' },
  estimatedArrival: { type: Date, default: null },
  actualArrival: { type: Date, default: null },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'] },
  updates: [{
    timestamp: { type: Date, default: () => new Date() },
    location: { type: String, default: '' },
    status: { type: String, default: '' },
    notes: { type: String, default: '' }
  }]
}, { _id: false });

const FeedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, default: 0 },
  comment: { type: String, default: '' },
  submittedAt: { type: Date, default: () => new Date() },
  submittedBy: { type: String, default: '' }
}, { _id: false });

const TransportSchema = new mongoose.Schema({
  // Basic Information
  requestType: { type: String, required: true, enum: ['pickup', 'delivery', 'both'] },
  priority: { type: String, default: 'normal', enum: ['low', 'normal', 'high', 'urgent'] },
  
  // Participants
  farmerId: { type: String, required: true, index: true },
  buyerId: { type: String, required: true, index: true },
  transporterId: { type: String, default: null, index: true },
  
  // Contact Information
  farmerContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  buyerContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  
  // Location Details
  pickup: {
    address: { type: AddressSchema, default: () => ({}) },
    contactPerson: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    scheduledTime: { type: Date, default: null }
  },
  delivery: {
    address: { type: AddressSchema, default: () => ({}) },
    contactPerson: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    scheduledTime: { type: Date, default: null }
  },
  
  // Cargo Information
  cargo: { type: CargoSchema, required: true },
  
  // Vehicle Requirements
  vehicleDetails: { type: VehicleDetailsSchema, required: true },
  
  // Pricing
  pricing: { type: PricingSchema, required: true },
  
  // Tracking
  tracking: { type: TrackingSchema, default: () => ({}) },
  
  // Assignment
  assignedTransporter: {
    transporterId: { type: String, default: null },
    transporterName: { type: String, default: '' },
    vehicleDetails: { type: VehicleDetailsSchema, default: () => ({}) },
    assignedAt: { type: Date, default: null }
  },
  
  // Feedback
  feedback: { type: FeedbackSchema, default: () => ({}) },
  
  // Status
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'] },
  isActive: { type: Boolean, default: true },
  
  // System Fields
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  createdBy: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Transport', TransportSchema, 'transport');




