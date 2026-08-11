const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');

const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const take = Math.min(Number(limit) || 6, 30);
  const skip = (Math.max(Number(page), 1) - 1) * take;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  res.json({
    success: true,
    data: posts,
    meta: { total, page: Number(page), limit: take, totalPages: Math.max(Math.ceil(total / take), 1) },
  });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug: req.params.slug },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });
  if (!post) throw new ApiError(404, 'Blog post not found');
  res.json({ success: true, data: post });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, coverImage, published } = req.body;
  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: slugify(title) + '-' + Math.random().toString(36).slice(2, 7),
      excerpt,
      content,
      coverImage,
      published: published !== false,
      authorId: req.user.id,
    },
  });
  res.status(201).json({ success: true, data: post });
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, coverImage, published } = req.body;
  const post = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(coverImage && { coverImage }),
      ...(published !== undefined && { published }),
    },
  });
  res.json({ success: true, data: post });
});

const deletePost = asyncHandler(async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null });
});

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
