"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Star, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductImage from "./ProductImage";
import { getImageUrl } from "@/services/apiClient";
import { toast } from "react-hot-toast";

export default function ProductQuickView({ product, isOpen, onClose }) {
  const { addToCart, isAddingToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Reset variant selections when product changes / modal opens
  React.useEffect(() => {
    setSelectedSize(product?.sizes?.[0] || "");
    setSelectedColor(product?.colors?.[0] || "");
    setQuantity(1);
  }, [product, isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (isAddingToCart) return;

    addToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const inWishlist = isInWishlist && isInWishlist(product.id);

  return (
    <AnimatePresence>
      {isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="relative h-72 md:h-full bg-gray-100 dark:bg-gray-800">
                {console.log(product)}
                <ProductImage
                  src={
                    getImageUrl(product.images[1]) ||
                    "/images/product-placeholder.jpg"
                  }
                  alt={product.name}
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {product.category_name}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h2>

                {/* <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) =>
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"}`}
                      />
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (24 ratings)
                  </span>
                </div> */}

                <div className="text-2xl font-bold text-secondary mb-4">
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : parseFloat(product.price).toFixed(2)}{" "}
                  EGP
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  {product.description ||
                    "High-quality product designed for comfort and elegance. Made from premium materials that last long."}
                </p>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</div>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1 rounded-md border text-sm ${selectedSize === sz ? "bg-secondary text-white border-secondary" : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</div>
                    <div className="flex gap-3 flex-wrap items-center">
                      {product.colors.map((col) => (
                        <button
                          key={col}
                          onClick={() => setSelectedColor(col)}
                          className={`w-7 h-7 rounded-full border-2 focus:outline-none ${selectedColor === col ? "border-secondary" : "border-transparent"}`}
                          style={{ backgroundColor: col }}
                          aria-label={col}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`p-2 border border-gray-300 dark:border-gray-700 rounded-l-md ${quantity <=
                      1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                      <Minus size={16} />
                    </button>
                    <div className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-700 text-center min-w-[3rem]">
                      {quantity}
                    </div>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className={`p-2 border border-gray-300 dark:border-gray-700 rounded-r-md ${quantity >=
                      product.stock
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      !product.stock ||
                      product.stock <= 0 ||
                      isAddingToCart ||
                      (product.sizes?.length > 0 && !selectedSize) ||
                      (product.colors?.length > 0 && !selectedColor)
                    }
                    className={`flex-1 py-3 px-6 rounded-md font-medium flex items-center justify-center ${product.stock >
                      0 && !isAddingToCart
                      ? "bg-accent hover:bg-accent/90 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}>
                    <ShoppingCart size={18} className="ml-2" />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 py-3 px-6 border rounded-md font-medium flex items-center justify-center ${inWishlist
                      ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                      : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                    <Heart
                      size={18}
                      className={`ml-2 ${inWishlist ? "fill-white" : ""}`}
                    />
                    {inWishlist ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-secondary hover:text-secondary/80 text-sm font-medium"
                    onClick={onClose}>
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>}
    </AnimatePresence>
  );
}
