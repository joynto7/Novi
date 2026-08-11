const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const getEventReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { eventId: req.params.eventId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: reviews });
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new ApiError(404, 'Event not found');

  const existing = await prisma.review.findFirst({
    where: { eventId, userId: req.user.id },
  });
  if (existing) {
    throw new ApiError(409, 'You have already reviewed this event');
  }

  const review = await prisma.review.create({
    data: { rating: Number(rating), comment, eventId, userId: req.user.id },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  res.status(201).json({ success: true, data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own review');
  }
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null });
});

module.exports = { getEventReviews, createReview, deleteReview };
