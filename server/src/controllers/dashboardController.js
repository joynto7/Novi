const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

const monthLabel = (date) => date.toLocaleString('en-US', { month: 'short' });

const lastNMonthsBuckets = (n) => {
  const buckets = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: monthLabel(d), date: d });
  }
  return buckets;
};

const bucketize = (records, dateField, buckets) => {
  const counts = Object.fromEntries(buckets.map((b) => [b.key, 0]));
  records.forEach((record) => {
    const d = new Date(record[dateField]);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in counts) counts[key] += 1;
  });
  return buckets.map((b) => ({ label: b.label, value: counts[b.key] }));
};

const getUserStats = asyncHandler(async (req, res) => {
  const [bookings, reviews] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { event: { select: { title: true, startDate: true, price: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where: { userId: req.user.id } }),
  ]);

  const upcoming = bookings.filter((b) => new Date(b.event.startDate) > new Date());
  const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const buckets = lastNMonthsBuckets(6);
  const spendTrend = buckets.map((b) => {
    const monthTotal = bookings
      .filter((booking) => {
        const d = new Date(booking.createdAt);
        return `${d.getFullYear()}-${d.getMonth()}` === b.key;
      })
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    return { label: b.label, value: Number(monthTotal.toFixed(2)) };
  });

  res.json({
    success: true,
    data: {
      overview: {
        totalBookings: bookings.length,
        upcomingEvents: upcoming.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        reviewsWritten: reviews,
      },
      spendTrend,
      recentBookings: bookings.slice(0, 5),
    },
  });
});

const getAdminStats = asyncHandler(async (req, res) => {
  const [userCount, eventCount, bookingCount, bookings, events, categories] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.booking.count(),
    prisma.booking.findMany({ select: { createdAt: true, totalPrice: true } }),
    prisma.event.findMany({ select: { categoryId: true, seatsBooked: true, capacity: true } }),
    prisma.category.findMany({ select: { id: true, name: true } }),
  ]);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const buckets = lastNMonthsBuckets(6);
  const bookingsTrend = bucketize(bookings, 'createdAt', buckets);
  const revenueTrend = buckets.map((b) => {
    const monthTotal = bookings
      .filter((booking) => {
        const d = new Date(booking.createdAt);
        return `${d.getFullYear()}-${d.getMonth()}` === b.key;
      })
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    return { label: b.label, value: Number(monthTotal.toFixed(2)) };
  });

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const eventsByCategory = Object.values(
    events.reduce((acc, e) => {
      const name = categoryMap[e.categoryId] || 'Other';
      acc[name] = acc[name] || { label: name, value: 0 };
      acc[name].value += 1;
      return acc;
    }, {})
  );

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers: userCount,
        totalEvents: eventCount,
        totalBookings: bookingCount,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
      bookingsTrend,
      revenueTrend,
      eventsByCategory,
    },
  });
});

module.exports = { getUserStats, getAdminStats };
