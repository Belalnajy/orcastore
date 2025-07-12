"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  ShoppingCart
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { productAPI } from "@/services/apiClient";
import ProductImage from "@/components/ProductImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Get product by slug using the API client
async function getProductBySlug(slug) {
  return productAPI.getProductBySlug(slug);
}

// Get related products using the API client
async function getRelatedProducts(category, currentProductId) {
  return productAPI.getRelatedProducts(category, currentProductId);
}

export default function ProductPage({ params }) {
  // Use React.use to unwrap params Promise in Next.js 14
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Fetch product data
  useEffect(
    () => {
      const fetchProductData = async () => {
        try {
          const productData = await getProductBySlug(slug);
          setProduct(productData);

          if (productData) {
            // Use category_slug for fetching related products
            const categorySlug = productData.category_slug;
            // console.log(
            //   "Fetching related products for category:",
            //   categorySlug
            // );

            if (categorySlug) {
              const related = await getRelatedProducts(
                categorySlug,
                productData.id
              );
              setRelatedProducts(related);
            } else {
              console.warn("No category_slug available for related products");
            }

            // Set default selections
            if (productData.sizes && productData.sizes.length > 0) {
              setSelectedSize(productData.sizes[0]);
            }

            if (productData.colors && productData.colors.length > 0) {
              setSelectedColor(productData.colors[0]);
            }
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductData();
    },
    [slug]
  );

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });

    // Show success message or notification here
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link
          href="/products"
          className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  const getImageUrl = src =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/products"
          className="flex items-center text-secondary hover:underline">
          <ChevronLeft size={16} />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative h-[500px] md:h-[700px] w-auto  ">
          {Array.isArray(product.images) && product.images.length > 0
            ? <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true }}
                navigation
                spaceBetween={10}
                slidesPerView={1}
                className="h-full rounded-lg bg-white dark:bg-gray-900"
                style={{ height: "100%" }}>
                {console.log(product.images)}
                {product.images.map((img, idx) =>
                  <SwiperSlide
                    key={idx}
                    className="flex justify-center items-center cursor-pointer"
                    onClick={() => {
                      setIndex(idx);
                      setOpen(true);
                    }}>
                    <ProductImage
                      src={img}
                      alt={product.name + " image " + (idx + 1)}
                      className="   rounded-lg bg-white dark:bg-gray-900"
                    />
                  </SwiperSlide>
                )}
              </Swiper>
            : <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true }}
                navigation
                slidesPerView={1}
                className="h-full rounded-lg bg-white dark:bg-gray-900"
                style={{ height: "100%" }}>
                <SwiperSlide className="flex justify-center items-center">
                  <ProductImage
                    src="/images/product-placeholder.jpg"
                    alt={product.name}
                    className="h-[480px] w-full object-contain rounded-lg bg-white dark:bg-gray-900"
                  />
                </SwiperSlide>
              </Swiper>}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <Link
              href={`/products?category=${product.category}`}
              className="text-gray-500 dark:text-gray-400 hover:text-secondary">
              {product.category_name}
            </Link>
            <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) =>
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              )}
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold text-secondary mb-6">
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : parseFloat(product.price).toFixed(2)}{" "}
            EGP
          </div>

          <p className="text-gray-700 text-lg dark:text-gray-300 mb-6">
            {product.description} Crafted from the finest cotton for superior
            comfort and a stylish look. The perfect design for any occasion.
          </p>

          {/* Features */}
          <div className="mb-6 ">
            <h3 className="font-semibold mb-2 dark:text-white">Features:</h3>
            <ul
              className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300   "
              style={{ listStyleType: "none" }}>
              {product.features.map((feature, index) =>
                <li key={index}>
                  {feature}
                </li>
              )}
            </ul>
          </div>

          {/* Size Selection */}
          {product.sizes &&
            product.sizes.length > 0 &&
            <div className="mb-6">
              <h3 className="font-semibold mb-2 dark:text-white">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size =>
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${selectedSize ===
                    size
                      ? "border-secondary bg-secondary/10 text-secondary dark:bg-secondary/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-secondary dark:text-gray-300"}`}
                    onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                )}
              </div>
            </div>}

          {/* Color Selection */}
          {product.colors &&
            product.colors.length > 0 &&
            <div className="mb-6">
              <h3 className="font-semibold mb-2 dark:text-white">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color =>
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor ===
                    color
                      ? "border-secondary"
                      : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                )}
              </div>
            </div>}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 dark:text-white">Quantity:</h3>
            <div className="flex items-center ">
              <button
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md p-2 transition-colors"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}>
                <Minus size={16} />
              </button>
              <span className="bg-gray-100 dark:bg-gray-800 px-6 py-2 text-center text-gray-900 dark:text-white border-t border-b border-gray-200 dark:border-gray-700">
                {quantity}
              </span>
              <button
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md p-2 transition-colors"
                onClick={increaseQuantity}
                disabled={product.stock <= quantity}>
                <Plus size={16} />
              </button>
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {product.stock} items available
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col md:flex-col lg:flex-col xl:flex-row gap-1 mb-6">
            <button
              className="flex-1 bg-secondary text-white py-3 px-6 rounded-md font-semibold md:text-md flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors"
              onClick={handleAddToCart}
              disabled={product.stock === 0}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={() => {
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id);
                } else {
                  addToWishlist(product);
                }
              }}
              className={`flex items-center justify-center gap-2 border ${isInWishlist(
                product.id
              )
                ? "border-secondary text-secondary"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"} rounded-md py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
              <Heart
                size={20}
                fill={isInWishlist(product.id) ? "currentColor" : "none"}
              />
              <span className="hidden sm:inline">
                {isInWishlist(product.id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
              <Share2 size={20} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Stock Status */}
          <div
            className={`text-sm ${product.stock > 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={product.images.map(img => ({ src: getImageUrl(img) }))}
        index={index}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 &&
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct =>
              <div
                key={relatedProduct.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <ProductImage
                    src={
                      relatedProduct.image || "/images/product-placeholder.jpg"
                    }
                    alt={relatedProduct.name}
                  />
                </div>
                <div className="p-4">
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <h3 className="text-lg font-semibold text-primary dark:text-white truncate">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    {relatedProduct.category_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-secondary">
                      ${typeof relatedProduct.price === "number"
                        ? relatedProduct.price.toFixed(2)
                        : parseFloat(relatedProduct.price).toFixed(2)}
                    </span>
                    {relatedProduct.stock > 0
                      ? <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full">
                          In Stock
                        </span>
                      : <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full">
                          Out of Stock
                        </span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>}
    </div>
  );
}
