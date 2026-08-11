const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const PUBLIC_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  phone: true,
  bio: true,
  createdAt: true,
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken({ id: user.id, role: user.role });
  const { password, ...safeUser } = user;
  res
    .status(statusCode)
    .cookie('token', token, COOKIE_OPTIONS)
    .json({ success: true, data: { user: safeUser, token } });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: 'USER' },
  });

  sendAuthResponse(res, user, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendAuthResponse(res, user);
});

// Demo login lets reviewers explore the app instantly without creating an account.
const demoLogin = asyncHandler(async (req, res) => {
  const { role = 'user' } = req.body;
  const email = role === 'admin' ? 'admin@novi.demo' : 'user@novi.demo';

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(500, 'Demo accounts are not seeded yet');
  }

  sendAuthResponse(res, user);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ success: true, data: null });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: PUBLIC_FIELDS,
  });
  res.json({ success: true, data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone, bio, avatar },
    select: PUBLIC_FIELDS,
  });

  res.json({ success: true, data: user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = {
  register,
  login,
  demoLogin,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
