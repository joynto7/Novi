const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');

const EVENT_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  images: true,
  startDate: true,
  location: true,
  price: true,
  capacity: true,
  seatsBooked: true,
  featured: true,
  category: { select: { id: true, name: true, slug: true, icon: true } },
};

const withRating = (event) => {
  const ratings = event.reviews?.map((r) => r.rating) || [];
  const avgRating = ratings.length
    ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
    : 0;
  return { ...event, avgRating, reviewCount: ratings.length };
};

const getEvents = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = 'startDate_asc',
    page = 1,
    limit = 9,
    featured,
    timeframe = 'upcoming',
  } = req.query;

  const where = { status: 'PUBLISHED' };

  if (timeframe === 'upcoming') where.startDate = { gte: new Date() };
  else if (timeframe === 'past') where.startDate = { lt: new Date() };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) where.category = { slug: category };
  if (featured === 'true') where.featured = true;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const sortMap = {
    startDate_asc: { startDate: 'asc' },
    startDate_desc: { startDate: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    newest: { createdAt: 'desc' },
  };
  const orderBy = sortMap[sort] || sortMap.startDate_asc;

  const take = Math.min(Number(limit) || 9, 50);
  const skip = (Math.max(Number(page), 1) - 1) * take;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      select: { ...EVENT_CARD_SELECT, reviews: { select: { rating: true } } },
      orderBy,
      take,
      skip,
    }),
    prisma.event.count({ where }),
  ]);

  res.json({
    success: true,
    data: events.map(withRating),
    meta: {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.max(Math.ceil(total / take), 1),
    },
  });
});

const getEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      organizer: { select: { id: true, name: true, avatar: true } },
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!event) throw new ApiError(404, 'Event not found');

  res.json({ success: true, data: withRating(event) });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) throw new ApiError(404, 'Event not found');
  if (req.user.role !== 'ADMIN' && event.organizerId !== req.user.id) {
    throw new ApiError(403, 'You can only view your own events');
  }
  res.json({ success: true, data: event });
});

const getRelatedEvents = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { slug: req.params.slug } });
  if (!event) throw new ApiError(404, 'Event not found');

  const related = await prisma.event.findMany({
    where: {
      categoryId: event.categoryId,
      id: { not: event.id },
      status: 'PUBLISHED',
    },
    select: EVENT_CARD_SELECT,
    take: 3,
  });

  res.json({ success: true, data: related });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { organizerId: req.user.id };
  const events = await prisma.event.findMany({
    where,
    include: {
      category: true,
      organizer: { select: { id: true, name: true } },
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: events });
});

const buildEventData = async (req) => {
  const {
    title,
    shortDescription,
    description,
    overview,
    images,
    videoUrl,
    startDate,
    endDate,
    location,
    venue,
    price,
    capacity,
    categoryId,
    status,
    featured,
  } = req.body;

  return {
    title,
    slug: slugify(title) + '-' + Math.random().toString(36).slice(2, 7),
    shortDescription,
    description,
    overview,
    images,
    videoUrl: videoUrl || null,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    location,
    venue,
    price: Number(price),
    capacity: Number(capacity),
    categoryId,
    status: status || 'PUBLISHED',
    featured: Boolean(featured),
  };
};

const createEvent = asyncHandler(async (req, res) => {
  const data = await buildEventData(req);
  const event = await prisma.event.create({
    data: { ...data, organizerId: req.user.id },
  });
  res.status(201).json({ success: true, data: event });
});

const assertOwnerOrAdmin = async (req) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) throw new ApiError(404, 'Event not found');
  if (req.user.role !== 'ADMIN' && event.organizerId !== req.user.id) {
    throw new ApiError(403, 'You can only manage your own events');
  }
  return event;
};

const updateEvent = asyncHandler(async (req, res) => {
  await assertOwnerOrAdmin(req);

  const {
    title,
    shortDescription,
    description,
    overview,
    images,
    videoUrl,
    startDate,
    endDate,
    location,
    venue,
    price,
    capacity,
    categoryId,
    status,
    featured,
  } = req.body;

  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(shortDescription && { shortDescription }),
      ...(description && { description }),
      ...(overview && { overview }),
      ...(images && { images }),
      ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(location && { location }),
      ...(venue && { venue }),
      ...(price !== undefined && { price: Number(price) }),
      ...(capacity !== undefined && { capacity: Number(capacity) }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
    },
  });

  res.json({ success: true, data: event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  await assertOwnerOrAdmin(req);
  await prisma.event.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null });
});

module.exports = {
  getEvents,
  getEvent,
  getEventById,
  getRelatedEvents,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
