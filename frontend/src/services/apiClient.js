/**
 * API Client for the e-commerce store
 * Handles both mock data for development and real API calls for production
 */

// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Check if we're in development mode
const isDev = process.env.NODE_ENV === "development";

// For demo purposes, we'll use mock data if NEXT_PUBLIC_USE_MOCK_DATA is set to 'true'
// Setting this to false to use the real API
const useMockData = false;

// Image URL handling
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/images/product-placeholder.jpg";
  }

  // Base URL of the backend server
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  ).replace("/api", "");

  // If imagePath is already a full URL, return it
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Remove leading slash from imagePath if it exists
  const cleanImagePath = imagePath.startsWith("/")
    ? imagePath.slice(1)
    : imagePath;

  return `${baseUrl}/${cleanImagePath}`;
};

/**
 * Helper function for making API requests
 */
async function fetchAPI(endpoint, options = {}) {
  // Make sure endpoint doesn't start with a slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${API_URL}/${cleanEndpoint}`;

  // Handle FormData vs JSON
  let headers = {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // If we're in a browser environment, get the token from localStorage
  if (typeof window !== "undefined" && !options.headers?.Authorization) {
    const token = localStorage.getItem("auth_token");
    // console.log("Token from localStorage:", token);
    if (token) {
      // Clean the token (remove quotes, trim whitespace)
      const cleanToken = token.replace(/["']/g, "").trim();
      headers["Authorization"] = `Bearer ${cleanToken}`;
    }
  }

  // Clean up token if it's in the headers
  if (options.headers && options.headers.Authorization) {
    const authHeader = options.headers.Authorization;
    if (authHeader.startsWith("Bearer ")) {
      // Extract the token part
      const token = authHeader.substring(7).trim();
      // Remove any quotes and trim whitespace
      const cleanToken = token.replace(/["']/g, "").trim();
      // Set the cleaned token back
      options.headers.Authorization = `Bearer ${cleanToken}`;
    }
  }

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  // If it's JSON data, stringify it
  if (
    config.body &&
    !(config.body instanceof FormData) &&
    typeof config.body === "object"
  ) {
    config.body = JSON.stringify(config.body);
  }

  try {
    // console.log(`Fetching from: ${url}`);
    const response = await fetch(url, config);

    // Handle empty responses
    if (response.status === 204) {
      return { success: true };
    }

    // Try to parse as JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle Django REST Framework error format
      const errorMessage =
        typeof data === "object"
          ? data.detail || data.message || JSON.stringify(data)
          : data || "Something went wrong";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Category API
 */
export const categoryAPI = {
  getCategories: () => fetchAPI("categories"),
  getCategory: (id) => fetchAPI(`categories/${id}`),
  createCategory: (formData) =>
    fetchAPI("admin/categories", {
      method: "POST",
      body: formData // FormData handles multipart/form-data header automatically
    }),
  updateCategory: (id, formData) =>
    fetchAPI(`admin/categories/${id}`, {
      method: "PUT",
      body: formData
    }),
  deleteCategory: (id) =>
    fetchAPI(`admin/categories/${id}`, {
      method: "DELETE"
    })
};

/**
 * Product API
 */
export const productAPI = {
  // Create a new product
  createProduct: async (productData, token) => {
    console.log("Creating product with token:", token ? "Yes" : "No");
    // Always use real API for creating products
    return fetchAPI("admin/products/", {
      // Added trailing slash
      method: "POST",
      body: productData, // FormData object
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Update an existing product
  updateProduct: async (id, productData, token) => {
    // Always use real API for updating products
    return fetchAPI(`admin/products/${id}/`, {
      method: "PUT",
      body: productData, // FormData object
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Delete a product
  deleteProduct: async (id, token) => {
    // Always use real API for deleting products
    return fetchAPI(`admin/products/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Get products for admin (with pagination)
  getAdminProducts: async (params = {}, token) => {
    try {
      // Use real API
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
      console.log(
        `Fetching admin products with token: ${token ? "Yes" : "No"}`
      );

      const result = await fetchAPI(`admin/products/${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Process image URLs for products
      if (result.products) {
        result.products = result.products.map((product) => ({
          ...product,
          image: getImageUrl(product.image)
        }));
      }

      return result;
    } catch (error) {
      console.error(
        "Error fetching admin products from API, using mock data:",
        error
      );
      // Fallback to mock data if API fails
      return {
        products: mockData.products,
        pagination: {
          page: parseInt(params.page) || 1,
          limit: parseInt(params.limit) || 10,
          totalProducts: mockData.products.length,
          totalPages: Math.ceil(
            mockData.products.length / (parseInt(params.limit) || 10)
          )
        }
      };
    }
  },
  // Get all products
  getProducts: async (params = {}) => {
    // Use mock data in development if there's an error with the API
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const products = await fetchAPI(`products${query}`);

      // Process image URLs
      return products.map((product) => ({
        ...product,
        image: getImageUrl(product.image)
      }));
    } catch (error) {
      console.error(
        "Error fetching products from API, using mock data:",
        error
      );
      // Fallback to mock data if API fails
      return mockData.products;
    }
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    try {
      // Use real API
      const product = await fetchAPI(`products/${slug}/`);

      // Process image URL
      if (product.image) {
        product.image = getImageUrl(product.image);
      }

      return product;
    } catch (error) {
      console.error("Error fetching product from API, using mock data:", error);
      // Fallback to mock data if API fails
      const product =
        mockData.products.find((product) => product.slug === slug) || null;
      return product;
    }
  },

  // Get product by ID (for admin)
  getProductById: async (id, token) => {
    // Always use real API for admin operations
    const product = await fetchAPI(`admin/products/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Process image URL
    if (product.image) {
      product.image = getImageUrl(product.image);
    }

    return product;
  },

  // Get related products
  getRelatedProducts: async (category, productId) => {
    try {
      // First try to get products by category
      const products = await fetchAPI(
        `products/by_category/?category=${category}`
      );

      // Filter out the current product and limit to 4 related products
      const relatedProducts = products
        .filter((product) => product.id !== productId)
        .slice(0, 4);

      // Process image URLs
      return relatedProducts.map((product) => ({
        ...product,
        image: getImageUrl(product.image)
      }));
    } catch (error) {
      console.error("Error fetching related products from API:", error);

      // If we're using mock data, return filtered mock products
      if (useMockData || isDev) {
        return mockData.products
          .filter(
            (product) =>
              product.category === category && product.id !== productId
          )
          .slice(0, 4);
      }

      // If all else fails, return an empty array instead of throwing an error
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (categorySlug) => {
    try {
      // Use real API
      const products = await fetchAPI(
        `products/by_category/?category=${categorySlug}`
      );

      // Process image URLs
      return products.map((product) => ({
        ...product,
        image: getImageUrl(product.image)
      }));
    } catch (error) {
      console.error(
        "Error fetching category products from API, using mock data:",
        error
      );
      // Fallback to mock data if API fails
      return mockData.products.filter(
        (product) => product.category === categorySlug
      );
    }
  }
};

/**
 * Order API
 */
export const orderAPI = {
  // Create order
  createOrder: async (orderData) => {
    // Always use real API for creating orders
    return fetchAPI("orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  },

  // Get user orders
  getUserOrders: async (token) => {
    if (isDev) {
      // Use mock data in development
      return mockData.orders;
    }

    // Use real API in production
    return fetchAPI("orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

/**
 * Payment API
 */
export const paymentAPI = {
  // Create payment for order
  createPayment: async (orderData) => {
    // Always use real API for payments
    return fetchAPI("payment/create", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  }
};

/**
 * Auth API
 */
export const authAPI = {
  // Login
  login: async (credentials) => {
    // Always use real API for authentication
    return fetchAPI("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  },

  // Register
  register: async (userData) => {
    // Always use real API for authentication
    return fetchAPI("auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  }
};
