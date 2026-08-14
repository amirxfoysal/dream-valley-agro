import { Router } from 'express';
import Tree from '../../models/Tree.js';
import Product from '../../models/Product.js';

const router = Router();

const clean = (body) => ({
  name: (body.name || '').trim(),
  nameBn: (body.nameBn || '').trim(),
  image: (body.image || '').trim(),
  description: (body.description || '').trim(),
  descriptionBn: (body.descriptionBn || '').trim(),
  sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
});

router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find().sort({ sortOrder: 1, name: 1 }).lean();
    const counts = await Product.aggregate([
      { $match: { tree: { $ne: null } } },
      { $group: { _id: '$tree', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    res.json(
      trees.map((tree) => ({
        ...tree,
        varietyCount: countMap[String(tree._id)] || 0,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to load trees', detail: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = clean(req.body);
    if (!data.name) return res.status(400).json({ error: 'Tree name is required' });
    const tree = await Tree.create(data);
    res.status(201).json(tree);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create tree', detail: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = clean(req.body);
    if (!data.name) return res.status(400).json({ error: 'Tree name is required' });
    const tree = await Tree.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tree', detail: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tree = await Tree.findByIdAndDelete(req.params.id);
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    await Product.updateMany({ tree: tree._id }, { $set: { tree: null } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tree', detail: err.message });
  }
});

export default router;