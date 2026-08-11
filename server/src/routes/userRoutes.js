const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, authorize('ADMIN'), getUsers);
router.put('/:id/role', protect, authorize('ADMIN'), updateUserRole);
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

module.exports = router;
