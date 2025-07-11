const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  // Make sure endpoint doesn't start with a slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${API_URL}/${cleanEndpoint}`;

  // console.log(`Making API request to: ${url}`, options.method || "GET");

  // Handle FormData vs JSON
  let headers = {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
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
    const response = await fetch(url, config);
    // console.log(`Response status:`, response.status, response.statusText);

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
      const text = await response.text();
      console.log("Non-JSON response:", text.substring(0, 150) + "...");
      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${text.substring(0, 100)}`
        );
      }
      return { text };
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

// Product API
export const productAPI = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return fetchAPI(`products${query}`);
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    return fetchAPI(`products/${slug}`);
  },

  // Get products by category
  getProductsByCategory: async (categorySlug) => {
    return fetchAPI(`products/by_category?category=${categorySlug}`);
  },

  // Admin: Create product
  createProduct: async (productData, token) => {
    console.log("Creating product with token:", token ? "Yes" : "No");
    const formData = new FormData();

    // Convert productData object to FormData for file uploads
    Object.entries(productData).forEach(([key, value]) => {
      // Handle image file separately
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    return fetchAPI(`admin/products/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Update product
  updateProduct: async (productId, productData, token) => {
    const formData = new FormData();

    // Convert productData object to FormData for file uploads
    Object.entries(productData).forEach(([key, value]) => {
      // Handle image file separately
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    return fetch(`${API_URL}/admin/products/${productId}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "Something went wrong");
        });
      }
      return response.json();
    });
  },

  // Admin: Delete product
  deleteProduct: async (productId, token) => {
    return fetchAPI(`admin/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Get all products with pagination and filtering
  getAdminProducts: async (params = {}, token) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return fetchAPI(`admin/products${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    return fetchAPI("categories");
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    return fetchAPI(`categories/${slug}`);
  },

  // Admin: Create category
  createCategory: async (categoryData, token) => {
    const formData = new FormData();

    // Convert categoryData object to FormData for file uploads
    Object.entries(categoryData).forEach(([key, value]) => {
      // Handle image file separately
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    return fetch(`${API_URL}/admin/categories`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "Something went wrong");
        });
      }
      return response.json();
    });
  },

  // Admin: Update category
  updateCategory: async (categoryId, categoryData, token) => {
    const formData = new FormData();

    // Convert categoryData object to FormData for file uploads
    Object.entries(categoryData).forEach(([key, value]) => {
      // Handle image file separately
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    return fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "Something went wrong");
        });
      }
      return response.json();
    });
  },

  // Admin: Delete category
  deleteCategory: async (categoryId, token) => {
    return fetchAPI(`admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

// Order API
export const orderAPI = {
  // Create order
  // Guest create order
  createGuestOrder: async (orderData) => {
    console.log("Creating guest order with data:", orderData);
    return fetchAPI("orders/guest", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  },
  createOrder: async (orderData, token = null) => {
    console.log("Creating order with data:", orderData);
    return fetchAPI("orders", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  },

  // Get user orders
  getUserOrders: async (token = null) => {
    // For demo purposes, we'll allow fetching orders without authentication
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return fetchAPI("orders/", { headers });
  },

  // Get order by ID (database ID)
  getOrderById: async (orderId, token = null) => {
    // For demo purposes, we'll allow fetching order details without authentication
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return fetchAPI(`orders/${orderId}/`, { headers });
  },

  // Get order by order_id (UUID)
  getOrderByOrderId: async (orderUUID, token = null) => {
    // For demo purposes, we'll allow fetching order details without authentication
    // Don't include any headers for this demo endpoint since we've set authentication_classes=[] on the backend
    return fetchAPI(`orders/by-order-id/${orderUUID}/`, {
      headers: {}
    });
  },

  // Admin: Get all orders with pagination and filtering
  getAdminOrders: async (params = {}, token) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return fetchAPI(`admin/orders${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Get order details
  getAdminOrderDetails: async (orderId, token) => {
    return fetchAPI(`admin/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status, token) => {
    return fetchAPI(`admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

// Payment API
export const paymentAPI = {
  createPayment: async (paymentData) => {
    console.log("Creating payment with data:", paymentData);
    return fetchAPI("payment/create/", {
      method: "POST",
      body: JSON.stringify(paymentData)
    });
  }
};

// Auth API (for admin dashboard)
export const authAPI = {
  // Login
  login: async (credentials) => {
    return fetchAPI("auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  },

  // Verify token
  verifyToken: async (token) => {
    return fetchAPI("auth/profile/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Logout
  logout: async (token) => {
    return fetchAPI("auth/logout/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
