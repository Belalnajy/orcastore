const prisma = require("../../config/prisma");
const cloudinary = require("../../config/cloudinaryConfig");

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const publicIdWithExtension = parts.slice(-2).join("/");
  return publicIdWithExtension.split(".").slice(0, -1).join(".");
};

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, slug, description } = req.body;

  try {
    const data = {
      name,
      slug,
      description
    };

    if (req.file) {
      data.image = req.file.path; // Add image URL from Cloudinary
    }

    const category = await prisma.category.create({ data });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(400)
      .json({ message: "Error creating category", error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description } = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const data = {
      name,
      slug,
      description
    };

    if (req.file) {
      // If a new image is uploaded, delete the old one from Cloudinary
      if (existingCategory.image) {
        const publicId = getPublicIdFromUrl(existingCategory.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      data.image = req.file.path; // Add the new image URL
    }

    const category = await prisma.category.update({
      where: { id },
      data
    });

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(400)
      .json({ message: "Error updating category", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id } });

    // If category has an image, delete it from Cloudinary first
    if (category && category.image) {
      const publicId = getPublicIdFromUrl(category.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category removed" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(404)
      .json({ message: "Category not found", error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById
};
