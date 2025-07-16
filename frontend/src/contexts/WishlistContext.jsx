"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Create context
const WishlistContext = createContext();

// Custom hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // Initialize state from localStorage (if available)
  // We only store product ids in wishlist
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        setWishlistIds(JSON.parse(storedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        setWishlistIds([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isLoaded]);

  // Add product id to wishlist
  const addToWishlist = useCallback((product) => {
    if (isAddingToWishlist) return;
    setIsAddingToWishlist(true);

    if (wishlistIds.includes(product.id)) {
      toast.error('Product already in wishlist');
      setIsAddingToWishlist(false);
      return;
    }
    setWishlistIds(prev => [...prev, product.id]);
    toast.success('Product added to wishlist');
    setIsAddingToWishlist(false);
  }, [wishlistIds, isAddingToWishlist]);

  // Remove product id from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
    toast.success('Product removed from wishlist');
  }, []);

  // Check if product id is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  // Clear the entire wishlist - using useCallback
  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    toast.success('Wishlist cleared');
  }, []);

  // Get wishlist count - using useCallback
  const getWishlistCount = useCallback(() => {
    return wishlistIds.length;
  }, [wishlistIds]);

  // Context value
  const value = {
    wishlistIds,
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
