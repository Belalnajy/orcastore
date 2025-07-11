const express = require('express');
const {
  initiatePayment,
  processedCallback,
  responseCallback,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Initiate payment for an order (protected)
router.post('/create', protect, initiatePayment);

// Paymob callbacks (publicly accessible)
router.post('/processed_callback', processedCallback);
router.get('/response_callback', responseCallback); // Paymob redirects here with GET

module.exports = router;
