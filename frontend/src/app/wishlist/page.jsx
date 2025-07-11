"use client";

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, ImageIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (isAddingToCart) return;
    addToCart(product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen">
        <div className="text-center py-16">
          <div className="mb-6">
            <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Your wishlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">You have not added any products to your wishlist yet.</p>
          <button 
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-secondary text-white font-medium rounded hover:bg-secondary/90 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Wishlist</h1>
        <button 
          onClick={clearWishlist}
          className="flex items-center text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/products/${product.slug || product.id}`}>
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {imageErrors[product.id] ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <ImageIcon size={48} className="text-gray-400 dark:text-gray-500" />
                  </div>
                ) : (
                  <Image
                    src={product.image || "/images/product-placeholder.jpg"}
                    alt={product.name}
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    fill
                    onError={() => handleImageError(product.id)}
                  />
                )}
                
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-md">
                    {product.discount}% discount
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.slug || product.id}`}>
                <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors dark:text-white">
                  {product.name}
                </h3>
              </Link>
              <div className="flex justify-between items-center mb-3">
                <p className="font-bold text-lg text-secondary dark:text-secondary">
                  {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)} EGP
                </p>
                {product.original_price && (
                  <p className="text-gray-500 dark:text-gray-400 line-through text-sm">
                    {typeof product.original_price === 'number' ? product.original_price.toFixed(2) : parseFloat(product.original_price).toFixed(2)} EGP
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isAddingToCart || !product.stock || product.stock <= 0}
                  className={`flex-1 py-2 rounded flex items-center justify-center transition-colors ${
                    isAddingToCart || !product.stock || product.stock <= 0
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-accent text-white hover:bg-accent/90"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
