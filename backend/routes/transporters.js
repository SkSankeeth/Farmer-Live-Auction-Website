const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Transporter = require('../models/Transporter');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/transporters';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'transporter-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  }
});

// Create transporter profile
router.post('/profile', authenticateToken, requireRole(['transporter']), upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'vehicleRC', maxCount: 5 },
  { name: 'insurance', maxCount: 5 },
  { name: 'permit', maxCount: 5 }
]), async (req, res) => {
  try {
    const transporterId = req.user.id;
    const {
      businessName,
      businessType,
      licenseNumber,
      serviceAreas,
      baseFare,
      perKmRate,
      perKgRate,
      urgencyCharge,
      vehicleFleet,
      address
    } = req.body;

    // Check if profile already exists
    const existingProfile = await db.collection('transporters').doc(transporterId).get();
    if (existingProfile.exists) {
      return res.status(400).json({ success: false, message: 'Transporter profile already exists' });
    }

    // Handle uploaded documents
    const documents = {};
    if (req.files) {
      if (req.files.businessLicense) {
        documents.businessLicense = `/api/transporters/uploads/transporters/${req.files.businessLicense[0].filename}`;
      }
      if (req.files.vehicleRC) {
        documents.vehicleRC = req.files.vehicleRC.map(file => 
          `/api/transporters/uploads/transporters/${file.filename}`
        );
      }
      if (req.files.insurance) {
        documents.insurance = req.files.insurance.map(file => 
          `/api/transporters/uploads/transporters/${file.filename}`
        );
      }
      if (req.files.permit) {
        documents.permit = req.files.permit.map(file => 
          `/api/transporters/uploads/transporters/${file.filename}`
        );
      }
    }

    const profileData = {
      // Basic Information
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profileImage: '',
      
      // Business Information
      businessInfo: {
        businessName,
        businessType: businessType || 'individual',
        gstNumber: '',
        panNumber: '',
        licenseNumber,
        businessLicense: documents.businessLicense || '',
        bankDetails: {
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          accountHolderName: ''
        }
      },
      
      // Location & Service Area
      address: address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      serviceArea: {
        cities: serviceAreas ? JSON.parse(serviceAreas) : [],
        states: [],
        maxDistance: 500,
        coverageRadius: 200
      },
      
      // Vehicle Fleet
      vehicleFleet: vehicleFleet ? JSON.parse(vehicleFleet) : [],
      
      // Driver Information
      drivers: [],
      
      // Verification & Status
      verification: {
        isVerified: false,
        kycStatus: 'pending',
        documents: {
          aadharCard: '',
          panCard: '',
          drivingLicense: '',
          vehicleRegistration: documents.vehicleRC || [],
          insurance: documents.insurance || []
        },
        verifiedAt: null,
        verifiedBy: null
      },
      
      // Availability & Pricing
      availability: {
        isAvailable: true,
        workingHours: {
          start: '06:00',
          end: '22:00'
        },
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        nextAvailableDate: new Date().toISOString()
      },
      pricing: {
        baseFare: parseFloat(baseFare) || 2000,
        distanceCharge: parseFloat(perKmRate) || 15,
        weightCharge: parseFloat(perKgRate) || 2,
        urgencyCharge: parseFloat(urgencyCharge) || 500,
        minimumCharge: 1000
      },
      
      // Statistics
      stats: {
        totalDeliveries: 0,
        completedDeliveries: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalReviews: 0,
        onTimeDeliveryRate: 0
      },
      
      // System Fields
      userType: 'transporter',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    await db.collection('transporters').doc(transporterId).set(profileData);

    res.status(201).json({
      success: true,
      message: 'Transporter profile created successfully',
      profile: { id: transporterId, ...profileData }
    });
  } catch (error) {
    console.error('Error creating transporter profile:', error);
    res.status(500).json({ success: false, message: 'Failed to create transporter profile' });
  }
});

// Get transporter profile
router.get('/profile/:transporterId', authenticateToken, async (req, res) => {
  try {
    const { transporterId } = req.params;
    
    const doc = await db.collection('transporters').doc(transporterId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Transporter profile not found' });
    }

    const profile = { id: doc.id, ...doc.data() };
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching transporter profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transporter profile' });
  }
});

