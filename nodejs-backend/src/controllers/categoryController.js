const prisma = require('../config/prisma');

// --- Get all categories ---
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Get a single category by slug ---
const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllCategories, getCategoryBySlug };
