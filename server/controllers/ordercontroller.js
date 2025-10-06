const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user && (req.user.userId || req.user.id) ? (req.user.userId || req.user.id) : req.body.userId; // fallback
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { items, subtotal, shipping = 0, total, address } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ message: 'Total is required' });
    }

    const order = await Order.create({
      user: userId,
      items,
      subtotal: typeof subtotal === 'number' ? subtotal : items.reduce((s, it) => s + it.price * it.quantity, 0),
      shipping,
      total,
      address,
      status: 'confirmed',
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('createOrder error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user && (req.user.userId || req.user.id) ? (req.user.userId || req.user.id) : req.params.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('getMyOrders error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
