const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const prisma = require('../config/prisma');

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.split(' ')[1];
  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new ApiError(401, 'You must be logged in to access this resource');
  }

  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw new ApiError(401, 'The user for this session no longer exists');
  }

  req.user = user;
  next();
});

// Attaches req.user if a valid token is present, but does not require one.
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (user) req.user = user;
  } catch {
    // ignore invalid token for optional auth
  }
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};

module.exports = { protect, optionalAuth, authorize };
