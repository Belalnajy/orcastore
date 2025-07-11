const asyncHandler = require("express-async-handler");
const prisma = require("../../config/prisma");
const fs = require("fs");
const path = require("path");

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category: categorySlug = ""
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });
    if (category) {
      where.categoryId = category.id;
    } else {
      // If category slug is provided but not found, return no products
      return res.json({
        products: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalProducts: 0,
          totalPages: 0
        }
      });
    }
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limitNum,
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalProducts / limitNum);

  res.json({
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalProducts,
      totalPages
    }
  });
});

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    stock,
    categoryId,
    isActive,
    features,
    sizes,
    colors
  } = req.body;

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No images uploaded");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      categoryId: categoryId,
      isActive: isActive === "true",
      images: req.files.map(f => f.path),
      features:
        typeof features === "string"
          ? features.split(",").map((f) => f.trim())
          : features || [],
      sizes:
        typeof sizes === "string"
          ? sizes.split(",").map((s) => s.trim())
          : sizes || [],
      colors:
        typeof colors === "string"
          ? colors.split(",").map((c) => c.trim())
          : colors || []
    }
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    description,
    price,
    stock,
    categoryId,
    isActive,
    features,
    sizes,
    colors
  } = req.body;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let imagesPaths = product.images || [];
  if (req.files && req.files.length > 0) {
    // Delete old images if new ones are uploaded
    if (Array.isArray(product.images)) {
      product.images.forEach(imgPath => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }
    imagesPaths = req.files.map(f => f.path);
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      categoryId: categoryId,
      isActive: isActive === "true",
      images: imagesPaths,
      features:
        typeof features === "string"
          ? features.split(",").map((f) => f.trim())
          : features || [],
      sizes:
        typeof sizes === "string"
          ? sizes.split(",").map((s) => s.trim())
          : sizes || [],
      colors:
        typeof colors === "string"
          ? colors.split(",").map((c) => c.trim())
          : colors || []
    }
  });

  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Delete all product images
  if (Array.isArray(product.images)) {
    product.images.forEach(imgPath => {
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });
  }

  await prisma.product.delete({
    where: { id }
  });

  res.json({ message: "Product removed" });
});

// @desc    Get single product by ID
// @route   GET /api/admin/products/:id
// @access  Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
};
