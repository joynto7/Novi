const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const PUBLIC_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  phone: true,
  createdAt: true,
  _count: { select: { bookings: true, eventsOwned: true } },
};

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  const take = Math.min(Number(limit) || 10, 100);
  const skip = (Math.max(Number(page), 1) - 1) * take;

  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: PUBLIC_FIELDS,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users,
    meta: { total, page: Number(page), limit: take, totalPages: Math.max(Math.ceil(total / take), 1) },
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (req.params.id === req.user.id) {
    throw new ApiError(400, 'You cannot change your own role');
  }
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: PUBLIC_FIELDS,
  });
  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, 'You cannot delete your own account');
  }
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null });
});

module.exports = { getUsers, updateUserRole, deleteUser };
