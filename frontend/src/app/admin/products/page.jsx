'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import { productAPI, categoryAPI } from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';
import ProductImage from '@/components/ProductImage';

async function getProducts(page = 1, limit = 10, search = '', category = '') {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return productAPI.getAdminProducts({ page, limit, search, category }, token);
}

async function getCategories() {
  try {
    return await categoryAPI.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function deleteProduct(id) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return productAPI.deleteProduct(id + '/', token);
}

export default function ProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalProducts: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isAuthenticated()) {
          console.error('User not authenticated');
          setErrorMessage('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const { products: productsData, pagination: paginationData } = await getProducts(
          pagination.page,
          pagination.limit,
          searchTerm,
          selectedCategory
        );
        setProducts(productsData || []);
        setPagination(
          paginationData && typeof paginationData.page !== 'undefined'
            ? paginationData
            : { page: 1, limit: 10, totalProducts: 0, totalPages: 0 }
        );

        const categoriesData = await getCategories();
        setCategories(categoriesData);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage(error.message || 'Error loading products');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [pagination.page, pagination.limit, searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setShowFilters(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      setPagination((prev) => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      setSuccessMessage('Product deleted successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage(error.message || 'Failed to delete product');
    } finally {
      setDeleteConfirm(null);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors text-sm sm:text-base"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md text-sm sm:text-base">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md text-sm sm:text-base">
          {successMessage}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>

          <button
            className="sm:hidden flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-5 w-5" />
            Filters
            {selectedCategory && (
              <span className="ml-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">1</span>
            )}
          </button>

          <div className="hidden sm:flex items-center flex-wrap gap-2">
            <span className="text-gray-500 text-sm">Category:</span>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                selectedCategory === '' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedCategory === category.slug ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <div className="sm:hidden fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm text-gray-500">Category</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`px-3 py-2 rounded-md text-sm ${
                    selectedCategory === '' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => handleCategoryChange('')}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-3 py-2 rounded-md text-sm ${
                      selectedCategory === category.slug ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {products.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 relative rounded-md overflow-hidden">
                            {product.image ? (
                              <ProductImage
                                src={product.images[1] || '/images/product-placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md ${
                                product.image ? 'hidden' : ''
                              }`}
                            >
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)} EGP
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-secondary hover:text-secondary/80 p-1 rounded-full hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-100"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
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
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-12 w-12 relative rounded-md overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image || '/images/product-placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md ${
                            product.image ? 'hidden' : ''
                          }`}
                        >
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.slug}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <div>Category: {product.category?.name || 'N/A'}</div>
                    <div>Price: ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</div>
                    <div className={product.stock < 10 ? 'text-red-600' : ''}>Stock: {product.stock}</div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-secondary hover:text-secondary/80 p-1 rounded-full hover:bg-gray-100"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-100"
                      title="Delete product"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.totalProducts)}</span>{' '}
                  of <span className="font-medium">{pagination.totalProducts}</span> products
                </div>
                <div className="flex justify-center sm:justify-end">
                  <nav className="flex items-center space-x-1" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`p-2 rounded-md ${
                        pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
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
                            isCurrentPage ? 'bg-secondary text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
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
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter to find what you're looking for."
                : 'Get started by adding your first product.'}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Product
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base"
                onClick={() => handleDeleteProduct(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}