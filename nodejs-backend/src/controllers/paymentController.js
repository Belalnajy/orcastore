const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../config/prisma');

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;

// --- 1. Authentication Request ---
const getAuthToken = async () => {
  const response = await axios.post('https://accept.paymob.com/api/auth/tokens', {
    api_key: PAYMOB_API_KEY,
  });
  return response.data.token;
};

// --- 2. Order Registration ---
const registerOrder = async (authToken, order) => {
  const response = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
    auth_token: authToken,
    delivery_needed: 'false',
    amount_cents: order.totalAmount * 100, // Amount in cents
    currency: 'EGP',
    merchant_order_id: order.id,
  });
  return response.data.id;
};

// --- 3. Payment Key Request ---
const getPaymentKey = async (authToken, paymobOrderId, order) => {
  const response = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
    auth_token: authToken,
    amount_cents: order.totalAmount * 100,
    expiration: 3600,
    order_id: paymobOrderId,
    billing_data: {
      email: order.email,
      first_name: order.fullName.split(' ')[0],
      last_name: order.fullName.split(' ').slice(1).join(' ') || 'N/A',
      phone_number: order.phone,
      street: order.address,
      city: order.city,
      country: 'EG',
      floor: 'N/A',
      building: 'N/A',
      apartment: 'N/A',
    },
    currency: 'EGP',
    integration_id: PAYMOB_INTEGRATION_ID,
  });
  return response.data.token;
};

// --- Main function to initiate payment ---
const initiatePayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Fetch the order to get its details
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Start the Paymob flow
    const authToken = await getAuthToken();
    const paymobOrderId = await registerOrder(authToken, order);
    const paymentKey = await getPaymentKey(authToken, paymobOrderId, order);

    // Send the payment key back to the frontend
    res.status(200).json({ paymentKey });

  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Handle Paymob's processed callback ---
const processedCallback = async (req, res) => {
  const { id: paymobTransactionId, success, order: { merchant_order_id: orderId } } = req.body.obj;

  // Verify the HMAC to ensure the request is from Paymob
  const hmac = req.query.hmac;
  const calculatedHmac = calculateHmac(req.body);
  if (hmac !== calculatedHmac) {
    return res.status(401).json({ message: 'Invalid HMAC' });
  }

  try {
    if (success) {
      // Payment was successful, update the PaymentInfo record and the Order status
      await prisma.paymentInfo.update({
        where: { orderId: orderId },
        data: {
          status: 'SUCCESS',
          transactionId: paymobTransactionId.toString(),
          paymobOrderId: req.body.obj.order.id.toString(),
        },
      });
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });
    } else {
      // Payment failed, update the PaymentInfo record
      await prisma.paymentInfo.update({
        where: { orderId: orderId },
        data: { status: 'FAILED' },
      });
    }

    res.status(200).send(); // Respond to Paymob to acknowledge receipt

  } catch (error) {
    console.error('Error processing Paymob callback:', error);
    res.status(500).send();
  }
};

// --- Handle the response callback (user redirection) ---
const responseCallback = (req, res) => {
  const { success } = req.query;
  // Redirect user to a frontend page indicating success or failure
  const redirectUrl = success === 'true' 
    ? `${process.env.FRONTEND_URL}/payment-success` 
    : `${process.env.FRONTEND_URL}/payment-failed`;
  res.redirect(redirectUrl);
};

// --- Helper to calculate HMAC for verification ---
const calculateHmac = (data) => {
    const hmacFields = [
        data.obj.amount_cents,
        data.obj.created_at,
        data.obj.currency,
        data.obj.error_occured,
        data.obj.has_parent_transaction,
        data.obj.id,
        data.obj.integration_id,
        data.obj.is_3d_secure,
        data.obj.is_auth,
        data.obj.is_capture,
        data.obj.is_refunded,
        data.obj.is_standalone_payment,
        data.obj.is_voided,
        data.obj.order.id,
        data.obj.owner,
        data.obj.pending,
        data.obj.source_data.pan,
        data.obj.source_data.sub_type,
        data.obj.source_data.type,
        data.obj.success,
    ].join('');

    return crypto.createHmac('sha512', PAYMOB_HMAC_SECRET).update(hmacFields).digest('hex');
};

module.exports = { initiatePayment, processedCallback, responseCallback };
