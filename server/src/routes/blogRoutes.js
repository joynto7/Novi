const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/blogController');

const router = express.Router();

router.get('/', getPosts);
router.get('/:slug', getPost);

router.post(
  '/',
  protect,
  authorize('ADMIN'),
  [
    body('title').trim().notEmpty(),
    body('excerpt').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('coverImage').trim().notEmpty(),
  ],
  validate,
  createPost
);

router.put('/:id', protect, authorize('ADMIN'), updatePost);
router.delete('/:id', protect, authorize('ADMIN'), deletePost);

module.exports = router;
