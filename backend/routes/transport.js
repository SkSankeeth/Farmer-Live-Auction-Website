const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { db } = require('../config/firebase');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { transportSchemas } = require('../middleware/validation');

const router = express.Router();

// Create transport request
router.post('/request', authenticateToken, requireRole(['buyer']), celebrate({ body: transportSchemas.create }), async (req, res) => {
  try {
    const {
      auctionId,
      pickupLocation,
      deliveryLocation,
      deliveryDate,
      specialRequirements,
      preferredVehicleType,
      estimatedWeight,
      isUrgent
    } = req.body;

    const buyerId = req.user.id;

    // Check if auction exists and buyer is the winner
    const auctionRef = db.collection('auctions').doc(auctionId);
    const auctionDoc = await auctionRef.get();

    if (!auctionDoc.exists) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const auction = auctionDoc.data();
    
    if (auction.winner?.buyerId !== buyerId) {
      return res.status(403).json({ success: false, message: 'Only the auction winner can request transport' });
    }

    if (auction.stage !== 'billing' && auction.stage !== 'in_transit') {
      return res.status(400).json({ success: false, message: 'Transport can only be requested during billing or in-transit stage' });
    }

    // Check if transport request already exists
    const existingRequest = await db.collection('transportRequests')
      .where('auctionId', '==', auctionId)
      .where('buyerId', '==', buyerId)
      .get();

    if (!existingRequest.empty) {
      return res.status(400).json({ success: false, message: 'Transport request already exists for this auction' });
    }

    const requestData = {
      auctionId,
      buyerId,
      farmerId: auction.farmerId,
      requestDetails: {
        pickupLocation,
        deliveryLocation,
        deliveryDate: new Date(deliveryDate),
        specialRequirements: specialRequirements || '',
        preferredVehicleType: preferredVehicleType || 'truck',
        estimatedWeight: parseFloat(estimatedWeight) || 0,
        isUrgent: isUrgent || false
      },
      status: 'pending',
      timeline: {
        requestedAt: new Date()
      },
      tracking: {
        currentLocation: pickupLocation,
        statusUpdates: [{
          timestamp: new Date(),
          location: pickupLocation,
          status: 'requested',
          notes: 'Transport request submitted by buyer',
          updatedBy: buyerId
        }]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('transportRequests').add(requestData);

    // Update auction with transport request
    await auctionRef.update({
      'transportRequest.requested': true,
      'transportRequest.requestId': docRef.id,
      'transportRequest.status': 'pending',
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Transport request created successfully',
      request: { id: docRef.id, ...requestData }
    });
  } catch (error) {
    console.error('Error creating transport request:', error);
    res.status(500).json({ success: false, message: 'Failed to create transport request' });
  }
});

// Get transport requests for farmer
router.get('/farmer/:farmerId', authenticateToken, requireRole(['farmer', 'farmer_admin']), async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check if user is requesting their own requests or is admin
    if (req.user.id !== farmerId && req.user.userType !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const snapshot = await db.collection('transportRequests')
      .where('farmerId', '==', farmerId)
      .orderBy('createdAt', 'desc')
      .get();

    const requests = [];
    snapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching transport requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transport requests' });
  }
});

// Get transport requests for buyer
router.get('/buyer/:buyerId', authenticateToken, requireRole(['buyer']), async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    if (req.user.id !== buyerId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const snapshot = await db.collection('transportRequests')
      .where('buyerId', '==', buyerId)
      .orderBy('createdAt', 'desc')
      .get();

    const requests = [];
    snapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching transport requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transport requests' });
  }
});

