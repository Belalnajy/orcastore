"use client";

import React from "react";
import ProductImage from "./ProductImage";
import { useCart } from "@/contexts/CartContext";
import { getImageUrl } from "@/services/apiClient";

const ProductDetails = ({ product }) => {
  const { addToCart, isAddingToCart } = useCart();

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleAddToCart = () => {
    if (isAddingToCart) return;
    addToCart({ ...product, quantity: 1 });
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : "/placeholder.png";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="rounded-lg overflow-hidden">
          <ProductImage
            src={imageUrl}
            alt={product.name}
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col h-full">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-primary dark:text-white">
            {product.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {product.category_name}
          </p>

          <p className="text-2xl font-bold text-secondary mb-4">
            {product.price.toFixed(2)} EGP
          </p>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p>
              {product.description}
            </p>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.stock || product.stock <= 0}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
              {isAddingToCart
                ? "Adding..."
                : product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
