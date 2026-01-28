/*
 Seed an Admin user for testing admin login.
 Usage: node scripts/seedAdmin.js
*/

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Admin } = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI not set in backend/.env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI, { autoIndex: true });

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

  let user = await Admin.findOne({ email });
  if (user) {
    console.log(`Admin already exists: ${email}`);
  } else {
    const password = await bcrypt.hash(plainPassword, 12);
    const now = new Date();
    user = await Admin.create({
      email,
      password,
      userType: 'admin',
      firstName: 'Site',
      lastName: 'Admin',
      phone: '+911112223334',
      profileImage: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      adminDetails: {
        employeeId: 'AD-0001',
        department: 'operations',
        designation: 'Admin',
        permissions: ['user_verification', 'auction_management'],
        reportingManager: null
      },
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    });
    console.log(`Created Admin: ${email}`);
  }

  console.log('Login with:');
  console.log(`  userType: admin`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${plainPassword}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});


