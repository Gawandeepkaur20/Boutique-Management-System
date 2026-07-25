import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Worker from '../models/Worker.js';
import connectDB from '../config/db.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Customer.deleteMany({});
  await Worker.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@boutique.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
  });

  const customerUser = await User.create({
    name: 'Jane Customer',
    email: 'customer@boutique.com',
    password: 'customer123',
    role: 'customer',
    phone: '9876543211',
  });
  await Customer.create({ user: customerUser._id, city: 'Mumbai', address: '123 Fashion St' });

  const workerUser = await User.create({
    name: 'John Worker',
    email: 'worker@boutique.com',
    password: 'worker123',
    role: 'worker',
    phone: '9876543212',
  });
  await Worker.create({ user: workerUser._id, specialization: 'Stitching', experience: 5 });

  console.log('Seed data created:');
  console.log('  Admin:    admin@boutique.com / admin123');
  console.log('  Customer: customer@boutique.com / customer123');
  console.log('  Worker:   worker@boutique.com / worker123');
  console.log(`  Admin ID: ${admin._id}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
