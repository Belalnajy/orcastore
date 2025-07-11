const express = require('express');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/admin/categoryAdminController');
const { protect, admin } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(protect, admin);

router.route('/')
  .get(getAllCategories)
  .post(upload, createCategory);

router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