// Get transport requests for transporter
router.get('/transporter/:transporterId', authenticateToken, requireRole(['transporter']), async (req, res) => {
  try {
    const { transporterId } = req.params;
    
    if (req.user.id !== transporterId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const snapshot = await db.collection('transportRequests')
      .where('assignedTransporter.transporterId', '==', transporterId)
      .orderBy('createdAt', 'desc')
      .get();

    const requests = [];
    snapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching transport requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transport requests' });
  }
});

// Get available transport requests for transporters
router.get('/available', authenticateToken, requireRole(['transporter']), async (req, res) => {
  try {
    const transporterId = req.user.id;

    // Get transporter's service areas
    const transporterDoc = await db.collection('transporters').doc(transporterId).get();
    if (!transporterDoc.exists) {
      return res.status(404).json({ success: false, message: 'Transporter profile not found' });
    }

    const transporter = transporterDoc.data();
    const serviceAreas = transporter.serviceAreas || [];

    // Get approved transport requests in service areas
    const snapshot = await db.collection('transportRequests')
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .get();

    const availableRequests = [];
    snapshot.forEach(doc => {
      const request = doc.data();
      // Filter by service areas
      const pickupLocation = request.requestDetails.pickupLocation;
      const deliveryLocation = request.requestDetails.deliveryLocation;
      
      if (serviceAreas.some(area => 
        pickupLocation.toLowerCase().includes(area.toLowerCase()) ||
        deliveryLocation.toLowerCase().includes(area.toLowerCase())
      )) {
        availableRequests.push({ id: doc.id, ...request });
      }
    });

    res.json({ success: true, requests: availableRequests });
  } catch (error) {
    console.error('Error fetching available transport requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch available requests' });
  }
});

// Update transport request status (farmer approval/rejection)
router.put('/request/:requestId/status', authenticateToken, requireRole(['farmer', 'farmer_admin']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const requestRef = db.collection('transportRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ success: false, message: 'Transport request not found' });
    }

    const request = requestDoc.data();
    
    if (request.farmerId !== userId && req.user.userType !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only the farmer can update this request' });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'approved') {
      updateData.timeline = {
        ...request.timeline,
        approvedAt: new Date()
      };
    }

    // Add status update to tracking
    const statusUpdate = {
      timestamp: new Date(),
      location: request.requestDetails.pickupLocation,
      status: status,
      notes: notes || `Request ${status} by farmer`,
      updatedBy: userId
    };

    updateData.tracking = {
      ...request.tracking,
      statusUpdates: [...request.tracking.statusUpdates, statusUpdate]
    };

    await requestRef.update(updateData);

    // Update auction transport request status
    const auctionRef = db.collection('auctions').doc(request.auctionId);
    await auctionRef.update({
      'transportRequest.status': status,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: `Transport request ${status}`,
      request: { id: requestId, ...updateData }
    });
  } catch (error) {
    console.error('Error updating transport request status:', error);
    res.status(500).json({ success: false, message: 'Failed to update request status' });
  }
});

// Assign transporter to transport request
router.put('/request/:requestId/assign', authenticateToken, requireRole(['farmer', 'farmer_admin', 'transporter']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { transporterId, vehicleDetails, driverDetails, pricing } = req.body;
    const userId = req.user.id;

    const requestRef = db.collection('transportRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ success: false, message: 'Transport request not found' });
    }

    const request = requestDoc.data();

    // Check permissions
    const canAssign = req.user.userType === 'super_admin' || 
                    request.farmerId === userId || 
                    (req.user.userType === 'transporter' && transporterId === userId);

    if (!canAssign) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Request must be approved before assignment' });
    }

    // Get transporter details
    const transporterDoc = await db.collection('transporters').doc(transporterId).get();
    if (!transporterDoc.exists) {
      return res.status(404).json({ success: false, message: 'Transporter not found' });
    }

    const transporter = transporterDoc.data();

    const assignmentData = {
      status: 'assigned',
      assignedTransporter: {
        transporterId,
        transporterName: transporter.businessName,
        vehicleDetails,
        driverDetails,
        assignedAt: new Date()
      },
      pricing,
      timeline: {
        ...request.timeline,
        assignedAt: new Date()
      },
      updatedAt: new Date()
    };

    // Add assignment update to tracking
    const statusUpdate = {
      timestamp: new Date(),
      location: request.requestDetails.pickupLocation,
      status: 'assigned',
      notes: `Assigned to ${transporter.businessName}`,
      updatedBy: userId
    };

    assignmentData.tracking = {
      ...request.tracking,
      statusUpdates: [...request.tracking.statusUpdates, statusUpdate]
    };

    await requestRef.update(assignmentData);

    // Update auction transport request status
    const auctionRef = db.collection('auctions').doc(request.auctionId);
    await auctionRef.update({
      'transportRequest.status': 'assigned',
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Transporter assigned successfully',
      request: { id: requestId, ...assignmentData }
    });
  } catch (error) {
    console.error('Error assigning transporter:', error);
    res.status(500).json({ success: false, message: 'Failed to assign transporter' });
  }
});

