import { Router } from 'express';
import Tree from '../models/Tree.js';
import Product from '../models/Product.js';
import { errDetail } from '../utils/errors.js';

const router = Router();

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
    res.status(500).json({ error: 'Failed to load trees', detail: errDetail(err) });
  }
});

router.get('/:id/varieties', async (req, res) => {
  try {
    const tree = await Tree.findById(req.params.id).lean();
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    const products = await Product.find({ tree: tree._id })
      .populate('tree', 'name nameBn slug')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ tree, products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load varieties', detail: errDetail(err) });
  }
});

export default router;