const express = require("express");
const {
  getMyCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  batchAdd
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// --- Protected Routes (for authenticated users) ---
router.get("/my_cart", protect, getMyCart);
router.post("/batch_add", protect, batchAdd);

// --- Public & Protected Routes ---
// These can be used by guests (with session_id) or logged-in users.
// The controller logic handles which cart to use.
router.post("/items", addItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);
router.post("/clear", clearCart);

module.exports = router;
