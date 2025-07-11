const prisma = require('../../config/prisma');

// --- Get all orders (Admin) ---
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } }, // Include user details
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// --- Get a single order's details (Admin) ---
const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } },
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// --- Update order status (Admin) ---
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Optional: Validate the status against the OrderStatus enum
  const validStatuses = ['PENDING', 'PROCESSING', 'PAID', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
};
