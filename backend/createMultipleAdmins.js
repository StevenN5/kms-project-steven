// backend/createMultipleAdmins.js
const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const adminUsers = [
  {
    username: 'superadmin',
    email: 'superadmin@plnsc.com',
    password: 'superadmin123',
    role: 'admin'
  },
  {
    username: 'techadmin',
    email: 'techadmin@plnsc.com', 
    password: 'techadmin123',
    role: 'admin'
  },
  {
    username: 'contentadmin',
    email: 'contentadmin@plnsc.com',
    password: 'contentadmin123',
    role: 'admin'
  },
  {
    username: 'manager',
    email: 'manager@plnsc.com',
    password: 'manager123',
    role: 'admin'
  }
];

const createMultipleAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const adminData of adminUsers) {
      // Cek jika user sudah ada
      const existingUser = await User.findOne({ 
        $or: [
          { email: adminData.email },
          { username: adminData.username }
        ]
      });

      if (existingUser) {
        // Update existing user to admin
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`✅ Updated existing user to admin: ${adminData.username}`);
      } else {
        // Create new admin user
        const adminUser = new User(adminData);
        await adminUser.save();
        console.log(`✅ Created new admin: ${adminData.username}`);
      }
    }

    console.log('\n📋 Admin Users Summary:');
    console.log('======================');
    const allAdmins = await User.find({ role: 'admin' });
    allAdmins.forEach(admin => {
      console.log(`👤 ${admin.username} (${admin.email}) - Role: ${admin.role}`);
    });

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
  } finally {
    mongoose.connection.close();
  }
};

createMultipleAdmins();