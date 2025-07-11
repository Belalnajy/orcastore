// Admin API service for interacting with the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper function for making API requests
async function fetchAdminAPI(endpoint, options = {}) {
  // Make sure endpoint doesn't start with a slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${API_URL}/${cleanEndpoint}`;

  console.log(`Making Admin API request to: ${url}`, options.method || "GET");

  // Handle FormData vs JSON
  let headers = {};
  // Attach auth token if present
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
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
    console.log(`Response status:`, response.status, response.statusText);

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
      const errorMessage = data.detail || JSON.stringify(data);
      throw new Error(`${response.status}: ${errorMessage}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

const adminAPI = {
  // Orders
  getOrders: async (page = 1, limit = 10, search = "", status = "") => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(status && { status })
    }).toString();

    return fetchAdminAPI(`admin/orders/?${queryParams}`, {
      method: "GET"
    });
  },

  getOrderDetails: async (orderId) => {
    return fetchAdminAPI(`admin/orders/${orderId}/`, {
      method: "GET"
    });
  },

  updateOrderStatus: async (orderId, status) => {
    return fetchAdminAPI(`admin/orders/${orderId}/status`, {
      method: "PUT",
      body: { status }
    });
  },

  updateOrderNotes: async (orderId, notes) => {
    return fetchAdminAPI(`admin/orders/${orderId}/`, {
      method: "PUT",
      body: { notes }
    });
  },

  // Products
  getProducts: async (page = 1, limit = 10, search = "", category = "") => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(category && { category })
    }).toString();

    return fetchAdminAPI(`admin/products/?${queryParams}`, {
      method: "GET"
    });
  },

  // Categories
  getCategories: async () => {
    return fetchAdminAPI("admin/categories/", {
      method: "GET"
    });
  },

  // Dashboard
  getDashboardStats: async () => {
    return fetchAdminAPI("dashboard/stats/", {
      method: "GET"
    });
  }
};

export default adminAPI;
