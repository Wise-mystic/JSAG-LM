const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', isAuthenticated, dashboardController.getStats);

// Get recent books
router.get('/recent', isAuthenticated, dashboardController.getRecentBooks);

// Get borrowed books
router.get('/borrowed', isAuthenticated, dashboardController.getBorrowedBooks);

// Get books by status for charts
router.get('/status-chart', isAuthenticated, dashboardController.getBooksByStatus);

// Get monthly activity
router.get('/monthly-activity', isAuthenticated, dashboardController.getMonthlyActivity);

module.exports = router; 