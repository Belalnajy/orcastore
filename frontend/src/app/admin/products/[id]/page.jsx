'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, Trash2 } from 'lucide-react';

import { productAPI, categoryAPI } from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';

import PageHeader from '@/components/admin/products/PageHeader';
import ProductForm from '@/components/admin/products/ProductForm';
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
  const [previewImage, setPreviewImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    isActive: true,
    features: [''],
    sizes: [''],
    colors: [''],
    image: null,
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

        let categorySlug = '';
        if (productData.category) {
          const categoryObj = categoriesData.find((cat) => cat.id === productData.category);
          categorySlug = categoryObj ? categoryObj.slug : '';
        }

        setFormData({
          name: productData.name || '',
          slug: productData.slug || '',
          description: productData.description || '',
          price: productData.price || '',
          stock: productData.stock || '',
          category: categorySlug,
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          features: productData.features?.length > 0 ? productData.features : [''],
          sizes: productData.sizes?.length > 0 ? productData.sizes : [''],
          colors: productData.colors?.length > 0 ? productData.colors : [''],
          image: null,
        });

        if (productData.images) {
          setPreviewImage(productData.images[1]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage(error.message || 'Error loading product data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId, isAuthenticated, router]);

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, name: value, slug: generateSlug(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Image size should not exceed 2MB.');
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray.length === 0 ? [''] : newArray }));
  };

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

      const categoryObj = categories.find((cat) => cat.slug === formData.category);
      if (!categoryObj) throw new Error('Selected category is not valid.');

      const productData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'image' || Array.isArray(formData[key])) return;
        if (key === 'category') {
          productData.append('categoryId', categoryObj.id);
        } else {
          productData.append(key, formData[key]);
        }
      });

      ['features', 'sizes', 'colors'].forEach((field) => {
        formData[field].forEach((item) => item && productData.append(field, item));
      });

      if (formData.image) {
        productData.append('image', formData.image);
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
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      await productAPI.deleteProduct(productId, token);
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => router.push('/admin/products'), 2000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to delete product');
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
      <PageHeader title="Edit Product" backLink="/admin/products">
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
          <button
            type="submit"
            form="product-form"
            className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 ${
              submitting ? 'cursor-not-allowed' : ''
            }`}
            disabled={submitting || success}
          >
            {submitting ? (
              <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />Saving...</>
            ) : success ? (
              <><Check className="-ml-1 mr-2 h-4 w-4 inline" />Saved!</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </PageHeader>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md">
        <ProductForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          categories={categories}
          submitting={submitting}
          previewImage={previewImage}
          handleImageChange={handleImageChange}
          handleArrayField={handleArrayField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />
      </div>

      <DeleteConfirmationModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        submitting={submitting}
      />
    </div>
  );
}
