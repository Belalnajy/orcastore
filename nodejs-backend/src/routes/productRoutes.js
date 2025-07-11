const express = require('express');
const { getAllProducts, getProductBySlug } = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
// Add route to match frontend's getProductsByCategory
router.get('/by_category', getAllProducts);

router.get('/:slug', getProductBySlug);

module.exports = router;
