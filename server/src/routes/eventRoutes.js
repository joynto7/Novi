const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getEvents,
  getEvent,
  getEventById,
  getRelatedEvents,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { getEventReviews, createReview } = require('../controllers/reviewController');

const router = express.Router();

const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('overview').trim().notEmpty().withMessage('Overview is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('categoryId').trim().notEmpty().withMessage('Category is required'),
];

router.get('/', getEvents);
router.get('/mine', protect, authorize('ORGANIZER', 'ADMIN'), getMyEvents);
router.get('/id/:id', protect, authorize('ORGANIZER', 'ADMIN'), getEventById);
router.get('/:slug', getEvent);
router.get('/:slug/related', getRelatedEvents);

router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), eventValidation, validate, createEvent);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), updateEvent);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteEvent);

router.get('/:eventId/reviews', getEventReviews);
router.post(
  '/:eventId/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  createReview
);

module.exports = router;
