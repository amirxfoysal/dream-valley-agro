import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, trim: true, default: '' },
    slug: { type: String, unique: true, index: true },
    category: { type: String, trim: true, default: 'indoor' },
    tree: { type: mongoose.Schema.Types.ObjectId, ref: 'Tree', default: null },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    care: {
      light: { type: String, default: '' },
      water: { type: String, default: '' },
      soil: { type: String, default: '' },
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
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

const Product = mongoose.model('Product', productSchema);

export default Product;