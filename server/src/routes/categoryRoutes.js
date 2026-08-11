const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategory);

router.post(
  '/',
  protect,
  authorize('ADMIN'),
  [body('name').trim().notEmpty(), body('icon').trim().notEmpty()],
  validate,
  createCategory
);

router.put('/:id', protect, authorize('ADMIN'), updateCategory);
router.delete('/:id', protect, authorize('ADMIN'), deleteCategory);

module.exports = router;
