const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Define dashboard endpoints
router.get('/counts', dashboardController.getDashboardCounts);
router.get('/graphs', dashboardController.getDashboardGraphs);

module.exports = router;
