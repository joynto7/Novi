const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const createBooking = asyncHandler(async (req, res) => {
  const { eventId, quantity = 1 } = req.body;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new ApiError(404, 'Event not found');

  const seatsLeft = event.capacity - event.seatsBooked;
  if (quantity > seatsLeft) {
    throw new ApiError(400, `Only ${seatsLeft} seats left for this event`);
  }

  const [booking] = await prisma.$transaction([
    prisma.booking.create({
      data: {
        eventId,
        userId: req.user.id,
        quantity: Number(quantity),
        totalPrice: event.price * Number(quantity),
      },
      include: { event: { select: { title: true, slug: true, startDate: true, images: true } } },
    }),
    prisma.event.update({
      where: { id: eventId },
      data: { seatsBooked: { increment: Number(quantity) } },
    }),
  ]);

  res.status(201).json({ success: true, data: booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: { event: { select: { title: true, slug: true, startDate: true, images: true, location: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: bookings });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const take = Math.min(Number(limit) || 10, 100);
  const skip = (Math.max(Number(page), 1) - 1) * take;
  const where = status ? { status } : {};

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    success: true,
    data: bookings,
    meta: { total, page: Number(page), limit: take, totalPages: Math.max(Math.ceil(total / take), 1) },
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json({ success: true, data: booking });
});

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
