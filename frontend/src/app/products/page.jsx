"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { productAPI } from "@/services/apiClient";
import ProductQuickView from "@/components/ProductQuickView";
import { motion } from "framer-motion";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Handle opening quick view modal
  const handleQuickView = product => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Open Quick View modal with selected product

  useEffect(
    () => {
      const categoryParam = searchParams.get("category") || "";
      setCategory(categoryParam);

      async function fetchData() {
        try {
          setLoading(true);

          // Fetch categories first
          let categoriesData = [];
          try {
            const catResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/categories/`
            );
            const catData = await catResponse.json();

            if (catData && Array.isArray(catData)) {
              categoriesData = catData;
            } else if (
              catData &&
              catData.results &&
              Array.isArray(catData.results)
            ) {
              categoriesData = catData.results;
            }

            setCategories(categoriesData);
          } catch (catError) {
            console.error("Error fetching categories:", catError);
          }

          // Then fetch products based on category
          let productsData = [];
          try {
            let apiUrl = "";
            if (categoryParam) {
              // Get products by category
              apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/products/by_category/?category=${categoryParam}`;
            } else {
              // Get all products
              apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/products/`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            // Handle paginated response
            if (data && data.results && Array.isArray(data.results)) {
              productsData = data.results;
            } else if (data && Array.isArray(data)) {
              productsData = data;
            } else {
              console.error("Unexpected API response format:", data);
            }

            setProducts(productsData);
          } catch (prodError) {
            console.error("Error fetching products:", prodError);
            // If API fails, use mock data from the API client
            try {
              const mockProducts = await productAPI.getProducts();
              if (categoryParam) {
                // Filter mock products by category
                productsData = mockProducts.filter(
                  p => p.category_slug === categoryParam
                );
              } else {
                productsData = mockProducts;
              }

              setProducts(productsData);
            } catch (mockError) {
              console.error("Even mock data failed:", mockError);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    },
    [searchParams]
  );

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const applyPriceFilter = () => {
    // This would normally filter products based on price range
    console.log("Filtering by price:", priceRange);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filters Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={toggleMobileFilters}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-2 px-4 rounded-md">
          <Filter size={18} />
          <span>Filters</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${mobileFiltersOpen
              ? "rotate-180"
              : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Sidebar / Filters */}
        <motion.div
          className={`w-full md:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors ${mobileFiltersOpen
            ? "block"
            : "hidden md:block"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Filters</h2>
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />
              {mobileFiltersOpen &&
                <button
                  onClick={toggleMobileFilters}
                  className="md:hidden text-gray-500 dark:text-gray-400">
                  <X size={20} />
                </button>}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 dark:text-white">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`block px-2 py-1 rounded transition-colors ${!category
                    ? "bg-secondary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}>
                  All Products
                </Link>
              </li>
              {categories.map(cat =>
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block px-2 py-1 rounded transition-colors ${category ===
                    cat.slug
                      ? "bg-secondary text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}>
                    {cat.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 dark:text-white">
              Price Range
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                value={priceRange.min}
                onChange={e =>
                  setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <span className="dark:text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                value={priceRange.max}
                onChange={e =>
                  setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
            <button
              className="mt-2 w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded transition-colors"
              onClick={applyPriceFilter}>
              Apply
            </button>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-md font-medium mb-3 dark:text-white">
              Availability
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="rounded text-secondary"
                  checked={availability.inStock}
                  onChange={() =>
                    setAvailability({
                      ...availability,
                      inStock: !availability.inStock
                    })}
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-2 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="rounded text-secondary"
                  checked={availability.outOfStock}
                  onChange={() =>
                    setAvailability({
                      ...availability,
                      outOfStock: !availability.outOfStock
                    })}
                />
                <span>Out of Stock</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">
              {category
                ? `${category
                    .split("-")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}`
                : "All Products"}
            </h1>
            <div className="text-gray-500 dark:text-gray-400">
              {products.length} {products.length === 1
                ? "product"
                : "products"}{" "}
              found
            </div>
          </div>

          {/* فلترة المنتجات بناءً على السعر والتوفر */}
          {(() => {
            const min = priceRange.min ? parseFloat(priceRange.min) : 0;
            const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
            const filteredProducts = products.filter(product => {
              const price = parseFloat(product.price);
              if (price < min || price > max) return false;
              if (availability.inStock && product.stock <= 0) return false;
              if (availability.outOfStock && product.stock > 0) return false;
              return true;
            });

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: 6 }).map((_, index) =>
                      <div
                        key={index}
                        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-80 animate-pulse">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    )
                  : filteredProducts.length > 0
                    ? filteredProducts.map(product => {
                        const productData = {
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          description: product.description,
                          is_active: product.is_active,
                          images: product.images,
                          stock: product.stock,
                          category_name: product.category_name || "",
                          sizes: product.sizes || [],
                          colors: product.colors || []
                        };
                        return (
                          <ProductCard
                            key={product.id}
                            product={productData}
                            onQuickView={handleQuickView}
                          />
                        );
                      })
                    : <div className="col-span-full text-center py-10">
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                          No products found. Try adjusting your filters.
                        </p>
                      </div>}
              </div>
            );
          })()}

          {/* Empty State */}
          {!loading &&
            products.length === 0 &&
            <div className="text-center py-12">
              <Filter
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search criteria.
              </p>
            </div>}
        </div>
      </div>

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </div>
  );
}
