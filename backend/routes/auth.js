const express = require('express');
const bcrypt = require('bcryptjs');
const { celebrate, Joi } = require('celebrate');
const { Farmer, Buyer, Admin, SuperAdmin } = require('../models/User');
const { generateToken, authenticateToken, requireRole } = require('../middleware/auth');
const { authSchemas } = require('../middleware/validation');
const { rateLimits } = require('../middleware/rateLimits');

const router = express.Router();

// Helper function to create user document based on Firestore schema
const createUserDocument = async (userData) => {
  const { email, password, userType, ...additionalData } = userData;
  
  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Base user document structure
  const baseDoc = {
    email,
    password: hashedPassword,
    userType,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  
  // Add user-specific fields based on type
  if (userType === 'farmer') {
    return {
      ...baseDoc,
      ...additionalData,
      verification: {
        isVerified: false,
        kycStatus: 'pending',
        documents: {},
        verifiedAt: null,
        verifiedBy: null
      },
      stats: {
        totalAuctions: 0,
        completedAuctions: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalReviews: 0
      }
    };
  } else if (userType === 'buyer') {
    return {
      ...baseDoc,
      ...additionalData,
      verification: {
        isVerified: false,
        kycStatus: 'pending',
        documents: {},
        verifiedAt: null,
        verifiedBy: null
      },
      preferences: {
        preferredCategories: [],
        maxDistance: 100,
        preferredPaymentMethods: ['upi', 'bank_transfer'],
        notificationSettings: {
          email: true,
          sms: true,
          push: true
        }
      },
      stats: {
        totalPurchases: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        averageRating: 0,
        totalReviews: 0
      }
    };
  } else if (userType === 'admin') {
    return {
      ...baseDoc,
      ...additionalData,
      stats: {
        usersVerified: 0,
        disputesResolved: 0,
        auctionsManaged: 0,
        lastActiveAt: new Date().toISOString()
      }
    };
  } else if (userType === 'super_admin') {
    return {
      ...baseDoc,
      ...additionalData,
      stats: {
        totalAdminsManaged: 0,
        systemUptime: 99.9,
        lastSystemBackup: null,
        lastActiveAt: new Date().toISOString()
      }
    };
  }
  
  return baseDoc;
};

// Helper function to validate user credentials
const validateUserCredentials = async (email, password, userType) => {
  try {
    const Model = userType === 'farmer' ? Farmer :
                  userType === 'buyer' ? Buyer :
                  userType === 'admin' ? Admin :
                  userType === 'super_admin' ? SuperAdmin : null;
    if (!Model) return null;

    const userDoc = await Model.findOne({ email }).lean();
    if (!userDoc) return null;

    const isValidPassword = await bcrypt.compare(password, userDoc.password);
    if (!isValidPassword) return null;

    return {
      id: userDoc._id.toString(),
      ...userDoc
    };
  } catch (error) {
    console.error('Error validating user credentials:', error);
    return null;
  }
};

// Farmer Registration
router.post('/farmer/register', celebrate({ body: authSchemas.farmerRegister }), async (req, res) => {
  try {
    const { 
      email, password, firstName, lastName, phone, 
      address, farmDetails, businessInfo 
    } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Optional additional validation for profile completeness
    if (!address || !address.city) {
      // Not fatal: defaulting address
    }
    if (!farmDetails || !farmDetails.farmName) {
      // Not fatal: defaulting farm details
    }
    
    // Check if user already exists
    const existingUser = await Farmer.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Create user document with Firestore schema
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone: phone || '',
      profileImage: '',
      address: address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      farmDetails: farmDetails || {
        farmName: '',
        farmSize: 0,
        farmType: 'conventional',
        crops: [],
        certification: [],
        establishedYear: new Date().getFullYear()
      },
      businessInfo: businessInfo || {
        gstNumber: '',
        panNumber: '',
        bankDetails: {
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          accountHolderName: ''
        }
      },
      userType: 'farmer'
    };
    
    const userDoc = await createUserDocument(userData);
    const created = await Farmer.create(userDoc);
    
    // Generate token
    const token = generateToken({
      id: created._id.toString(),
      email: userDoc.email,
      userType: userDoc.userType
    });
    
    res.status(201).json({
      message: 'Farmer registered successfully',
      token,
      user: {
        id: created._id.toString(),
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        userType: userDoc.userType,
        verification: userDoc.verification,
        stats: userDoc.stats
      }
    });
    
  } catch (error) {
    console.error('Farmer registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Buyer Registration
router.post('/buyer/register', celebrate({ body: authSchemas.buyerRegister }), async (req, res) => {
  try {
    const { 
      email, password, firstName, lastName, phone, 
      address, businessInfo 
    } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!address || !address.city) {
      // default address
    }
    if (!businessInfo) {
      // default businessInfo
    }
    
    // Check if user already exists
    const existingUser = await Buyer.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Create user document with Firestore schema
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone: phone || '',
      profileImage: '',
      address: address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      businessInfo: businessInfo || {
        businessName: '',
        businessType: 'wholesale',
        gstNumber: '',
        panNumber: '',
        businessLicense: '',
        bankDetails: {
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          accountHolderName: ''
        }
      },
      userType: 'buyer'
    };
    
    const userDoc = await createUserDocument(userData);
    const created = await Buyer.create(userDoc);
    
    // Generate token
    const token = generateToken({
      id: created._id.toString(),
      email: userDoc.email,
      userType: userDoc.userType
    });
    
    res.status(201).json({
      message: 'Buyer registered successfully',
      token,
      user: {
        id: created._id.toString(),
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        userType: userDoc.userType,
        verification: userDoc.verification,
        preferences: userDoc.preferences,
        stats: userDoc.stats
      }
    });
    
  } catch (error) {
    console.error('Buyer registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Registration
router.post('/admin/register', authenticateToken, requireRole(['super_admin']), celebrate({ body: authSchemas.register }), async (req, res) => {
  try {
    const { 
      email, password, firstName, lastName, phone, 
      address, adminDetails 
    } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Create user document with Firestore schema
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone: phone || '',
      profileImage: '',
      address: address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      adminDetails: adminDetails || {
        employeeId: '',
        department: 'operations',
        designation: 'Admin',
        permissions: ['user_verification', 'auction_management'],
        reportingManager: req.user.id
      },
      userType: 'admin'
    };
    
    const userDoc = await createUserDocument(userData);
    const created = await Admin.create(userDoc);
    
    // Generate token
    const token = generateToken({
      id: created._id.toString(),
      email: userDoc.email,
      userType: userDoc.userType
    });
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: created._id.toString(),
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        userType: userDoc.userType,
        adminDetails: userDoc.adminDetails,
        stats: userDoc.stats
      }
    });
    
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Super Admin Registration (Protected route)
router.post('/super-admin/register', authenticateToken, requireRole(['super_admin']), celebrate({ body: authSchemas.register }), async (req, res) => {
  try {
    const { 
      email, password, firstName, lastName, phone, 
      address, superAdminDetails 
    } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await SuperAdmin.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Create user document with Firestore schema
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone: phone || '',
      profileImage: '',
      address: address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      superAdminDetails: superAdminDetails || {
        employeeId: '',
        designation: 'Super Admin',
        permissions: ['system_administration', 'user_management', 'admin_management'],
        accessLevel: 'full'
      },
      userType: 'super_admin'
    };
    
    const userDoc = await createUserDocument(userData);
    const created = await SuperAdmin.create(userDoc);
    
    // Generate token
    const token = generateToken({
      id: created._id.toString(),
      email: userDoc.email,
      userType: userDoc.userType
    });
    
    res.status(201).json({
      message: 'Super Admin registered successfully',
      token,
      user: {
        id: created._id.toString(),
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        userType: userDoc.userType,
        superAdminDetails: userDoc.superAdminDetails,
        stats: userDoc.stats
      }
    });
    
  } catch (error) {
    console.error('Super Admin registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login for all user types
router.post('/login', rateLimits.auth, celebrate({ body: authSchemas.login }), async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate user type
    const validUserTypes = ['farmer', 'buyer', 'admin', 'super_admin'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    
    // Validate credentials
    const user = await validateUserCredentials(email, password, userType);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
    
    // Update last login time
    const Model = userType === 'farmer' ? Farmer :
                  userType === 'buyer' ? Buyer :
                  userType === 'admin' ? Admin :
                  userType === 'super_admin' ? SuperAdmin : null;
    if (Model) {
      await Model.updateOne({ _id: user.id }, { $set: { lastLoginAt: new Date(), updatedAt: new Date() } });
    }
    
    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      userType: user.userType
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userType = req.user.userType;
    const Model = userType === 'farmer' ? Farmer :
                  userType === 'buyer' ? Buyer :
                  userType === 'admin' ? Admin :
                  userType === 'super_admin' ? SuperAdmin : null;
    if (!Model) return res.status(400).json({ message: 'Invalid user type' });

    const userDoc = await Model.findById(req.user.id).lean();
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    const { password, ...userWithoutPassword } = userDoc;
    res.json({ user: { id: userDoc._id.toString(), ...userWithoutPassword } });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile (JSON fields)
router.put('/profile', authenticateToken, celebrate({ body: authSchemas.updateProfile }), async (req, res) => {
  try {
    const userType = req.user.userType;
    const Model = userType === 'farmer' ? Farmer :
                  userType === 'buyer' ? Buyer :
                  userType === 'admin' ? Admin :
                  userType === 'super_admin' ? SuperAdmin : null;
    if (!Model) return res.status(400).json({ message: 'Invalid user type' });

    const updateData = {
      updatedAt: new Date()
    };
    
    // Update basic fields
    const { firstName, lastName, phone, address, profileImage } = req.body;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profileImage) updateData.profileImage = profileImage;
    
    // Update user-specific fields
    if (userType === 'farmer') {
      const { farmDetails, businessInfo } = req.body;
      if (farmDetails) updateData.farmDetails = farmDetails;
      if (businessInfo) updateData.businessInfo = businessInfo;
    } else if (userType === 'buyer') {
      const { businessInfo, preferences } = req.body;
      if (businessInfo) updateData.businessInfo = businessInfo;
      if (preferences) updateData.preferences = preferences;
    } else if (userType === 'admin') {
      const { adminDetails } = req.body;
      if (adminDetails) updateData.adminDetails = adminDetails;
    } else if (userType === 'super_admin') {
      const { superAdminDetails } = req.body;
      if (superAdminDetails) updateData.superAdminDetails = superAdminDetails;
    }
    
    await Model.updateOne({ _id: req.user.id }, { $set: updateData });
    
    res.json({ message: 'Profile updated successfully' });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const userType = req.user.userType;
    const Model = userType === 'farmer' ? Farmer :
                  userType === 'buyer' ? Buyer :
                  userType === 'admin' ? Admin :
                  userType === 'super_admin' ? SuperAdmin : null;
    if (!Model) return res.status(400).json({ message: 'Invalid user type' });

    const userData = await Model.findById(req.user.id).lean();
    if (!userData) return res.status(404).json({ message: 'User not found' });
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await Model.updateOne({ _id: req.user.id }, { $set: { password: hashedNewPassword, updatedAt: new Date() } });
    
    res.json({ message: 'Password changed successfully' });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

// Additional listing routes for public directories
// List farmers (basic public info)
router.get('/list/farmers', async (req, res) => {
  try {
    const docs = await Farmer.find({}, {
      email: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      profileImage: 1,
      address: 1,
      verification: 1,
      stats: 1,
      farmDetails: 1,
      createdAt: 1
    }).lean();
    const farmers = docs.map(d => ({ id: d._id.toString(), ...d }));
    res.json({ farmers });
  } catch (e) {
    console.error('List farmers error:', e);
    res.status(500).json({ message: 'Failed to list farmers' });
  }
});

// List buyers (basic public info)
router.get('/list/buyers', async (req, res) => {
  try {
    const docs = await Buyer.find({}, {
      email: 1,
      firstName: 1,
      lastName: 1,
      phone: 1,
      profileImage: 1,
      address: 1,
      verification: 1,
      stats: 1,
      businessInfo: 1,
      createdAt: 1
    }).lean();
    const buyers = docs.map(d => ({ id: d._id.toString(), ...d }));
    res.json({ buyers });
  } catch (e) {
    console.error('List buyers error:', e);
    res.status(500).json({ message: 'Failed to list buyers' });
  }
});

