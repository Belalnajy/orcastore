'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  X,
  AlertCircle,
} from 'lucide-react';
import adminAPI from '@/services/admin-api';

// Function to get orders from the API (unchanged)
async function getOrders(page = 1, limit = 10, search = '', status = '') {
  try {
    return await adminAPI.getOrders(page, limit, search, status);
    // Fallback mock data remains unchanged
    const allOrders = [
      // ... (mock data unchanged)
    ];
    let filteredOrders = allOrders;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.customer.toLowerCase().includes(searchLower) ||
          order.email.toLowerCase().includes(searchLower)
      );
    }
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status?.toUpperCase() === status.toUpperCase()
      );
    }
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      orders: [],
      pagination: {
        page,
        limit,
        totalOrders: 0,
        totalPages: 0,
      },
    };
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // Adjusted to a smaller limit for better performance
    totalOrders: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'PAID', label: 'Paid' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch orders with the current search and selectedStatus filter
      const data = await getOrders(pagination.page, pagination.limit, searchTerm, selectedStatus);

      if (Array.isArray(data)) {
        const normalizedOrders = data.map((order) => ({
          ...order,
          id: order.id || order._id,
        }));
        setOrders(normalizedOrders);
        setPagination((prev) => ({
          ...prev,
          totalOrders: data.length,
          totalPages: 1,
        }));
      } else if (data && data.orders && data.pagination) {
        const normalizedOrders = data.orders.map((order) => ({
          ...order,
          id: order.id || order._id,
        }));
        setOrders(normalizedOrders);
        setPagination((prev) => ({
          ...prev,
          totalOrders: data.pagination.totalOrders,
          totalPages: data.pagination.totalPages,
        }));
      } else {
        console.error('Unexpected API response format:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, searchTerm, selectedStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setShowFilters(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Orders</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by ID, customer, or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Filter Button (Mobile) */}
          <button
            className="sm:hidden flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-5 w-5" />
            Filters
            {selectedStatus && (
              <span className="ml-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                1
              </span>
            )}
          </button>

          {/* Status Filter (Desktop) */}
          <div className="hidden sm:flex items-center flex-wrap gap-2">
            <span className="text-gray-500 text-sm">Status:</span>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedStatus === option.value
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleStatusChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters (Slide-in Drawer) */}
        {showFilters && (
          <div className="sm:hidden fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm text-gray-500">Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-2 rounded-md text-sm ${
                      selectedStatus === option.value
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {/* <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th> */}
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                        {order.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer || order.full_name}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.date || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        EGP {parseFloat(order.amount || order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeColor(
                            order.status === 'completed' ? 'completed' : (order.payment?.status || 'pending')
                          )}`}
                        >
                          {(order.status === 'completed' ? 'completed' : (order.payment?.status || 'pending')).charAt(0).toUpperCase() +
                            (order.status === 'completed' ? 'completed' : (order.payment?.status || 'pending')).slice(1)}
                        </span>
                      </td> */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={order.id ? `/admin/orders/${order.id}` : '#'}
                            className={`text-blue-600 hover:text-blue-900${!order.id ? ' opacity-50 pointer-events-none' : ''}`}
                            title={order.id ? 'View Order' : 'Order ID missing'}
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900" title="Download Invoice">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 p-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-secondary">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.customer || order.full_name}</div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <div>Email: {order.email}</div>
                    <div>Date: {new Date(order.date || order.createdAt).toLocaleDateString()}</div>
                    <div>Amount: EGP {parseFloat(order.amount || order.totalAmount).toFixed(2)}</div>
                    {/* <div>
                      Payment:{' '}
                      <span
                        className={`inline-flex text-xs font-semibold rounded-full ${getPaymentStatusBadgeColor(
                          order.status === 'completed' ? 'completed' : (order.payment?.status || 'pending')
                        )}`}
                      >
                        {(order.status === 'completed' ? 'completed' : (order.payment?.status || 'pending')).charAt(0).toUpperCase() +
                          (order.status === 'completed' ? 'completed' : (order.payment?.status || 'pending')).slice(1)}
                      </span>
                    </div> */}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Link
                      href={order.id ? `/admin/orders/${order.id}` : '#'}
                      className={`text-blue-600 hover:text-blue-900${!order.id ? ' opacity-50 pointer-events-none' : ''}`}
                      title={order.id ? 'View Order' : 'Order ID missing'}
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900" title="Download Invoice">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalOrders)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalOrders}</span> orders
                </div>
                <div className="flex justify-center sm:justify-end">
                  <nav className="flex items-center space-x-1" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`p-2 rounded-md ${
                        pagination.page === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNumber = i + 1;
                      const isCurrentPage = pageNumber === pagination.page;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            isCurrentPage
                              ? 'bg-secondary text-white'
                              : 'bg-white text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 5 && (
                      <span className="px-3 py-1 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={`p-2 rounded-md ${
                        pagination.page === pagination.totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              {searchTerm || selectedStatus
                ? "Try adjusting your search or filter to find what you're looking for."
                : 'No orders have been placed yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}