// Update transport status (transporter updates)
router.put('/request/:requestId/transport-status', authenticateToken, requireRole(['transporter']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, location, notes, estimatedDelivery } = req.body;
    const transporterId = req.user.id;

    const validStatuses = ['pickup_started', 'picked_up', 'in_transit', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const requestRef = db.collection('transportRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ success: false, message: 'Transport request not found' });
    }

    const request = requestDoc.data();
    
    if (request.assignedTransporter?.transporterId !== transporterId) {
      return res.status(403).json({ success: false, message: 'Only the assigned transporter can update status' });
    }

    const updateData = {
      status: status === 'delivered' ? 'delivered' : 'in_transit',
      updatedAt: new Date()
    };

    // Update timeline based on status
    if (status === 'picked_up') {
      updateData.timeline = {
        ...request.timeline,
        pickupAt: new Date()
      };
    } else if (status === 'delivered') {
      updateData.timeline = {
        ...request.timeline,
        deliveredAt: new Date()
      };
    }

    // Update tracking
    const statusUpdate = {
      timestamp: new Date(),
      location: location || request.tracking.currentLocation,
      status: status,
      notes: notes || `Status updated to ${status}`,
      updatedBy: transporterId
    };

    updateData.tracking = {
      currentLocation: location || request.tracking.currentLocation,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : request.tracking.estimatedDelivery,
      statusUpdates: [...request.tracking.statusUpdates, statusUpdate]
    };

    await requestRef.update(updateData);

    // Update auction transport request status
    const auctionRef = db.collection('auctions').doc(request.auctionId);
    await auctionRef.update({
      'transportRequest.status': status === 'delivered' ? 'delivered' : 'in_transit',
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: `Transport status updated to ${status}`,
      request: { id: requestId, ...updateData }
    });
  } catch (error) {
    console.error('Error updating transport status:', error);
    res.status(500).json({ success: false, message: 'Failed to update transport status' });
  }
});

// Get transport request by ID
router.get('/request/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const doc = await db.collection('transportRequests').doc(requestId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Transport request not found' });
    }

    const request = { id: doc.id, ...doc.data() };
    
    // Check if user has access to this request
    const hasAccess = req.user.id === request.buyerId || 
                     req.user.id === request.farmerId || 
                     req.user.id === request.assignedTransporter?.transporterId ||
                     req.user.userType === 'super_admin';

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, request });
  } catch (error) {
    console.error('Error fetching transport request:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transport request' });
  }
});

// Submit feedback for transport service
router.post('/request/:requestId/feedback', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const requestRef = db.collection('transportRequests').doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ success: false, message: 'Transport request not found' });
    }

    const request = requestDoc.data();
    
    // Check if user is buyer or farmer
    const isBuyer = request.buyerId === userId;
    const isFarmer = request.farmerId === userId;
    
    if (!isBuyer && !isFarmer) {
      return res.status(403).json({ success: false, message: 'Only buyer or farmer can submit feedback' });
    }

    if (request.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted after delivery' });
    }

    const updateData = {
      feedback: {
        ...request.feedback,
        submittedAt: new Date()
      },
      updatedAt: new Date()
    };

    if (isBuyer) {
      updateData.feedback.buyerRating = rating;
      updateData.feedback.buyerReview = review;
    } else if (isFarmer) {
      updateData.feedback.farmerRating = rating;
      updateData.feedback.farmerReview = review;
    }

    await requestRef.update(updateData);

    // Update transporter ratings
    if (request.assignedTransporter?.transporterId) {
      const transporterRef = db.collection('transporters').doc(request.assignedTransporter.transporterId);
      const transporterDoc = await transporterRef.get();
      
      if (transporterDoc.exists) {
        const transporter = transporterDoc.data();
        const reviews = transporter.ratings?.reviews || [];
        
        // Add new review
        reviews.push({
          userId,
          rating,
          review,
          timestamp: new Date()
        });

        // Calculate new average rating
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;

        await transporterRef.update({
          ratings: {
            averageRating,
            totalReviews: reviews.length,
            reviews
          },
          updatedAt: new Date()
        });
      }
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      request: { id: requestId, ...updateData }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
});

module.exports = router;

