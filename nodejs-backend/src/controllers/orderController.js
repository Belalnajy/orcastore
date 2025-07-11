const prisma = require("../config/prisma");

// --- Create a new order ---
const createOrder = async (req, res) => {
  // Support both camelCase (fullName) and snake_case (full_name)
  // Accept both camelCase (fullName) and snake_case (full_name) for the customer's name
  const { fullName, full_name, email, phone, address, city, notes } = req.body;
  const customerName = fullName || full_name;

  if (!customerName || !email || !phone || !address || !city) {
    return res
      .status(400)
      .json({ message: "All shipping fields are required" });
  }

  try {
    // 1. Get the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate the total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 3. Create the order and its items in a single transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          fullName: customerName,
          email,
          phone,
          address,
          city,
          notes,
          totalAmount
        }
      });

      // Create the OrderItems (include variant)
      const orderItems = cart.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price, // Lock the price at the time of purchase
        size: item.size,
        color: item.color,
      }));

      await tx.orderItem.createMany({ data: orderItems });

      // Create the associated PaymentInfo record
      await tx.paymentInfo.create({
        data: {
          orderId: newOrder.id,
          amount: totalAmount,
          status: "PENDING"
        }
      });

      // Clear the user's cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Get the logged-in user's order history ---
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Get a single order by its ID ---
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } }
      }
    });

    // Access rules:
    // 1. Guest orders (userId null) are publicly accessible.
    // 2. Authenticated users can only access their own orders.
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.userId) {
      // Order belongs to a registered user – require matching auth.
      if (!req.user || order.userId !== req.user.id) {
        return res.status(401).json({ message: "Not authorized to view this order" });
      }
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Get a single order by its public orderId (UUID) ---
const getOrderByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { orderId }, // Use the UUID field
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } },
        payment: true // Include payment info
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // This is a public endpoint, so no user check is needed
    res.status(200).json(order);
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Create order for guest (no auth) ---
const createGuestOrder = async (req, res) => {
  // Support both camelCase and snake_case for guest checkout
  // Accept both camelCase (fullName) and snake_case (full_name) for the customer's name
  const { fullName, full_name, email, phone, address, city, notes, items } =
    req.body;
  const customerName = fullName || full_name;

  if (!customerName || !email || !phone || !address || !city) {
    return res
      .status(400)
      .json({ message: "All shipping fields are required" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart items are required" });
  }

  try {
    // Validate products & calculate total
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          // userId null for guest
          fullName: customerName,
          email,
          phone,
          address,
          city,
          notes,
          totalAmount
        }
      });

      const orderItems = items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: productMap[item.productId].price,
        size: item.size,
        color: item.color,
      }));
      await tx.orderItem.createMany({ data: orderItems });

      await tx.paymentInfo.create({
        data: { orderId: newOrder.id, amount: totalAmount, status: "PENDING" }
      });

      // Reduce stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating guest order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getOrderById,
  getOrderByOrderId
};
