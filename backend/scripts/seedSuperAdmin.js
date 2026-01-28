/*
 Seed a Super Admin user for bootstrapping admin creation.
 Usage: node scripts/seedSuperAdmin.js
*/

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { SuperAdmin } = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI not set in backend/.env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI, { autoIndex: true });

  const email = process.env.SEED_SUPERADMIN_EMAIL || 'superadmin@example.com';
  const plainPassword = process.env.SEED_SUPERADMIN_PASSWORD || 'Super@123';

  let user = await SuperAdmin.findOne({ email });
  if (user) {
    console.log(`Super Admin already exists: ${email}`);
  } else {
    const password = await bcrypt.hash(plainPassword, 12);
    const now = new Date();
    user = await SuperAdmin.create({
      email,
      password,
      userType: 'super_admin',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+911111111111',
      profileImage: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: { latitude: 0, longitude: 0 }
      },
      superAdminDetails: {
        employeeId: 'SA-0001',
        designation: 'Super Admin',
        permissions: ['system_administration', 'user_management', 'admin_management'],
        accessLevel: 'full'
      },
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    });
    console.log(`Created Super Admin: ${email}`);
  }

  console.log('Login with:');
  console.log(`  userType: super_admin`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${plainPassword}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});




