'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';

import { categoryAPI } from '@/services/apiClient';

// Get categories from API
async function getCategories(search = '') {
  try {
    // Get token from localStorage for authenticated requests
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Fetch categories from API
    const categories = await categoryAPI.getCategories();
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      return categories.filter(category => 
        category.name.toLowerCase().includes(searchLower) || 
        (category.description && category.description.toLowerCase().includes(searchLower))
      );
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Fetch categories
  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesData = await getCategories(searchTerm);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [searchTerm]);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will trigger the search
  };
  
  // Open modal for creating a new category
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: null
    });
    setImagePreview('');
    setFormErrors({});
    setIsModalOpen(true);
  };
  
  // Open modal for editing a category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: null
    });
    setImagePreview(`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${category.image}`);
    setFormErrors({});
    setIsModalOpen(true);
  };
  
  // Open delete confirmation modal
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name if it's empty
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if any
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error for image if any
      if (formErrors.image) {
        setFormErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };
  
  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!selectedCategory && !formData.image && !imagePreview) {
      errors.image = 'Category image is required';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if we have a token at all
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Create FormData object for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('description', formData.description || '');
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      let successMessage = '';
      
      if (selectedCategory) {
        // Update existing category
        // Use the slug for the API request, as that's what the backend expects
        await categoryAPI.updateCategory(selectedCategory.slug, data);
        successMessage = `Category "${formData.name}" updated successfully`;
      } else {
        // Create new category
        await categoryAPI.createCategory(data);
        successMessage = `Category "${formData.name}" created successfully`;
      }
      
      // Refresh categories list
      const categoriesData = await getCategories(searchTerm);
      setCategories(categoriesData);
      
      // Close modal
      setIsModalOpen(false);
      
      // Show success toast notification
      toast.success(successMessage);
    } catch (error) {
      console.error('Error saving category:', error);
      setFormErrors({ submit: error.message || 'Failed to save category' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if we have a token at all
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        // If no token is found, redirect to login
        toast.error('Your session has expired. Please log in again.');
        setIsSubmitting(false);
        setIsDeleteModalOpen(false);
        window.location.href = '/login';
        return;
      }
      
      // Delete category via API - the API client will handle token authentication
      await categoryAPI.deleteCategory(selectedCategory.id, selectedCategory.slug);
      
      // Refresh categories list
      const categoriesData = await getCategories(searchTerm);
      setCategories(categoriesData);
      
      // Close modal
      setIsDeleteModalOpen(false);
      
      // Show success toast notification
      toast.success(`Category "${selectedCategory.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(`Error deleting category: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      
      {/* Search and Add */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
          
          {/* Add Category Button */}
          <button
            onClick={handleAddCategory}
            className="flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>
      
      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/${category.image}`}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{category.name}</h2>
                <p className="text-sm text-gray-500 mb-2">Slug: {category.slug}</p>
                <p className="text-sm text-gray-700 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.product_count} products</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit Category"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete Category"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'Try adjusting your search to find what you\'re looking for.'
              : 'Get started by adding your first category.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Category
            </button>
          )}
        </div>
      )}
      
      {/* Category Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => !isSubmitting && setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Category Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Category Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.name ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                          )}
                        </div>
                        
                        {/* Slug */}
                        <div>
                          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                            Slug *
                          </label>
                          <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              formErrors.slug ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                          />
                          {formErrors.slug && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                          )}
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                          ></textarea>
                        </div>
                        
                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Category Image {!selectedCategory && '*'}
                          </label>
                          <div 
                            onClick={handleImageClick}
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer ${
                              formErrors.image ? 'border-red-300' : 'border-gray-300'
                            } hover:border-secondary`}
                          >
                            <div className="space-y-1 text-center">
                              {imagePreview ? (
                                <div className="relative h-32 w-full">
                                  <Image
                                    src={imagePreview}
                                    alt="Category preview"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    style={{ objectFit: 'contain' }}
                                    className="rounded-md"
                                  />
                                </div>
                              ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              )}
                              <div className="flex text-sm text-gray-600">
                                <input
                                  ref={fileInputRef}
                                  id="image"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="sr-only"
                                />
                                <p className="pl-1">
                                  {imagePreview ? 'Change image' : 'Upload a file'}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          </div>
                          {formErrors.image && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      {selectedCategory ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    selectedCategory ? 'Update Category' : 'Create Category'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Category
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the category "{selectedCategory.name}"? This action cannot be undone.
                        {selectedCategory.product_count > 0 && (
                          <span className="block mt-2 font-medium text-red-600">
                            Warning: This category contains {selectedCategory.product_count} products.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
