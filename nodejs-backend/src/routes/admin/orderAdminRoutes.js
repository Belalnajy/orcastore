const express = require('express');
const {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} = require('../../controllers/admin/orderAdminController');
const { protect, admin } = require('../../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(protect, admin);

router.route('/')
  .get(getAllOrders);

router.route('/:id')
  .get(getOrderDetails);
  
router.route('/:id/status')
  .put(updateOrderStatus);

module.exports = router;
