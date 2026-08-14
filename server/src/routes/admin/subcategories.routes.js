import { Router } from 'express';
import Subcategory, {
  MAIN_CATEGORY_SLUGS,
  ensureDefaultSubcategories,
} from '../../models/Subcategory.js';
import Product from '../../models/Product.js';

const router = Router();

const clean = (body) => ({
  name: (body.name || '').trim(),
  nameBn: (body.nameBn || '').trim(),
  parent: (body.parent || '').trim(),
  sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
});

router.get('/', async (req, res) => {
  try {
    await ensureDefaultSubcategories();
    const subs = await Subcategory.find().sort({ parent: 1, sortOrder: 1, name: 1 }).lean();
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    res.json(subs.map((sub) => ({ ...sub, productCount: countMap[sub.slug] || 0 })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load subcategories', detail: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = clean(req.body);
    if (!data.name) return res.status(400).json({ error: 'Subcategory name is required' });
    if (!MAIN_CATEGORY_SLUGS.includes(data.parent)) {
      return res.status(400).json({ error: 'A valid parent category is required' });
    }
    const sub = await Subcategory.create(data);
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create subcategory', detail: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = clean(req.body);
    if (!data.name) return res.status(400).json({ error: 'Subcategory name is required' });
    if (!MAIN_CATEGORY_SLUGS.includes(data.parent)) {
      return res.status(400).json({ error: 'A valid parent category is required' });
    }
    const sub = await Subcategory.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!sub) return res.status(404).json({ error: 'Subcategory not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subcategory', detail: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sub = await Subcategory.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Subcategory not found' });
    await Product.updateMany({ category: sub.slug }, { $set: { category: sub.parent } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subcategory', detail: err.message });
  }
});

export default router;
