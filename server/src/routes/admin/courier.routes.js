import { Router } from 'express';
import Order from '../../models/Order.js';
import {
  createConsignment,
  fetchBalance,
  steadfastConfigured,
  steadfastToOrderStatus,
  trackByConsignmentId,
} from '../../services/steadfast.js';

const router = Router();

const CONSIGNMENT_PROJECTION =
  'orderNumber status total customer.name customer.phone customer.address customer.city courier createdAt';

const HAS_CONSIGNMENT = { 'courier.consignmentId': { $exists: true, $ne: '' } };
const NO_CONSIGNMENT = {
  $or: [{ 'courier.consignmentId': { $exists: false } }, { 'courier.consignmentId': '' }],
};

router.get('/status', async (req, res) => {
  try {
    const [consignments, pending] = await Promise.all([
      Order.find(HAS_CONSIGNMENT)
        .select(CONSIGNMENT_PROJECTION)
        .sort({ 'courier.lastSyncedAt': 1, createdAt: -1 })
        .lean(),
      Order.find({ ...NO_CONSIGNMENT, status: { $in: ['pending', 'processing'] } })
        .select(CONSIGNMENT_PROJECTION)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    let balance = null;
    let balanceError = '';
    if (steadfastConfigured()) {
      try {
        balance = await fetchBalance();
      } catch (err) {
        balanceError = 'Balance is not available for this SteadFast account';
      }
    }

    res.json({
      configured: steadfastConfigured(),
      balance,
      balanceError,
      consignments,
      pending,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load courier status', detail: err.message });
  }
});

const syncOrder = async (order) => {
  const consignment = await trackByConsignmentId(order.courier.consignmentId);
  const mappedStatus = steadfastToOrderStatus(consignment.status);

  const update = {
    'courier.trackingStatus': consignment.status,
    'courier.lastSyncedAt': new Date(),
  };
  if (mappedStatus && mappedStatus !== order.status) {
    update.status = mappedStatus;
  }

  const updated = await Order.findByIdAndUpdate(order._id, update, { new: true }).lean();
  return {
    orderNumber: updated.orderNumber,
    trackingStatus: consignment.status,
    orderStatus: updated.status,
  };
};

router.post('/sync', async (req, res) => {
  try {
    if (!steadfastConfigured()) {
      return res.status(503).json({ error: 'SteadFast credentials are not configured' });
    }

    const orders = await Order.find({
      ...HAS_CONSIGNMENT,
      status: { $nin: ['delivered', 'cancelled'] },
    }).lean();

    const results = [];
    const errors = [];

    for (const order of orders) {
      try {
        results.push(await syncOrder(order));
      } catch (err) {
        errors.push({ orderNumber: order.orderNumber, error: err.message });
      }
    }

    res.json({ synced: results.length, results, errors });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync consignments', detail: err.message });
  }
});

router.post('/:id/sync', async (req, res) => {
  try {
    if (!steadfastConfigured()) {
      return res.status(503).json({ error: 'SteadFast credentials are not configured' });
    }

    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.courier?.consignmentId) {
      return res.status(400).json({ error: 'Order has no SteadFast consignment yet' });
    }

    const result = await syncOrder(order);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: 'Failed to sync consignment',
      detail: err.message,
    });
  }
});

router.post('/:id/send', async (req, res) => {
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

export default router;