// Update transporter profile
router.put('/profile/:transporterId', authenticateToken, requireRole(['transporter']), upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'vehicleRC', maxCount: 5 },
  { name: 'insurance', maxCount: 5 },
  { name: 'permit', maxCount: 5 }
]), async (req, res) => {
  try {
    const { transporterId } = req.params;
    
    if (req.user.id !== transporterId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const {
      businessName,
      businessType,
      licenseNumber,
      serviceAreas,
      baseFare,
      perKmRate,
      perKgRate,
      urgencyCharge,
      vehicleFleet,
      currentLocation,
      isAvailable
    } = req.body;

    const doc = await db.collection('transporters').doc(transporterId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Transporter profile not found' });
    }

    const existingProfile = doc.data();

    // Handle uploaded documents
    const documents = { ...existingProfile.documents };
    if (req.files) {
      if (req.files.businessLicense) {
        documents.businessLicense = `/api/transporters/uploads/transporters/${req.files.businessLicense[0].filename}`;
      }
      if (req.files.vehicleRC) {
        documents.vehicleRC = req.files.vehicleRC.map(file => 
          `/api/transporters/uploads/transporters/${file.filename}`
        );
      }
      if (req.files.insurance) {
        documents.insurance = req.files.insurance.map(file => 
          `/api/transporters/uploads/transporters/${file.filename}`
        );
      }
      if (req.files.permit) {
        documents.permit = req.files.permit.map(file => 
          `/api/transporters/uploads/transporters/${file.filename}`
        );
      }
    }

    const updateData = {
      businessName: businessName || existingProfile.businessName,
      businessType: businessType || existingProfile.businessType,
      licenseNumber: licenseNumber || existingProfile.licenseNumber,
      vehicleFleet: vehicleFleet ? JSON.parse(vehicleFleet) : existingProfile.vehicleFleet,
      serviceAreas: serviceAreas ? JSON.parse(serviceAreas) : existingProfile.serviceAreas,
      pricing: {
        baseFare: parseFloat(baseFare) || existingProfile.pricing.baseFare,
        perKmRate: parseFloat(perKmRate) || existingProfile.pricing.perKmRate,
        perKgRate: parseFloat(perKgRate) || existingProfile.pricing.perKgRate,
        urgencyCharge: parseFloat(urgencyCharge) || existingProfile.pricing.urgencyCharge
      },
      availability: {
        ...existingProfile.availability,
        isAvailable: isAvailable !== undefined ? isAvailable : existingProfile.availability.isAvailable,
        currentLocation: currentLocation || existingProfile.availability.currentLocation
      },
      documents,
      updatedAt: new Date()
    };

    await db.collection('transporters').doc(transporterId).update(updateData);

    res.json({
      success: true,
      message: 'Transporter profile updated successfully',
      profile: { id: transporterId, ...updateData }
    });
  } catch (error) {
    console.error('Error updating transporter profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update transporter profile' });
  }
});

// Get all transporters (for admin/farmer)
router.get('/', authenticateToken, requireRole(['farmer', 'farmer_admin', 'super_admin']), async (req, res) => {
  try {
    const { location, isAvailable } = req.query;
    
    let query = db.collection('transporters');

    if (isAvailable === 'true') {
      query = query.where('availability.isAvailable', '==', true);
    }

    const snapshot = await query.get();
    const transporters = [];
    
    snapshot.forEach(doc => {
      const transporter = { id: doc.id, ...doc.data() };
      
      // Filter by location if specified
      if (location) {
        const serviceAreas = transporter.serviceAreas || [];
        if (serviceAreas.some(area => 
          area.toLowerCase().includes(location.toLowerCase())
        )) {
          transporters.push(transporter);
        }
      } else {
        transporters.push(transporter);
      }
    });

    res.json({ success: true, transporters });
  } catch (error) {
    console.error('Error fetching transporters:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transporters' });
  }
});

// Update transporter availability
router.put('/:transporterId/availability', authenticateToken, requireRole(['transporter']), async (req, res) => {
  try {
    const { transporterId } = req.params;
    const { isAvailable, currentLocation } = req.body;
    
    if (req.user.id !== transporterId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updateData = {
      'availability.isAvailable': isAvailable,
      'availability.currentLocation': currentLocation || '',
      'availability.updatedAt': new Date(),
      updatedAt: new Date()
    };

    await db.collection('transporters').doc(transporterId).update(updateData);

    res.json({
      success: true,
      message: 'Availability updated successfully',
      availability: updateData
    });
  } catch (error) {
    console.error('Error updating transporter availability:', error);
    res.status(500).json({ success: false, message: 'Failed to update availability' });
  }
});

// Add vehicle to fleet
router.post('/:transporterId/vehicles', authenticateToken, requireRole(['transporter']), async (req, res) => {
  try {
    const { transporterId } = req.params;
    const { vehicleType, vehicleNumber, capacity, currentLocation } = req.body;
    
    if (req.user.id !== transporterId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const doc = await db.collection('transporters').doc(transporterId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Transporter profile not found' });
    }

    const profile = doc.data();
    const newVehicle = {
      vehicleId: Date.now().toString(),
      vehicleType,
      vehicleNumber,
      capacity: parseFloat(capacity),
      isAvailable: true,
      currentLocation: currentLocation || ''
    };

    const updatedFleet = [...profile.vehicleFleet, newVehicle];

    await db.collection('transporters').doc(transporterId).update({
      vehicleFleet: updatedFleet,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Vehicle added to fleet successfully',
      vehicle: newVehicle
    });
  } catch (error) {
    console.error('Error adding vehicle to fleet:', error);
    res.status(500).json({ success: false, message: 'Failed to add vehicle' });
  }
});

// Update vehicle status
router.put('/:transporterId/vehicles/:vehicleId', authenticateToken, requireRole(['transporter']), async (req, res) => {
  try {
    const { transporterId, vehicleId } = req.params;
    const { isAvailable, currentLocation } = req.body;
    
    if (req.user.id !== transporterId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const doc = await db.collection('transporters').doc(transporterId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Transporter profile not found' });
    }

    const profile = doc.data();
    const updatedFleet = profile.vehicleFleet.map(vehicle => {
      if (vehicle.vehicleId === vehicleId) {
        return {
          ...vehicle,
          isAvailable: isAvailable !== undefined ? isAvailable : vehicle.isAvailable,
          currentLocation: currentLocation || vehicle.currentLocation
        };
      }
      return vehicle;
    });

    await db.collection('transporters').doc(transporterId).update({
      vehicleFleet: updatedFleet,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Vehicle status updated successfully'
    });
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    res.status(500).json({ success: false, message: 'Failed to update vehicle status' });
  }
});

// Serve uploaded documents
router.get('/uploads/transporters/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads/transporters', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ success: false, message: 'Document not found' });
  }
});

module.exports = router;

