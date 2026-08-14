import mongoose from 'mongoose';

const treeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, trim: true, default: '' },
    slug: { type: String, unique: true, index: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

treeSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') +
      '-' +
      Date.now().toString(36);
  }
  next();
});

const Tree = mongoose.model('Tree', treeSchema);

export default Tree;