import { Router } from 'express';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import {
  createConsignment,
  steadfastConfigured,
  steadfastToOrderStatus,
  trackByConsignmentId,
} from '../../services/steadfast.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load order', detail: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Returning to cancelled re-reserves stock; cancelling restores it once.
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const restore = {};
      for (const item of order.items || []) {
        const key = String(item.product);
        restore[key] = (restore[key] || 0) + item.quantity;
      }
      await Promise.all(
        Object.entries(restore).map(([productId, qty]) =>
          Product.updateOne({ _id: productId }, { $inc: { stock: qty } })
        )
      );
    } else if (order.status === 'cancelled' && status !== 'cancelled') {
      const entries = Object.entries(
        (order.items || []).reduce((acc, item) => {
          const key = String(item.product);
          acc[key] = (acc[key] || 0) + item.quantity;
          return acc;
        }, {})
      );
      const results = await Promise.all(
        entries.map(([productId, qty]) =>
          Product.updateOne({ _id: productId, stock: { $gte: qty } }, { $inc: { stock: -qty } })
        )
      );
      if (results.some((r) => r.matchedCount === 0)) {
        // Roll back any deductions that did succeed.
        await Promise.all(
          entries
            .map(([productId, qty], i) =>
              results[i].matchedCount > 0
                ? Product.updateOne({ _id: productId }, { $inc: { stock: qty } })
                : null
            )
            .filter(Boolean)
        );
        return res
          .status(400)
          .json({ error: 'Not enough stock in inventory to reopen this order.' });
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', detail: err.message });
  }
});

router.post('/:id/courier/steadfast', async (req, res) => {
  try {
    if (!steadfastConfigured()) {
      return res.status(503).json({ error: 'SteadFast credentials are not configured' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.courier?.consignmentId) {
      return res
        .status(409)
        .json({ error: 'Order already has a SteadFast consignment', consignmentId: order.courier.consignmentId });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot send a cancelled order to SteadFast' });
    }

    const consignmentId = await createConsignment(order);

    order.courier = {
      name: 'SteadFast',
      consignmentId,
      trackingStatus: 'pending',
      lastSyncedAt: new Date(),
    };
    if (order.status === 'pending' || order.status === 'processing') {
      order.status = 'shipped';
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: 'Failed to create SteadFast consignment',
      detail: err.message,
    });
  }
});

router.get('/:id/tracking', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!order.courier?.consignmentId) {
      return res.status(400).json({ error: 'Order has no courier consignment yet' });
    }

    const consignment = await trackByConsignmentId(order.courier.consignmentId);

    const mappedStatus = steadfastToOrderStatus(consignment.status);
    if (mappedStatus && mappedStatus !== order.status) {
      await Order.updateOne(
        { _id: order._id },
        {
          status: mappedStatus,
          'courier.trackingStatus': consignment.status,
          'courier.lastSyncedAt': new Date(),
        }
      );
    } else {
      await Order.updateOne(
        { _id: order._id },
        {
          'courier.trackingStatus': consignment.status,
          'courier.lastSyncedAt': new Date(),
        }
      );
    }

    res.json({ consignment, orderStatus: mappedStatus || order.status });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: 'Failed to fetch tracking',
      detail: err.message,
    });
  }
});

export default router;