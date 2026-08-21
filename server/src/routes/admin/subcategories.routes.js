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
  image: (body.image || '').trim(),
  sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
});

// Parent may be a main category or an existing subcategory (for nested varieties),
// but never itself or one of its own descendants (prevents cycles).
const isValidParent = async (parent, selfId = null) => {
  if (!parent) return false;
  if (MAIN_CATEGORY_SLUGS.includes(parent)) return true;
  let current = await Subcategory.findOne({ slug: parent }).lean();
  let guard = 0;
  while (current && guard < 10) {
    if (selfId && String(current._id) === String(selfId)) return false;
    if (!current.parent || MAIN_CATEGORY_SLUGS.includes(current.parent)) return true;
    current = await Subcategory.findOne({ slug: current.parent }).lean();
    guard += 1;
  }
  return false;
};

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
    if (!(await isValidParent(data.parent))) {
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
    if (!(await isValidParent(data.parent, req.params.id))) {
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
    await Subcategory.updateMany({ parent: sub.slug }, { $set: { parent: sub.parent } });
    await Product.updateMany({ category: sub.slug }, { $set: { category: sub.parent } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subcategory', detail: err.message });
  }
});

export default router;
