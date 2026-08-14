import { Router } from 'express';
import Customer from '../models/Customer.js';
import { errDetail } from '../utils/errors.js';

const router = Router();

const toSafe = (doc) => ({
  _id: doc._id,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  address: doc.address,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

router.get('/', async (req, res) => {
  try {
    let doc = await Customer.findOne({ firebaseUid: req.user.uid });
    if (!doc) {
      doc = await Customer.create({
        firebaseUid: req.user.uid,
        name: req.user.name || '',
        email: (req.user.email || '').toLowerCase(),
      });
    }
    res.json(toSafe(doc));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile', detail: errDetail(err) });
  }
});

router.put('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body || {};
    const data = {
      name: (name || '').trim(),
      email: (email || '').trim().toLowerCase(),
      phone: (phone || '').trim(),
      address: {
        street: (address?.street || '').trim(),
        city: (address?.city || '').trim(),
        postalCode: (address?.postalCode || '').trim(),
      },
    };

    const doc = await Customer.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(toSafe(doc));
  } catch (err) {
    res.status(400).json({ error: 'Failed to save profile', detail: errDetail(err) });
  }
});

export default router;