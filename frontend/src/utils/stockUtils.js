/**
 * Utility functions for handling product stock calculations
 */

/**
 * Calculate total stock from sizeStock object or product object
 * @param {Object|Object} sizeStockOrProduct - sizeStock object or Product object
 * @returns {number} Total available stock
 */
export const getTotalStock = (sizeStockOrProduct) => {
  // If it's a product object with sizeStock property
  if (sizeStockOrProduct && sizeStockOrProduct.sizeStock !== undefined) {
    const sizeStock = sizeStockOrProduct.sizeStock;
    
    // Handle string sizeStock (JSON)
    if (typeof sizeStock === 'string') {
      try {
        const parsed = JSON.parse(sizeStock);
        if (parsed && typeof parsed === 'object') {
          return Object.values(parsed).reduce((total, stock) => {
            const stockValue = parseInt(stock) || 0;
            return total + stockValue;
          }, 0);
        }
      } catch (e) {
        console.warn('Error parsing sizeStock JSON:', e);
        return sizeStockOrProduct.stock || 0;
      }
    }
    
    // Handle object sizeStock
    if (sizeStock && typeof sizeStock === 'object' && sizeStock !== null) {
      return Object.values(sizeStock).reduce((total, stock) => {
        const stockValue = parseInt(stock) || 0;
        return total + stockValue;
      }, 0);
    }
    
    // Fallback to old stock field
    return sizeStockOrProduct.stock || 0;
  }
  
  // If it's a sizeStock object directly
  if (sizeStockOrProduct && typeof sizeStockOrProduct === 'object' && sizeStockOrProduct !== null && !sizeStockOrProduct.hasOwnProperty('id')) {
    return Object.values(sizeStockOrProduct).reduce((total, stock) => {
      const stockValue = parseInt(stock) || 0;
      return total + stockValue;
    }, 0);
  }
  
  // If it's a string (JSON)
  if (typeof sizeStockOrProduct === 'string') {
    try {
      const parsed = JSON.parse(sizeStockOrProduct);
      if (parsed && typeof parsed === 'object') {
        return Object.values(parsed).reduce((total, stock) => {
          const stockValue = parseInt(stock) || 0;
          return total + stockValue;
        }, 0);
      }
    } catch (e) {
      console.warn('Error parsing sizeStock JSON string:', e);
      return 0;
    }
  }
  
  return 0;
};

/**
 * Get stock for a specific size
 * @param {Object} product - Product object
 * @param {string} size - Size to check stock for
 * @returns {number} Stock for the specific size
 */
export const getStockForSize = (product, size) => {
  if (product.sizeStock && typeof product.sizeStock === 'object' && size) {
    return product.sizeStock[size] || 0;
  }
  return getTotalStock(product);
};

/**
 * Check if product has any stock available
 * @param {Object} product - Product object
 * @returns {boolean} True if product has stock
 */
export const hasStock = (product) => {
  return getTotalStock(product) > 0;
};

/**
 * Check if a specific size is available
 * @param {Object} product - Product object
 * @param {string} size - Size to check
 * @returns {boolean} True if size has stock
 */
export const isSizeAvailable = (product, size) => {
  return getStockForSize(product, size) > 0;
};

/**
 * Get available sizes with their stock quantities
 * @param {Object} product - Product object
 * @returns {Array} Array of {size, stock} objects
 */
export const getAvailableSizes = (product) => {
  if (!product.sizes || !Array.isArray(product.sizes)) {
    return [];
  }

  return product.sizes.map(size => ({
    size,
    stock: getStockForSize(product, size),
    available: isSizeAvailable(product, size)
  }));
};
