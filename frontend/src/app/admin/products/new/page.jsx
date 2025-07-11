'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';

// Import API client
import { productAPI, categoryAPI } from '@/services/apiClient';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  // Multiple images preview
  const [previewImages, setPreviewImages] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: '',
    stock: '',
    isActive: true,
    features: [''],
    sizes: [''],
    colors: [''],
    images: [] // now array
  });
  
  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await categoryAPI.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      }
    }
    
    fetchCategories();
  }, []);
  
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
        setError('Please upload only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image size should be less than 5MB');
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
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };
  
  // Add new item to array field
  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };
  
  // Remove item from array field
  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray.length ? newArray : [''] // Always keep at least one empty field
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting categoryId:', formData.categoryId);
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.categoryId || !formData.price || !formData.images.length) {
        throw new Error('Please fill all required fields and upload at least one image.');
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Prepare form data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('description', formData.description);
      data.append('categoryId', formData.categoryId);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('isActive', formData.isActive);
      data.append('features', JSON.stringify(formData.features));
      data.append('sizes', JSON.stringify(formData.sizes));
      data.append('colors', JSON.stringify(formData.colors));
      formData.images.forEach((img, idx) => {
        data.append('images', img);
      });
      
      // Call the API to create the product
      await productAPI.createProduct(data, token);
      
      // Show success state
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/products"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 rounded-md bg-green-50 flex items-center text-green-700">
            <Check className="h-5 w-5 mr-2" />
            Product created successfully! Redirecting...
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Product name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              />
            </div>
            
            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                URL-friendly version of the product name. Auto-generated but can be edited.
              </p>
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    EGP
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            {/* Active status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active (visible on store)
              </label>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Product images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent mb-4"
              />
              {previewImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {previewImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Preview ${i+1}`}
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Features, Sizes, Colors */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            {formData.features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayField('features', index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="e.g. 100% cotton"
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
          
          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes
            </label>
            {formData.sizes.map((size, index) => (
              <div key={`size-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleArrayField('sizes', index, e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="e.g. S, M, L"
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
          
          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors
            </label>
            {formData.colors.map((color, index) => (
              <div key={`color-${index}`} className="flex mb-2">
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
            disabled={loading || success}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
