const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const contactMessage = await prisma.contactMessage.create({
    data: { name, email, subject, message },
  });
  res.status(201).json({
    success: true,
    message: "Thanks for reaching out! We'll get back to you soon.",
    data: contactMessage,
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const take = Math.min(Number(limit) || 10, 100);
  const skip = (Math.max(Number(page), 1) - 1) * take;

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take, skip }),
    prisma.contactMessage.count(),
  ]);

  res.json({
    success: true,
    data: messages,
    meta: { total, page: Number(page), limit: take, totalPages: Math.max(Math.ceil(total / take), 1) },
  });
});

const resolveMessage = asyncHandler(async (req, res) => {
  const message = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { resolved: true },
  });
  res.json({ success: true, data: message });
});

module.exports = { createMessage, getMessages, resolveMessage };
