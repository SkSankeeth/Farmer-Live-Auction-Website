const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { Farmer, Buyer } = require('../models/User');
const { rateLimits } = require('../middleware/rateLimits');

const router = express.Router();

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('uploads', 'profiles');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + unique + path.extname(file.originalname));
  }
});

const farmStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('uploads', 'farms');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'farm-' + unique + path.extname(file.originalname));
  }
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  }
});

const uploadFarm = multer({
  storage: farmStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    if (ok) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  }
});

// Upload profile image (all roles)
router.post('/profile', rateLimits.upload, authenticateToken, uploadProfile.single('image'), async (req, res) => {
  try {
    const userType = req.user.userType;
    const Model = userType === 'farmer' ? Farmer : userType === 'buyer' ? Buyer : null;
    if (!Model) return res.status(400).json({ success: false, message: 'Unsupported user type for uploads' });
    const imageUrl = `/api/uploads/profiles/${req.file.filename}`;
    await Model.updateOne({ _id: req.user.id }, { $set: { profileImage: imageUrl, updatedAt: new Date() } });
    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error('Upload profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload profile' });
  }
});

// Upload farm image (farmers)
router.post('/farm', rateLimits.upload, authenticateToken, uploadFarm.single('image'), async (req, res) => {
  try {
    if (req.user.userType !== 'farmer') return res.status(403).json({ success: false, message: 'Only farmers can upload farm images' });
    const imageUrl = `/api/uploads/farms/${req.file.filename}`;
    await Farmer.updateOne({ _id: req.user.id }, { $set: { 'farmDetails.farmImage': imageUrl, updatedAt: new Date() } });
    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error('Upload farm error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload farm image' });
  }
});

// Serve profile images
router.get('/profiles/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads/profiles', filename);
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).json({ success: false, message: 'Image not found' });
});

// Serve farm images
router.get('/farms/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads/farms', filename);
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  res.status(404).json({ success: false, message: 'Image not found' });
});

module.exports = router;


