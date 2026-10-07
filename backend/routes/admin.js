const router = require('express').Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Simple username + password login (credentials .env me)
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const okUser = safeEqual(username || '', process.env.ADMIN_USERNAME || 'admin');
  const okPass = safeEqual(password || '', process.env.ADMIN_PASSWORD || 'admin123');
  if (!okUser || !okPass) {
    return res.status(401).json({ message: 'Wrong username or password' });
  }
  const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

router.get('/stats', auth, async (req, res, next) => {
  try {
    const [totalOrders, pending, products, outOfStock, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    res.json({
      totalOrders,
      pending,
      products,
      outOfStock,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
