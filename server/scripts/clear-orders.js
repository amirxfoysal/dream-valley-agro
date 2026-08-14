import mongoose from 'mongoose';
import Order from '../src/models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => Order.deleteMany({}))
  .then(() => {
    console.log('All orders deleted');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err.message);
    mongoose.disconnect();
  });