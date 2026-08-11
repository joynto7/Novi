const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('eventId').trim().notEmpty().withMessage('Event is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  createBooking
);

router.get('/mine', protect, getMyBookings);
router.get('/', protect, authorize('ADMIN', 'ORGANIZER'), getAllBookings);
router.put('/:id/status', protect, authorize('ADMIN', 'ORGANIZER'), updateBookingStatus);

module.exports = router;
