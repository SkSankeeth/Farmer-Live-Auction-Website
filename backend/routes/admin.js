const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Buyer } = require('../models/User');
const { adminSchemas } = require('../middleware/validation');

const router = express.Router();

// Approve/Reject buyer (admin or super_admin)
router.put('/buyers/:id/approve', authenticateToken, requireRole(['admin', 'super_admin']), celebrate({ body: adminSchemas.approveBuyer }), async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    await Buyer.updateOne({ _id: id }, { $set: { 'verification.isVerified': !!isApproved, updatedAt: new Date() } });
    res.json({ success: true, message: isApproved ? 'Buyer approved' : 'Buyer unapproved' });
  } catch (err) {
    console.error('Admin approve buyer error:', err);
    res.status(500).json({ success: false, message: 'Failed to update buyer approval' });
  }
});

module.exports = router;


