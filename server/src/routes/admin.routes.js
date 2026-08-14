import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = Router();

router.get('/me', verifyToken, requireAdmin, (req, res) => {
  res.json({
    uid: req.user.uid,
    name: req.user.name || '',
    email: req.user.email || '',
    isAdmin: true,
  });
});

router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [productsCount, featuredCount, lowStock, ordersCount, pendingOrders, revenueResult] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ featured: true }),
        Product.countDocuments({ stock: { $lte: 5 } }),
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.aggregate([
          { $match: { status: { $in: ['delivered'] } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
      ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customer total status createdAt')
      .lean();

    res.json({
      products: productsCount,
      featured: featuredCount,
      lowStock: lowStock,
      orders: ordersCount,
      pendingOrders,
      revenue: revenueResult[0]?.total || 0,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats', detail: err.message });
  }
});

export default router;