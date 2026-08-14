export const CATEGORIES = [
  {
    slug: 'fruit-trees',
    en: 'Fruit Trees',
    bn: 'ফলের গাছ',
    icon: 'fruit',
  },
  {
    slug: 'flower-plants',
    en: 'Flower Plants',
    bn: 'ফুলের গাছ',
    icon: 'flower',
  },
  {
    slug: 'ornamental-plants',
    en: 'Ornamental Plants',
    bn: 'শোভাময় গাছ',
    icon: 'ornamental',
  },
  {
    slug: 'spice-plants',
    en: 'Spice Plants',
    bn: 'মসলা গাছ',
    icon: 'spice',
  },
  {
    slug: 'medicinal-plants',
    en: 'Medicinal Plants',
    bn: 'ঔষধি গাছ',
    icon: 'medicinal',
  },
  {
    slug: 'timber-trees',
    en: 'Timber Trees',
    bn: 'কাঠের গাছ',
    icon: 'timber',
  },
  {
    slug: 'vegetable-plants',
    en: 'Vegetable Plants',
    bn: 'সবজি গাছ',
    icon: 'vegetable',
  },
  {
    slug: 'organic-fertilizer-pesticides',
    en: 'Organic Fertilizer & Pesticides',
    bn: 'জৈব সার ও কীটনাশক',
    icon: 'fertilizer',
  },
  {
    slug: 'pots-geo-bags',
    en: 'Pots & Geo Bags',
    bn: 'টব ও জিও ব্যাগ',
    icon: 'pots',
  },
  {
    slug: 'gardening-tools',
    en: 'Gardening Tools',
    bn: 'বাগান সরঞ্জাম',
    icon: 'tools',
  },
];

