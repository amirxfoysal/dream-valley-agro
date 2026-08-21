import { Router } from 'express';
import multer from 'multer';
import Upload from '../../models/Upload.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!/^image\//.test(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }
    const doc = await Upload.create({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    res.status(201).json({ url: `/api/uploads/${doc._id}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store upload', detail: err.message });
  }
});

export default router;
