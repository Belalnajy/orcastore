"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ImageIcon, Heart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/contexts/WishlistContext";
import { getImageUrl } from "@/services/apiClient";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, onQuickView }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isAddingToCart } = useCart();
  const router = useRouter();
  const {
    addToWishlist,
    isInWishlist,
    removeFromWishlist,
    isAddingToWishlist
  } = useWishlist();

  const handleQuickView = e => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleWishlistToggle = e => {
    e.preventDefault();
    if (isAddingToWishlist) return;

    if (isInWishlist && isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = e => {
    e.preventDefault();
    // Prevent multiple rapid clicks
    if (isAddingToCart) return;

    addToCart({
      ...product,
      quantity: 1
    });
  };

  // Calculate this value once when the component renders
  const inWishlist = isInWishlist ? isInWishlist(product.id) : false;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {imageError
          ? <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
              <ImageIcon
                size={48}
                className="text-gray-400 dark:text-gray-500"
              />
              <span className="sr-only">
                {product.name}
              </span>
            </div>
          : <ProductImage
              src={getImageUrl(product.images[1])}
              alt={product.name}
              className={`object-cover transition-transform duration-500 ${isHovered
                ? "scale-110"
                : "scale-100"}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered
            ? "opacity-100"
            : "opacity-0"}`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-white dark:bg-gray-800 text-primary dark:text-white rounded-full p-3 transform transition-transform ${isAddingToCart
              ? "opacity-50 cursor-not-allowed"
              : ""}`}
            onClick={() => {
              router.push(`/products/${product.slug}`);
            }}
            disabled={!product.stock || product.stock <= 0 || isAddingToCart}
            title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}>
            <ShoppingCart size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${inWishlist
              ? "bg-red-500 text-white"
              : "bg-white dark:bg-gray-800 text-primary dark:text-white"} 
              rounded-full p-3 transform transition-transform ${isAddingToWishlist
                ? "opacity-50 cursor-not-allowed"
                : ""}`}
            onClick={handleWishlistToggle}
            disabled={isAddingToWishlist}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
            <Heart size={18} className={inWishlist ? "fill-white" : ""} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-secondary text-white rounded-full p-3 transform transition-transform"
            onClick={handleQuickView}
            title="Quick View">
            <Eye size={18} />
          </motion.button>
        </div>

        {product.discount &&
          <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-md">
            {product.discount}% discount
          </div>}
      </div>

      <div className="p-4">
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="text-lg font-semibold text-primary dark:text-white truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {product.category_name}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-secondary">
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : parseFloat(product.price).toFixed(2)}{" "}
              EGP
            </span>
            {product.original_price &&
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through mr-2">
                {typeof product.original_price === "number"
                  ? product.original_price.toFixed(2)
                  : parseFloat(product.original_price).toFixed(2)}{" "}
                EGP
              </span>}
          </div>
          {product.stock > 0
            ? <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full">
                Available
              </span>
            : <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full">
                Unavailable
              </span>}
        </div>
      </div>
    </motion.div>
  );
}
