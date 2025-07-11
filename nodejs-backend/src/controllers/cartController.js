const prisma = require("../config/prisma");
const { v4: uuidv4 } = require("uuid");

// --- Helper function to get or create a cart ---
const getOrCreateCart = async (req) => {
  // If user is authenticated, use their user ID
  if (req.user) {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true }, orderBy: { addedAt: "asc" } }
      }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } }
      });
    }
    return cart;
  }

  // If user is a guest, use a session ID
  let { sessionId } = req.body;
  if (sessionId) {
    const cart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: { include: { product: true }, orderBy: { addedAt: "asc" } }
      }
    });
    if (cart) return cart;
  }

  // If no session or cart for session, create a new one
  sessionId = uuidv4();
  return prisma.cart.create({
    data: { sessionId },
    include: { items: { include: { product: true } } }
  });
};

// --- Get the current user's or guest's cart ---
const getMyCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Add an item to the cart ---
const addItem = async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Product ID and quantity are required" });
  }

  try {
    const cart = await getOrCreateCart(req);

    // Check if the item already exists in the cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, size, color }
    });

    let updatedItem;
    if (existingItem) {
      // If it exists, update the quantity
      updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      });
    } else {
      // If not, create a new cart item
      updatedItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity, size, color },
        include: { product: true }
      });
    }

    res.status(201).json(updatedItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Update a cart item's quantity ---
const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true }
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Remove an item from the cart ---
const removeItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Clear the entire cart ---
const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Merge guest cart into user cart on login ---
const batchAdd = async (req, res) => {
  const { items } = req.body; // Expects an array of { productId, quantity, size, color }
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const cart = await getOrCreateCart(req);

    // Use a transaction to handle all updates at once
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const existingItem = await tx.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: item.productId,
            size: item.size,
            color: item.color
          }
        });

        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity }
          });
        } else {
          await tx.cartItem.create({
            data: { ...item, cartId: cart.id }
          });
        }
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error merging cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMyCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  batchAdd
};
