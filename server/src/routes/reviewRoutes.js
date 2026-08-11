const express = require('express');
const { getFeaturedReviews } = require('../controllers/reviewController');

const router = express.Router();

router.get('/featured', getFeaturedReviews);

module.exports = router;
