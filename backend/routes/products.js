const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const CATEGORIES = ['men', 'women'];

function cleanBody(body) {
  const out = {
    name: String(body.name || '').trim(),
    category: String(body.category || '').toLowerCase(),
    price: Number(body.price),
    stock: parseInt(body.stock, 10),
    image: String(body.image || '').trim(),
    description: String(body.description || '').trim(),
  };
  if (!out.name) return { error: 'Product name required' };
  if (!CATEGORIES.includes(out.category)) return { error: 'Category men ya women honi chahiye' };
  if (!(out.price >= 0)) return { error: 'Valid price daalo' };
  if (!(out.stock >= 0)) return { error: 'Valid stock daalo' };
  return { data: out };
}

// Public: list products (optional ?category=men|women)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (e) {
    next(e);
  }
});

// Admin
router.post('/', auth, async (req, res, next) => {
  try {
    const { data, error } = cleanBody(req.body);
    if (error) return res.status(400).json({ message: error });
    res.status(201).json(await Product.create(data));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { data, error } = cleanBody(req.body);
    if (error) return res.status(400).json({ message: error });
    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
