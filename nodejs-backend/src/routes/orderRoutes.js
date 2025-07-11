const express = require('express');

const {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getOrderById,
  getOrderByOrderId
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// This route is public for the order confirmation page
router.get("/by-order-id/:orderId", getOrderByOrderId);
// Guest checkout
router.post("/guest", createGuestOrder);

// Public get order by id (handles guest + auth check inside controller)
router.route("/:id").get(getOrderById);

// All other order routes are protected
router.use(protect);

router.route("/").post(createOrder).get(getMyOrders);

module.exports = router;
