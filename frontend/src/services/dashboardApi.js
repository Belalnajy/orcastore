const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Dashboard API for admin statistics
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (token) => {
    return fetchAPI("admin/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Get recent orders
  getRecentOrders: async (limit = 5, token) => {
    return fetchAPI(`admin/dashboard/recent-orders?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Get top selling products
  getTopProducts: async (limit = 5, token) => {
    return fetchAPI(`admin/dashboard/top-products?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Get sales data for chart
  getSalesData: async (period = 'week', token) => {
    return fetchAPI(`admin/dashboard/sales?period=${period}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Get low stock products
  getLowStockProducts: async (limit = 5, token) => {
    return fetchAPI(`admin/dashboard/low-stock?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Get category distribution
  getCategoryDistribution: async (token) => {
    return fetchAPI("admin/dashboard/category-distribution", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

// Mock data functions for development
export const mockDashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    return {
      total_orders: 156,
      total_sales: 12589.99,
      total_customers: 87,
      total_products: 48,
      pending_orders: 12,
      low_stock_products: 8
    };
  },
  
  // Get recent orders
  getRecentOrders: async (limit = 5) => {
    const orders = [
      {
        id: 'ORD-001',
        customer: 'Ahmed Mohamed',
        date: '2025-05-05',
        amount: 129.99,
        status: 'completed'
      },
      {
        id: 'ORD-002',
        customer: 'Sara Ahmed',
        date: '2025-05-04',
        amount: 89.50,
        status: 'processing'
      },
      {
        id: 'ORD-003',
        customer: 'Mohamed Ali',
        date: '2025-05-04',
        amount: 210.25,
        status: 'paid'
      },
      {
        id: 'ORD-004',
        customer: 'Layla Hassan',
        date: '2025-05-03',
        amount: 45.99,
        status: 'pending'
      },
      {
        id: 'ORD-005',
        customer: 'Omar Khaled',
        date: '2025-05-03',
        amount: 178.50,
        status: 'completed'
      },
      {
        id: 'ORD-006',
        customer: 'Nour Ibrahim',
        date: '2025-05-02',
        amount: 67.25,
        status: 'cancelled'
      }
    ];
    
    return orders.slice(0, limit);
  },
  
  // Get top selling products
  getTopProducts: async (limit = 5) => {
    const products = [
      {
        id: 'P001',
        name: 'Classic Cotton T-Shirt',
        image: '/images/product-placeholder.jpg',
        sold: 42,
        revenue: 1259.58
      },
      {
        id: 'P003',
        name: 'Slim Fit Jeans',
        image: '/images/product-placeholder.jpg',
        sold: 38,
        revenue: 2659.62
      },
      {
        id: 'P007',
        name: 'Casual Hoodie',
        image: '/images/product-placeholder.jpg',
        sold: 35,
        revenue: 1749.65
      },
      {
        id: 'P012',
        name: 'Summer Dress',
        image: '/images/product-placeholder.jpg',
        sold: 29,
        revenue: 1449.71
      },
      {
        id: 'P005',
        name: 'Sports Jacket',
        image: '/images/product-placeholder.jpg',
        sold: 26,
        revenue: 2079.74
      },
      {
        id: 'P009',
        name: 'Leather Belt',
        image: '/images/product-placeholder.jpg',
        sold: 24,
        revenue: 719.76
      }
    ];
    
    return products.slice(0, limit);
  },
  
  // Get sales data for chart
  getSalesData: async (period = 'week') => {
    let labels = [];
    let data = [];
    
    if (period === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      data = [450.99, 589.25, 320.75, 687.50, 892.30, 1250.75, 950.25];
    } else if (period === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = [3141.74, 2895.55, 3587.25, 2965.45];
    } else if (period === 'year') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = [8500.25, 7950.75, 9250.50, 8750.25, 10250.75, 11500.50, 10750.25, 9500.75, 12500.50, 11750.25, 13500.75, 15250.50];
    }
    
    return {
      labels,
      data
    };
  },
  
  // Get low stock products
  getLowStockProducts: async (limit = 5) => {
    const products = [
      {
        id: 'P002',
        name: 'Premium Polo Shirt',
        image: '/images/product-placeholder.jpg',
        stock: 3,
        threshold: 5
      },
      {
        id: 'P008',
        name: 'Winter Jacket',
        image: '/images/product-placeholder.jpg',
        stock: 2,
        threshold: 5
      },
      {
        id: 'P015',
        name: 'Designer Scarf',
        image: '/images/product-placeholder.jpg',
        stock: 4,
        threshold: 5
      },
      {
        id: 'P023',
        name: 'Leather Gloves',
        image: '/images/product-placeholder.jpg',
        stock: 1,
        threshold: 5
      },
      {
        id: 'P031',
        name: 'Wool Beanie',
        image: '/images/product-placeholder.jpg',
        stock: 2,
        threshold: 5
      }
    ];
    
    return products.slice(0, limit);
  },
  
  // Get category distribution
  getCategoryDistribution: async () => {
    return [
      { name: 'Men', count: 18, percentage: 37.5 },
      { name: 'Women', count: 22, percentage: 45.8 },
      { name: 'Kids', count: 5, percentage: 10.4 },
      { name: 'Accessories', count: 3, percentage: 6.3 }
    ];
  }
};
