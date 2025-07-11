const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./dashboardAdminRoutes'));

module.exports = router;
