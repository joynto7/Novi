const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { createMessage, getMessages, resolveMessage } = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  validate,
  createMessage
);

router.get('/', protect, authorize('ADMIN'), getMessages);
router.put('/:id/resolve', protect, authorize('ADMIN'), resolveMessage);

module.exports = router;
