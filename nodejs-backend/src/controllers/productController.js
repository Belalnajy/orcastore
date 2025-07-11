const prisma = require('../config/prisma');

// --- Get all products (with optional category filter) ---
const getAllProducts = async (req, res) => {
  const { category: categorySlug } = req.query;

  try {
    const where = {};
    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true }, // Include category details
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Get a single product by slug ---
const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllProducts, getProductBySlug };
