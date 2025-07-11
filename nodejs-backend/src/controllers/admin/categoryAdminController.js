const prisma = require('../../config/prisma');

// --- Get all categories (Admin) ---
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// --- Create a new category ---
const createCategory = async (req, res) => {
  const { name, slug, description } = req.body;
  const image = req.file ? req.file.path : null;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required.' });
  }

  try {
    const newCategory = await prisma.category.create({
      data: { 
        name,
        slug,
        description,
        image 
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed
      return res.status(400).json({ message: 'A category with this slug already exists.' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// --- Update a category ---
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, image } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug, description, image },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
     if (error.code === 'P2002') { // Unique constraint failed
      return res.status(400).json({ message: 'A category with this slug already exists.' });
    }
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// --- Delete a category ---
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2003') { // Foreign key constraint failed
      return res.status(400).json({ message: 'Cannot delete category. It is associated with existing products.' });
    }
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
