const { Joi } = require('celebrate');

// Common validation schemas
const commonSchemas = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  phone: Joi.string().optional(),
  userType: Joi.string().valid('farmer', 'buyer', 'admin', 'super_admin', 'transporter').required(),
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  amount: Joi.number().positive().required(),
  stage: Joi.string().valid('bidding', 'harvesting', 'loading', 'billing', 'in_transit', 'delivery', 'completed').required()
};

// Auth validation schemas
const authSchemas = {
  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.firstName,
    lastName: commonSchemas.lastName,
    phone: commonSchemas.phone.optional(),
    userType: commonSchemas.userType.optional(),
    farmDetails: Joi.when('userType', {
      is: 'farmer',
      then: Joi.object({
        farmName: Joi.string().min(2).max(100).required(),
        farmSize: Joi.number().positive().required(),
      farmType: Joi.string().valid('crop', 'livestock', 'mixed', 'conventional', 'organic').required(),
        crops: Joi.array().items(Joi.string()).optional(),
        livestock: Joi.array().items(Joi.string()).optional()
      }).unknown(true).required(),
      otherwise: Joi.forbidden()
    }),
    businessDetails: Joi.when('userType', {
      is: Joi.string().valid('farmer', 'buyer'),
      then: Joi.object({
        gstNumber: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
        panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
        bankAccountNumber: Joi.string().pattern(/^[0-9]{9,18}$/).optional(),
        ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional()
      }).unknown(true).optional(),
      otherwise: Joi.forbidden()
    })
  }).unknown(true),

  // More lenient, role-specific schemas for dedicated endpoints
  farmerRegister: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.firstName,
    lastName: Joi.string().min(1).max(50).required(),
    phone: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      pincode: Joi.string().optional(),
      coordinates: Joi.object({ latitude: Joi.number().optional(), longitude: Joi.number().optional() }).optional()
    }).unknown(true).optional(),
    farmDetails: Joi.object({
      farmName: Joi.string().min(2).max(100).required(),
      farmSize: Joi.number().positive().optional(),
      farmType: Joi.string().valid('crop', 'livestock', 'mixed', 'conventional', 'organic').optional(),
      crops: Joi.array().items(Joi.string()).optional(),
      certification: Joi.array().items(Joi.string()).optional(),
      establishedYear: Joi.number().optional()
    }).unknown(true).required(),
    businessInfo: Joi.object({
      gstNumber: Joi.string().optional(),
      panNumber: Joi.string().optional(),
      bankDetails: Joi.object({
        accountNumber: Joi.string().optional(),
        ifscCode: Joi.string().optional(),
        bankName: Joi.string().optional(),
        accountHolderName: Joi.string().optional()
      }).unknown(true).optional()
    }).unknown(true).optional()
  }).unknown(true),

  buyerRegister: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.firstName,
    lastName: Joi.string().min(1).max(50).required(),
    phone: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      pincode: Joi.string().optional(),
      coordinates: Joi.object({ latitude: Joi.number().optional(), longitude: Joi.number().optional() }).optional()
    }).unknown(true).optional(),
    businessInfo: Joi.object({
      businessName: Joi.string().optional(),
      businessType: Joi.string().optional(),
      gstNumber: Joi.string().optional(),
      panNumber: Joi.string().optional(),
      bankDetails: Joi.object({
        accountNumber: Joi.string().optional(),
        ifscCode: Joi.string().optional(),
        bankName: Joi.string().optional(),
        accountHolderName: Joi.string().optional()
      }).unknown(true).optional()
    }).unknown(true).optional()
  }).unknown(true),

  login: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password
  }).unknown(true),

  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    phone: commonSchemas.phone.optional(),
    farmDetails: Joi.object({
      farmName: Joi.string().min(2).max(100).optional(),
      farmSize: Joi.number().positive().optional(),
      farmType: Joi.string().valid('crop', 'livestock', 'mixed', 'conventional', 'organic').optional(),
      crops: Joi.array().items(Joi.string()).optional(),
      livestock: Joi.array().items(Joi.string()).optional()
    }).unknown(true).optional(),
    businessDetails: Joi.object({
      gstNumber: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
      panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
      bankAccountNumber: Joi.string().pattern(/^[0-9]{9,18}$/).optional(),
      ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional()
    }).unknown(true).optional()
  }).unknown(true)
};

// Auction validation schemas
const auctionSchemas = {
  // Match current auctions route body
  create: Joi.object({
    productName: Joi.string().min(3).max(200).required(),
    category: Joi.string().min(2).max(50).required(),
    quantity: Joi.alternatives().try(
      Joi.number().positive(),
      Joi.string().pattern(/^\d+(\.\d+)?$/)
    ).required(),
    basePrice: Joi.alternatives().try(
      Joi.number().positive(),
      Joi.string().pattern(/^\d+(\.\d+)?$/)
    ).required(),
    duration: Joi.alternatives().try(
      Joi.number().integer().min(1).max(60),
      Joi.string().pattern(/^\d+$/)
    ).required(),
    description: Joi.string().min(10).max(2000).required()
  }).unknown(true),

  bid: Joi.object({
    bidAmount: Joi.number().positive().required()
  }).unknown(true),

  updateStage: Joi.object({
    stage: commonSchemas.stage,
    stageData: Joi.object().unknown(true).optional(),
    notes: Joi.string().max(500).optional()
  }).unknown(true)
};

// Payment validation schemas
const paymentSchemas = {
  create: Joi.object({
    auctionId: commonSchemas.id,
    amount: commonSchemas.amount,
    paymentType: Joi.string().valid('partial', 'full').required(),
    notes: Joi.string().max(500).optional()
  }).unknown(true),

  release: Joi.object({
    paymentId: commonSchemas.id,
    notes: Joi.string().max(500).optional()
  }).unknown(true)
};

// Escrow validation schemas
const escrowSchemas = {
  deposit: Joi.object({
    amount: commonSchemas.amount
  }).unknown(true)
};

// Admin validation schemas
const adminSchemas = {
  approveBuyer: Joi.object({
    isApproved: Joi.boolean().required(),
    notes: Joi.string().max(500).optional()
  }).unknown(true)
};

// Transport validation schemas
const transportSchemas = {
  create: Joi.object({
    auctionId: commonSchemas.id,
    pickupLocation: Joi.string().min(5).max(200).required(),
    deliveryLocation: Joi.string().min(5).max(200).required(),
    deliveryDate: Joi.date().greater('now').required(),
    preferredVehicleType: Joi.string().valid('truck', 'van', 'trailer', 'other').optional(),
    estimatedWeight: Joi.number().min(0).optional(),
    specialRequirements: Joi.string().max(500).optional(),
    isUrgent: Joi.boolean().optional()
  }).unknown(true),

  update: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'in_transit', 'delivered', 'cancelled').required(),
    notes: Joi.string().max(500).optional()
  }).unknown(true)
};

module.exports = {
  commonSchemas,
  authSchemas,
  auctionSchemas,
  paymentSchemas,
  escrowSchemas,
  adminSchemas,
  transportSchemas
};
