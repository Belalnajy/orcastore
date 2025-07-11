"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Create context
const WishlistContext = createContext();

// Custom hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // Initialize state from localStorage (if available)
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  // Add item to wishlist - using useCallback to prevent recreation on each render
  const addToWishlist = useCallback((product) => {
    // Prevent multiple rapid clicks
    if (isAddingToWishlist) return;
    
    setIsAddingToWishlist(true);
    
    // Check if item already exists in wishlist
    if (wishlistItems.some(item => item.id === product.id)) {
      toast.error('Product already in wishlist');
      setIsAddingToWishlist(false);
      return;
    }
    
    // Make sure we have all the necessary product data
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug || `product-${product.id}`, // Ensure we have a slug for routing
      stock: product.stock || 100,
    };
    
    setWishlistItems(prevItems => [...prevItems, productToAdd]);
    toast.success('Product added to wishlist');
    
    // Reset the adding flag after a delay
    setTimeout(() => {
      setIsAddingToWishlist(false);
    }, 500);
  }, [isAddingToWishlist, wishlistItems]);

  // Remove item from wishlist - using useCallback
  const removeFromWishlist = useCallback((productId) => {
    let shouldShowToast = false;
    
    setWishlistItems((prevItems) => {
      const newItems = prevItems.filter(item => item.id !== productId);
      if (newItems.length < prevItems.length) {
        shouldShowToast = true;
      }
      return newItems;
    });
    
    // Show toast outside of the state update function
    if (shouldShowToast) {
      setTimeout(() => {
        toast.success('Product removed from wishlist');
      }, 0);
    }
  }, []);

  // Check if an item is in the wishlist - using useCallback
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  // Clear the entire wishlist - using useCallback
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  }, []);

  // Get wishlist count - using useCallback
  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  // Context value
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    isAddingToWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