export const DEFAULT_SUBCATEGORIES = [
  { slug: 'native-fruit-trees', en: 'Native Fruit Trees', bn: 'দেশি ফলের গাছ', parent: 'fruit-trees', sortOrder: 1 },
  { slug: 'exotic-fruit-trees', en: 'Exotic Fruit Trees', bn: 'বিদেশি ফলের গাছ', parent: 'fruit-trees', sortOrder: 2 },
  { slug: 'all-season-fruit-trees', en: 'All-Season Fruit Trees', bn: 'সারাবছর ফলের গাছ', parent: 'fruit-trees', sortOrder: 3 },
  { slug: 'native-flower-plants', en: 'Native Flower Plants', bn: 'দেশি ফুলের গাছ', parent: 'flower-plants', sortOrder: 1 },
  { slug: 'exotic-flower-plants', en: 'Exotic Flower Plants', bn: 'বিদেশি ফুলের গাছ', parent: 'flower-plants', sortOrder: 2 },
  { slug: 'all-season-flower-plants', en: 'All-Season Flower Plants', bn: 'সারাবছর ফুলের গাছ', parent: 'flower-plants', sortOrder: 3 },
  { slug: 'indoor-ornamental-plants', en: 'Indoor Ornamental Plants', bn: 'ঘরের ভেতরের শোভাময় গাছ', parent: 'ornamental-plants', sortOrder: 1 },
  { slug: 'outdoor-ornamental-plants', en: 'Outdoor Ornamental Plants', bn: 'বাইরের শোভাময় গাছ', parent: 'ornamental-plants', sortOrder: 2 },
  { slug: 'bonsai-topiary', en: 'Bonsai & Topiary', bn: 'বনসাই ও টোপিয়ারি', parent: 'ornamental-plants', sortOrder: 3 },
  { slug: 'native-spice-plants', en: 'Native Spice Plants', bn: 'দেশি মসলা গাছ', parent: 'spice-plants', sortOrder: 1 },
  { slug: 'exotic-spice-plants', en: 'Exotic Spice Plants', bn: 'বিদেশি মসলা গাছ', parent: 'spice-plants', sortOrder: 2 },
  { slug: 'home-garden-spice-plants', en: 'Home Garden Spice Plants', bn: 'ঘরের বাগানের মসলা গাছ', parent: 'spice-plants', sortOrder: 3 },
  { slug: 'ayurvedic-medicinal-plants', en: 'Ayurvedic Medicinal Plants', bn: 'আয়ুর্বেদিক ঔষধি গাছ', parent: 'medicinal-plants', sortOrder: 1 },
  { slug: 'herbal-tea-plants', en: 'Herbal Tea Plants', bn: 'হারবাল চা গাছ', parent: 'medicinal-plants', sortOrder: 2 },
  { slug: 'aromatic-medicinal-plants', en: 'Aromatic Medicinal Plants', bn: 'সুগন্ধি ঔষধি গাছ', parent: 'medicinal-plants', sortOrder: 3 },
  { slug: 'fast-growing-timber-trees', en: 'Fast-Growing Timber Trees', bn: 'দ্রুতবর্ধমান কাঠের গাছ', parent: 'timber-trees', sortOrder: 1 },
  { slug: 'premium-timber-trees', en: 'Premium Timber Trees', bn: 'উন্নত কাঠের গাছ', parent: 'timber-trees', sortOrder: 2 },
  { slug: 'shade-timber-trees', en: 'Shade & Timber Trees', bn: 'ছায়া ও কাঠের গাছ', parent: 'timber-trees', sortOrder: 3 },
  { slug: 'leafy-vegetable-plants', en: 'Leafy Vegetable Plants', bn: 'পাতাজাতীয় সবজি', parent: 'vegetable-plants', sortOrder: 1 },
  { slug: 'fruit-vegetable-plants', en: 'Fruit Vegetable Plants', bn: 'ফলজাতীয় সবজি', parent: 'vegetable-plants', sortOrder: 2 },
  { slug: 'root-vegetable-plants', en: 'Root Vegetable Plants', bn: 'শিকড়জাতীয় সবজি', parent: 'vegetable-plants', sortOrder: 3 },
  { slug: 'organic-fertilizers', en: 'Organic Fertilizers', bn: 'জৈব সার', parent: 'organic-fertilizer-pesticides', sortOrder: 1 },
  { slug: 'organic-pesticides', en: 'Organic Pesticides', bn: 'জৈব কীটনাশক', parent: 'organic-fertilizer-pesticides', sortOrder: 2 },
  { slug: 'compost-soil-conditioners', en: 'Compost & Soil Conditioners', bn: 'কম্পোস্ট ও মাটি উন্নয়ন উপকরণ', parent: 'organic-fertilizer-pesticides', sortOrder: 3 },
  { slug: 'plastic-ceramic-pots', en: 'Plastic & Ceramic Pots', bn: 'প্লাস্টিক ও সিরামিক টব', parent: 'pots-geo-bags', sortOrder: 1 },
  { slug: 'geo-bags', en: 'Geo Bags', bn: 'জিও ব্যাগ', parent: 'pots-geo-bags', sortOrder: 2 },
  { slug: 'hanging-wall-pots', en: 'Hanging & Wall Pots', bn: 'ঝুলন্ত ও দেয়াল টব', parent: 'pots-geo-bags', sortOrder: 3 },
  { slug: 'hand-tools', en: 'Hand Tools', bn: 'হাতিয়ার', parent: 'gardening-tools', sortOrder: 1 },
  { slug: 'watering-equipment', en: 'Watering Equipment', bn: 'পানি দেওয়ার সরঞ্জাম', parent: 'gardening-tools', sortOrder: 2 },
  { slug: 'plant-care-accessories', en: 'Plant Care Accessories', bn: 'গাছের যত্নের সামগ্রী', parent: 'gardening-tools', sortOrder: 3 },
];

let subcategoryList = DEFAULT_SUBCATEGORIES;

export const setSubcategories = (list) => {
  subcategoryList =
    Array.isArray(list) && list.length
      ? [...list].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      : DEFAULT_SUBCATEGORIES;
};

export const getSubcategories = () => subcategoryList;

export const allCategorySlugs = () => [
  ...CATEGORIES.map((c) => c.slug),
  ...subcategoryList.map((s) => s.slug),
];

export const categoryBySlug = (slug) =>
  CATEGORIES.find((c) => c.slug === slug) ||
  subcategoryList.find((s) => s.slug === slug) ||
  null;

export const categoryName = (slug, bn) => {
  const found = categoryBySlug(slug);
  if (found) return bn ? found.bn : found.en;
  return slug || '';
};

export const subcategoriesOf = (slug) => subcategoryList.filter((s) => s.parent === slug);

export const parentSlugOf = (slug) =>
  subcategoryList.find((s) => s.slug === slug)?.parent || null;

export const categoryMatches = (productCategory, active) => {
  if (!active || active === 'all') return true;
  if (productCategory === active) return true;
  return parentSlugOf(productCategory) === active;
};
