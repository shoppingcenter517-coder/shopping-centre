const mongoose = require('mongoose');

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: '', trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    status: { type: String, enum: STATUSES, default: 'Pending' },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      'SC' + Date.now().toString().slice(-7) + Math.floor(10 + Math.random() * 90);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
Order.STATUSES = STATUSES;
module.exports = Order;
