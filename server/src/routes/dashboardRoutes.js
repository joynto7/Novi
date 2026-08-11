const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getUserStats, getAdminStats } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/user-stats', protect, getUserStats);
router.get('/admin-stats', protect, authorize('ADMIN', 'ORGANIZER'), getAdminStats);

module.exports = router;
