const router = require('express').Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

async function releaseStock(reserved) {
  for (const r of reserved) {
    await Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } });
  }
}

// Public: place order (no login needed)
router.post('/', async (req, res, next) => {
  const reserved = [];
  try {
    const { customer, items } = req.body || {};

    if (
      !customer ||
      !customer.name?.trim() ||
      !customer.phone?.trim() ||
      !customer.address?.trim() ||
      !customer.city?.trim() ||
      !customer.pincode?.trim()
    ) {
      return res.status(400).json({ message: 'Please fill all required details' });
    }
    if (!/^\d{10}$/.test(String(customer.phone).trim())) {
      return res.status(400).json({ message: 'Enter a valid 10 digit phone number' });
    }
    if (!/^\d{6}$/.test(String(customer.pincode).trim())) {
      return res.status(400).json({ message: 'Enter a valid 6 digit pincode' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Same product ek se zyada baar ho to merge karo
    const qtyMap = new Map();
    for (const it of items) {
      const qty = parseInt(it.qty, 10);
      if (!it.productId || !(qty > 0)) {
        return res.status(400).json({ message: 'Invalid cart item' });
      }
      const key = String(it.productId);
      qtyMap.set(key, (qtyMap.get(key) || 0) + qty);
    }

    const orderItems = [];
    for (const [id, qty] of qtyMap) {
      // Atomic: stock sirf tab kam hoga jab kaafi stock ho
      const p = await Product.findOneAndUpdate(
        { _id: id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );
      if (!p) {
        await releaseStock(reserved);
        const existing = await Product.findById(id);
        const msg = !existing
          ? 'A product in your cart is no longer available'
          : existing.stock === 0
          ? `${existing.name} is out of stock`
          : `Only ${existing.stock} left for ${existing.name}`;
        return res.status(409).json({ message: msg });
      }
      reserved.push({ id, qty });
      orderItems.push({ product: p._id, name: p.name, price: p.price, qty, image: p.image });
    }

    const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        phone: String(customer.phone).trim(),
        email: (customer.email || '').trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        pincode: String(customer.pincode).trim(),
      },
      items: orderItems,
      total,
    });

    res.status(201).json({ orderNumber: order.orderNumber, total: order.total });
  } catch (e) {
    await releaseStock(reserved).catch(() => {});
    next(e);
  }
});

// Admin: list orders
router.get('/', auth, async (req, res, next) => {
  try {
    const filter = {};
    if (Order.STATUSES.includes(req.query.status)) filter.status = req.query.status;
    res.json(await Order.find(filter).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

// Admin: update status
router.patch('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!Order.STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cancelled order ka status change nahi ho sakta' });
    }
    if (status === 'Cancelled') {
      // Cancel hone par stock wapas
      await releaseStock(order.items.map((i) => ({ id: i.product, qty: i.qty })));
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (e) {
    next(e);
  }
});

// Admin: delete order
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'Cancelled' && order.status !== 'Delivered') {
      await releaseStock(order.items.map((i) => ({ id: i.product, qty: i.qty })));
    }
    await order.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
