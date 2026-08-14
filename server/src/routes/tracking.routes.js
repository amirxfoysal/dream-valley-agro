import { Router } from 'express';
import Order from '../models/Order.js';
import {
  steadfastConfigured,
  trackByConsignmentId,
  trackByInvoice,
} from '../services/steadfast.js';
import { errDetail } from '../utils/errors.js';

const router = Router();

const ORDER_STEP_STATUS = {
  pending: 'pending',
  processing: 'in_progress',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const orderHistory = (order) => ({
  items: (order.items || []).map((item) => ({
    name: item.name || '',
    nameBn: item.nameBn || '',
    image: item.image || '',
    price: item.price || 0,
    quantity: item.quantity || 1,
  })),
  subtotal: order.subtotal || 0,
  shipping: order.shipping || 0,
  total: order.total || 0,
  paymentMethod: order.payment?.method || 'cod',
});

router.get('/:identifier', async (req, res) => {
  const identifier = String(req.params.identifier || '').trim();
  if (!identifier || identifier.length > 64) {
    return res.status(400).json({ error: 'Please provide an order number or consignment ID' });
  }

  try {
    let order = await Order.findOne({
      orderNumber: { $regex: `^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    }).lean();

    if (!order && /^\d+$/.test(identifier)) {
      order = await Order.findOne({ 'courier.consignmentId': identifier }).lean();
    }

    if (order) {
      if (order.courier?.consignmentId) {
        try {
          const consignment = await trackByConsignmentId(order.courier.consignmentId);
          return res.json({
            source: 'steadfast',
            courier: 'SteadFast',
            orderNumber: order.orderNumber,
            placedAt: order.createdAt,
            consignment,
            history: orderHistory(order),
          });
        } catch (err) {
          if (err.statusCode === 503 || err.statusCode === 504) throw err;
          return res.json({
            source: 'order',
            orderNumber: order.orderNumber,
            placedAt: order.createdAt,
            status: ORDER_STEP_STATUS[order.status] || order.status,
            consignmentId: order.courier.consignmentId,
            note: 'Live courier update is unavailable right now; showing local order status.',
            history: orderHistory(order),
          });
        }
      }

      return res.json({
        source: 'order',
        orderNumber: order.orderNumber,
        placedAt: order.createdAt,
        status: ORDER_STEP_STATUS[order.status] || order.status,
        history: orderHistory(order),
      });
    }

    if (!steadfastConfigured()) {
      return res.status(503).json({ error: 'Tracking is not configured' });
    }

    if (/^\d+$/.test(identifier)) {
      try {
        const consignment = await trackByConsignmentId(identifier);
        if (consignment && consignment.status !== 'unknown') {
          return res.json({
            source: 'steadfast',
            courier: 'SteadFast',
            consignment,
          });
        }
      } catch (err) {
        if (err.statusCode === 503 || err.statusCode === 504) throw err;
        // 401/403 from SteadFast also means the consignment does not exist
      }
    }

    try {
      const consignment = await trackByInvoice(identifier);
      if (consignment && (consignment.consignmentId || consignment.invoiceId)) {
        return res.json({
          source: 'steadfast',
          courier: 'SteadFast',
          orderNumber: consignment.invoiceId || identifier,
          consignment,
        });
      }
    } catch {
      // fall through to 404
    }

    return res.status(404).json({ error: 'No shipment found for this ID' });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: 'Tracking request failed',
      detail: errDetail(err),
    });
  }
});

export default router;
