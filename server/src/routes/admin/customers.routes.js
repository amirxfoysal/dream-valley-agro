import { Router } from 'express';
import Customer from '../../models/Customer.js';
import Order from '../../models/Order.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();

    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$firebaseUid',
          orders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          lastOrder: { $max: '$createdAt' },
        },
      },
    ]);
    const statMap = Object.fromEntries(stats.map((s) => [s._id, s]));

    res.json(
      customers.map((c) => ({
        _id: c._id,
        firebaseUid: c.firebaseUid,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        stats: statMap[c.firebaseUid] || { orders: 0, totalSpent: 0, lastOrder: null },
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to load customers', detail: err.message });
  }
});

router.get('/:firebaseUid/orders', async (req, res) => {
  try {
    const orders = await Order.find({ firebaseUid: req.params.firebaseUid })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load customer orders', detail: err.message });
  }
});

export default router;