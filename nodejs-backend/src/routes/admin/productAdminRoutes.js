const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} = require("../../controllers/admin/productAdminController");
const { protect, admin } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(protect, admin);

router
  .route("/")
  .get(getAllProducts)
  .post(upload, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(upload, updateProduct)
  .delete(deleteProduct);

module.exports = router;
