import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { errDetail } from '../utils/errors.js';

const router = Router();

const FREE_SHIPPING_THRESHOLD = 1000;
const FLAT_SHIPPING = 80;
const MAX_ITEMS = 50;
const MAX_QUANTITY = 99;

const computeShipping = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ firebaseUid: req.user.uid })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders', detail: errDetail(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const { items, customer, payment, notes } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (items.length > MAX_ITEMS) {
      return res.status(400).json({ error: `Too many items (max ${MAX_ITEMS})` });
    }
    if (items.some((i) => !mongoose.isValidObjectId(i?.product))) {
      return res.status(400).json({ error: 'Invalid product reference in cart' });
    }

    const name = (customer?.name || req.user.name || '').trim();
    const email = (customer?.email || req.user.email || '').trim().toLowerCase();
    const phone = String(customer?.phone || '').trim().slice(0, 30);
    const address = String(customer?.address || '').trim().slice(0, 500);

    if (!name || !email || !address) {
      return res.status(400).json({ error: 'Name, email and delivery address are required' });
    }

    const products = await Product.find({ _id: { $in: items.map((i) => i.product) } }).lean();
    const productMap = Object.fromEntries(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap[String(item.product)];
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }
      const quantity = Math.floor(Number(item.quantity));
      if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return res
          .status(400)
          .json({ error: `Invalid quantity for ${product.name}` });
      }
      const lineTotal = product.price * quantity;
      subtotal += lineTotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        nameBn: product.nameBn || '',
        price: product.price,
        quantity,
        image: product.image || '',
      });
    }

    // Atomically reserve stock; roll back if any line cannot be fulfilled.
    const reserved = [];
    for (const item of orderItems) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.matchedCount === 0 || result.modifiedCount === 0) {
        await Promise.all(
          reserved.map((r) =>
            Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })
          )
        );
        return res
          .status(400)
          .json({ error: `Insufficient stock for "${item.name}". Please update your cart.` });
      }
      reserved.push(item);
    }

    const shipping = computeShipping(subtotal);
    const total = subtotal + shipping;
    const paymentMethod = 'cod';

    // Random suffix can collide on the unique index; retry with a fresh number.
    const createOrder = async (payload, attempts = 3) => {
      for (let i = 0; i < attempts; i += 1) {
        try {
          return await Order.create(payload);
        } catch (err) {
          if (err?.code === 11000 && err?.keyPattern?.orderNumber) continue;
          throw err;
        }
      }
      throw new Error('Could not generate a unique order number');
    };

    let order;
    try {
      order = await createOrder({
        firebaseUid: req.user.uid,
        customer: {
          name,
          email,
          phone,
          address,
          city: String(customer?.city || '').trim().slice(0, 100),
          postalCode: String(customer?.postalCode || '').trim().slice(0, 20),
        },
        items: orderItems,
        subtotal,
        shipping,
        total,
        payment: { method: paymentMethod, status: 'pending' },
        notes: String(notes || '').trim().slice(0, 500),
      });
    } catch (err) {
      await Promise.all(
        reserved.map((r) =>
          Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })
        )
      );
      throw err;
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', detail: errDetail(err) });
  }
});

export default router;
