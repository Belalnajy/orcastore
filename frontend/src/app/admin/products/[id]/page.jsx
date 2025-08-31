'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Minus, 
  X,
  Loader2,
  Check,
  AlertCircle,
  Trash2
} from 'lucide-react';

import { productAPI, categoryAPI } from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';

import DeleteConfirmationModal from '@/components/admin/products/DeleteConfirmationModal';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  // Multiple images preview
  const [previewImages, setPreviewImages] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: '',
    isActive: true,
    features: [''],
    sizes: [''],
    colors: [''],
    sizeStock: {}, // Object to store stock for each size
    images: [] // now array
  });

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isAuthenticated()) {
          router.push('/admin/login');
          return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const categoriesData = await categoryAPI.getCategories();
        setCategories(categoriesData);

        const productData = await productAPI.getProductById(productId, token);

        let categoryId = '';
        if (productData.category) {
          categoryId = productData.category.id || productData.categoryId || '';
        }

        // تحويل sizeStock من سلسلة JSON إلى كائج إذا لزم الأمر
        let processedSizeStock = {};
        if (productData.sizeStock) {
          if (typeof productData.sizeStock === 'string') {
            try {
              processedSizeStock = JSON.parse(productData.sizeStock);
            } catch (e) {
              console.error('Error parsing sizeStock:', e);
              processedSizeStock = {};
            }
          } else if (typeof productData.sizeStock === 'object') {
            processedSizeStock = { ...productData.sizeStock };
          }
        }

        // Sync sizes list with sizeStock keys (like add page logic)
        // 1) Derive sizes from productData.sizes or from sizeStock keys
        let derivedSizes = Array.isArray(productData.sizes) && productData.sizes.length > 0
          ? [...productData.sizes]
          : Object.keys(processedSizeStock);
        if (derivedSizes.length === 0) derivedSizes = [''];

        // 2) Normalize sizes (trim) and dedupe
        derivedSizes = Array.from(new Set(derivedSizes.map(s => (typeof s === 'string' ? s.trim() : s)).filter(Boolean)));
        if (derivedSizes.length === 0) derivedSizes = [''];

        // 3) Ensure sizeStock has an entry for every size (default 0) and remove extraneous keys
        const normalizedSizeStock = {};
        for (const size of derivedSizes) {
          if (size) {
            const v = processedSizeStock && Object.prototype.hasOwnProperty.call(processedSizeStock, size)
              ? processedSizeStock[size]
              : 0;
            normalizedSizeStock[size] = parseInt(v) || 0;
          }
        }

        setFormData({
          name: productData.name || '',
          slug: productData.slug || '',
          description: productData.description || '',
          price: productData.price || '',
          categoryId: categoryId,
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          features: productData.features?.length > 0 ? productData.features : [''],
          sizes: derivedSizes,
          colors: productData.colors?.length > 0 ? productData.colors : [''],
          sizeStock: normalizedSizeStock,
          images: []
        });

        // Set existing images as preview
        if (productData.images && productData.images.length > 0) {
          setPreviewImages(productData.images);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load product data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId, isAuthenticated, router]);

  // Generate slug from name
  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name') {
      // Auto-generate slug when name changes
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle multiple images change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    // Validate all files
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Each image size should be less than 5MB');
        return;
      }
    }
    setFormData({
      ...formData,
      images: files
    });
    // Generate preview URLs
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(setPreviewImages);
  };

  // Handle array fields (features, sizes, colors)
  const handleArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    const oldValue = newArray[index];
    newArray[index] = value;
    
    // If this is a size field and the value changed, update sizeStock accordingly
    if (field === 'sizes') {
      const newSizeStock = { ...formData.sizeStock };
      
      // If the old value existed in sizeStock, remove it
      if (oldValue && newSizeStock[oldValue] !== undefined) {
        delete newSizeStock[oldValue];
      }
      
      // If the new value is not empty, initialize it with 0 stock
      if (value.trim()) {
        newSizeStock[value] = newSizeStock[value] || 0;
      }
      
      setFormData({
        ...formData,
        [field]: newArray,
        sizeStock: newSizeStock
      });
    } else {
      setFormData({
        ...formData,
        [field]: newArray
      });
    }
  };

  // Add new item to array field
  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  // Handle size stock change
  const handleSizeStockChange = (size, stock) => {
    setFormData({
      ...formData,
      sizeStock: {
        ...formData.sizeStock,
        [size]: parseInt(stock) || 0
      }
    });
  };

  // Remove item from array field
  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    
    // If this is a size field, also remove it from sizeStock
    if (field === 'sizes') {
      const removedValue = formData[field][index];
      const newSizeStock = { ...formData.sizeStock };
      if (removedValue && newSizeStock[removedValue] !== undefined) {
        delete newSizeStock[removedValue];
      }
      
      setFormData({
        ...formData,
        [field]: newArray.length === 0 ? [''] : newArray,
        sizeStock: newSizeStock
      });
    } else {
      setFormData({
        ...formData,
        [field]: newArray.length === 0 ? [''] : newArray
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const categoryObj = categories.find((cat) => cat.id === formData.categoryId);
      if (!categoryObj) throw new Error('Selected category is not valid.');

      const productData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'images' || key === 'sizeStock' || Array.isArray(formData[key])) return;
        if (key === 'categoryId') {
          productData.append('categoryId', formData.categoryId);
        } else {
          productData.append(key, formData[key]);
        }
      });

      ['features', 'sizes', 'colors'].forEach((field) => {
        productData.append(field, JSON.stringify(formData[field].filter(item => item.trim())));
      });
      
      // Add sizeStock
      productData.append('sizeStock', JSON.stringify(formData.sizeStock));

      // Handle multiple images
      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          productData.append('images', formData.images[i]);
        }
      }

      await productAPI.updateProduct(productId, productData, token);

      setSuccess(true);
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => router.push('/admin/products'), 2000);
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      await productAPI.deleteProduct(productId, token);
      
      setSuccessMessage('Product deleted successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
      
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Handle different types of errors
      let errorMsg = 'Failed to delete product';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      setSubmitting(false);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className={`px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 disabled:opacity-50 ${
              submitting ? 'cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            <Trash2 className="h-4 w-4 inline -mt-1 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <Check className="h-4 w-4 inline mr-2" />
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="product-slug"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from product name</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Right Column: Image, Category, Price */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                </label>
              </div>
              
              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-md border"
                        sizes="150px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Product is active
              </label>
            </div>
          </div>
        </div>

        {/* Features and Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Features
            </label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayField('features', index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="e.g. Lightweight, Waterproof"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="mt-2 flex items-center text-sm text-secondary hover:text-secondary/80"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </button>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Colors
            </label>
            {formData.colors.map((color, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleArrayField('colors', index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="e.g. red, blue, black"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('colors', index)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('colors')}
              className="mt-2 flex items-center text-sm text-secondary hover:text-secondary/80"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Color
            </button>
          </div>
        </div>
        
        {/* Sizes and Stock Management */}
        <div className="pt-8 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Sizes & Stock Management <span className="text-red-500">*</span>
          </label>
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* Size Input Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Available Sizes
              </label>
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => handleArrayField('sizes', index, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="e.g. S, M, L, XL"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('sizes', index)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('sizes')}
                className="mt-2 flex items-center text-sm text-secondary hover:text-secondary/80"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Size
              </button>
            </div>
            
            {/* Stock Management Section */}
            {formData.sizes.some(size => size.trim()) && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Stock Quantity for Each Size
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.sizes
                    .filter(size => size.trim()) // Only show non-empty sizes
                    .map((size, index) => (
                    <div key={`stock-${size}-${index}`} className="bg-white p-3 rounded-md border">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size: <span className="font-bold text-secondary">{size}</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sizeStock[size] || ''}
                        onChange={(e) => handleSizeStockChange(size, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="0"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.sizeStock[size] > 0 ? 
                          `${formData.sizeStock[size]} في المخزون` : 
                          'غير متوفر'
                        }
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>ملاحظة:</strong> المقاسات التي لها مخزون 0 أو فارغة لن تظهر كمتاحة للعملاء
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Submit buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || success}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Updating...
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Updated
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </form>

      <DeleteConfirmationModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        submitting={submitting}
      />
    </div>
  );
}
