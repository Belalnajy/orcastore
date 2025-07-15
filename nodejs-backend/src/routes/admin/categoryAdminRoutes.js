const express = require('express');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../../controllers/admin/categoryAdminController');
const { protect, admin } = require('../../middleware/authMiddleware');
const uploadSingleImage = require('../../middleware/uploadSingleImageMiddleware');

const router = express.Router();

// All routes are protected and for admins only
router.use(protect, admin);

router
  .route('/')
  .post(uploadSingleImage, createCategory)
  .get(getAllCategories);

router
  .route('/:id')
  .get(getCategoryById)
  .put(uploadSingleImage, updateCategory)
  .delete(deleteCategory);

module.exports = router;
