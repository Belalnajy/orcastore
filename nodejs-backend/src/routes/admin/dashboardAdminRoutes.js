const express = require('express');
const router = express.Router();
const dashboardAdminController = require('../../controllers/admin/dashboardAdminController');

// GET /api/admin/dashboard/stats
router.get('/stats', dashboardAdminController.getDashboardStats);

module.exports = router;
