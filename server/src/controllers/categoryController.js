const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { events: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: categories });
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, icon } = req.body;
  const category = await prisma.category.create({
    data: { name, icon, slug: slugify(name) },
  });
  res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, icon } = req.body;
  const data = { icon };
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }
  const category = await prisma.category.update({ where: { id: req.params.id }, data });
  res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
