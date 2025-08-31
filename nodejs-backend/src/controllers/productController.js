const prisma = require('../config/prisma');

// --- Get all products (with optional category filter) ---
const getAllProducts = async (req, res) => {
  const { category: categorySlug } = req.query;

  try {
    const where = {
      isActive: true // Only show active products to public
    };
    
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

    // Process sizeStock for each product
    const processedProducts = products.map(product => {
      let sizeStock = {};
      
      // Parse sizeStock if it's a string
      if (typeof product.sizeStock === 'string') {
        try {
          sizeStock = JSON.parse(product.sizeStock);
        } catch (e) {
          console.error('Error parsing sizeStock for product:', product.id, e);
          sizeStock = {};
        }
      } else if (typeof product.sizeStock === 'object' && product.sizeStock !== null) {
        sizeStock = product.sizeStock;
      }
      
      return {
        ...product,
        sizeStock
      };
    });

    res.status(200).json(processedProducts);
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
      where: { 
        slug,
        isActive: true // Only show active products to public
      },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process sizeStock
    let sizeStock = {};
    if (typeof product.sizeStock === 'string') {
      try {
        sizeStock = JSON.parse(product.sizeStock);
      } catch (e) {
        console.error('Error parsing sizeStock for product:', product.id, e);
        sizeStock = {};
      }
    } else if (typeof product.sizeStock === 'object' && product.sizeStock !== null) {
      sizeStock = product.sizeStock;
    }

    const processedProduct = {
      ...product,
      sizeStock
    };

    res.status(200).json(processedProduct);
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllProducts, getProductBySlug };
