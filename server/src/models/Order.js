import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    firebaseUid: { type: String, index: true, default: '' },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, trim: true, default: '' },
      address: { type: String, required: true, trim: true },
      city: { type: String, trim: true, default: '' },
      postalCode: { type: String, trim: true, default: '' },
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        nameBn: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: '' },
      },
    ],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'BDT' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    payment: {
      method: { type: String, default: 'cod' },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    },
    notes: { type: String, default: '' },
    courier: {
      name: { type: String, default: '' },
      consignmentId: { type: String, default: '', index: true },
      trackingStatus: { type: String, default: '' },
      lastSyncedAt: { type: Date },
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    this.orderNumber = `DVA-${stamp}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;