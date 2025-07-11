"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { productAPI, categoryAPI, getImageUrl } from "@/services/apiClient";
import ProductImage from "@/components/ProductImage";
import { ShoppingCart, ArrowRight, Star, ChevronRight } from "lucide-react";
import QuickShop from "@/components/QuickShop";
import ProductQuickView from "@/components/ProductQuickView";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesData = await categoryAPI.getCategories();
        const productsData = await productAPI.getProducts({});

        // Sort products by date to get new arrivals (assuming products have a created_at field)
        const sortedProducts = [...productsData].sort(
          (a, b) =>
            new Date(b.created_at || b.id) - new Date(a.created_at || a.id)
        );

        setCategories(categoriesData);
        setProducts(productsData);
        setNewArrivals(sortedProducts.slice(0, 8));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      image: `https://ui-avatars.com/api/?name=Sarah+Johnson&background=random`,
      content:
        "The quality of the clothing is exceptional. I've been shopping here for years and have never been disappointed.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Loyal Customer",
      image: `https://ui-avatars.com/api/?name=Michael+Chen&background=random`,
      content:
        "Fast shipping, great customer service, and stylish products. What more could you ask for?",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Style Blogger",
      image: `https://ui-avatars.com/api/?name=Emma+Rodriguez&background=random`,
      content:
        "I love the curated collections and attention to detail. This is my go-to store for statement pieces.",
      rating: 4
    }
  ];

  // Featured Brands data
  const brands = [
    {
      id: 1,
      name: "Elegance",
      logo: `https://ui-avatars.com/api/?name=Elegance&size=200&background=random`,
      description: "Luxury fashion for the modern woman"
    },
    {
      id: 2,
      name: "Urban Style",
      logo: `https://ui-avatars.com/api/?name=Urban+Style&size=200&background=random`,
      description: "Street fashion with attitude"
    },
    {
      id: 3,
      name: "Gentleman",
      logo: `https://ui-avatars.com/api/?name=Gentleman&size=200&background=random`,
      description: "Classic menswear with a contemporary twist"
    },
    {
      id: 4,
      name: "Active Life",
      logo: `https://ui-avatars.com/api/?name=Active+Life&size=200&background=random`,
      description: "Performance wear for active lifestyles"
    },
    {
      id: 5,
      name: "Kids World",
      logo: `https://ui-avatars.com/api/?name=Kids+World&size=200&background=random`,
      description: "Fun and practical clothing for children"
    }
  ];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Summer Fashion Trends 2025",
      excerpt: "Discover the hottest styles for the upcoming summer season.",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop",
      date: "May 2, 2025",
      author: "Emma Rodriguez"
    },
    {
      id: 2,
      title: "Sustainable Fashion: A Guide",
      excerpt:
        "How to build an eco-friendly wardrobe without sacrificing style.",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop",
      date: "April 28, 2025",
      author: "Michael Chen"
    },
    {
      id: 3,
      title: "Accessorizing 101",
      excerpt: "Master the art of accessorizing to elevate any outfit.",
      image:
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&h=400&fit=crop",
      date: "April 15, 2025",
      author: "Sarah Johnson"
    }
  ];

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className=" mx-auto">
        {/* max-w-screen-xl */}
        <main>
          {/* Hero Section */}
          <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/26965986/pexels-photo-26965986.jpeg"
                alt="Fashion Collection"
                style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Elevate Your Style with Premium Fashion
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
                  Discover our latest collection of high-quality clothing
                  designed for the modern lifestyle.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/products"
                    className="inline-flex items-center px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-opacity-90 transition-all duration-300">
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Featured Categories Section */}
          <section className="py-16 px-6 md:px-8">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                  Shop by Category
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Browse our curated collections designed for every occasion and
                  style preference
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group block relative overflow-hidden rounded-xl shadow-md h-64">
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 z-10"></div>
                      <div className="absolute inset-0">
                        <Image
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-center">
                          <h3 className="text-white text-xl font-bold mb-2">
                            {category.name}
                          </h3>
                          <span className="inline-flex items-center text-sm text-white bg-black bg-opacity-30 px-3 py-1 rounded-full">
                            Shop Now <ArrowRight className="ml-1 h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* New Arrivals Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-800 px-6 md:px-8 transition-colors duration-300">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">
                    New Arrivals
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    The latest additions to our collection
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-secondary hover:text-secondary/80 font-medium flex items-center transition-colors">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>

              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 }
                }}
                className="new-arrivals-swiper">
                {newArrivals.map((product) => (
                  <SwiperSlide key={product.id}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-sm overflow-hidden transition-all duration-300 h-full">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block relative">
                        <div className="relative h-60 overflow-hidden bg-gray-100 dark:bg-gray-600">
                          <ProductImage
                            src={getImageUrl(product.images[1])}
                            alt={product.name}
                            className="hover:scale-105 transition-transform duration-500"
                          />
                          {product.is_new && (
                            <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-md">
                              New
                            </span>
                          )}
                          <QuickShop
                            product={product}
                            onQuickView={handleQuickView}
                          />
                        </div>

                        <div className="p-4">
                          <h3 className="text-base font-medium text-primary dark:text-white truncate">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-300 text-xs mb-2">
                            {product.category_name}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-secondary">
                              {typeof product.price === "number"
                                ? product.price.toFixed(2)
                                : parseFloat(product.price).toFixed(2)}{" "}
                              EGP
                            </span>
                            {product.stock > 0 ? (
                              <span className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-sm">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-sm">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

          {/* Best Sellers Section */}
          <section className="py-16 px-6 md:px-8">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">
                    Best Sellers
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our most popular products that customers love
                  </p>
                </div>
                <Link
                  href="/products?sort=popular"
                  className="text-secondary hover:text-secondary/80 font-medium flex items-center transition-colors">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group block">
                      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="absolute top-2 right-2 z-10 bg-accent text-white text-xs px-2 py-1 rounded-md">
                          Best Seller
                        </div>
                        <div className="relative h-60 overflow-hidden">
                          <ProductImage
                            src={getImageUrl(product.images[1])}
                            alt={product.name}
                            className="group-hover:scale-105 transition-transform duration-500"
                          />
                          <QuickShop
                            product={product}
                            onQuickView={handleQuickView}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-medium text-primary dark:text-white truncate">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                            {product.category_name}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-secondary">
                              {typeof product.price === "number"
                                ? product.price.toFixed(2)
                                : parseFloat(product.price).toFixed(2)}{" "}
                              EGP
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < 4
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                (24)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Brands Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-800 px-6 md:px-8 transition-colors duration-300">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                  Featured Brands
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover our curated selection of premium fashion brands
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {brands.map((brand, index) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm text-center hover-scale">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={
                          brand.logo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            brand.name
                          )}&background=random`
                        }
                        alt={brand.name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            brand.name
                          )}&background=random`;
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-primary dark:text-white mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {brand.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Blog Section */}
          {/* <section className="py-16 px-6 md:px-8">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">
                    Fashion Blog
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Style tips, trends, and fashion insights
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="text-secondary hover:text-secondary/80 font-medium flex items-center transition-colors">
                  View All Posts
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          post.image ||
                          `https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&h=400&fit=crop`
                        }
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                      <h3 className="text-lg font-medium text-primary dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-secondary hover:text-secondary/80 text-sm font-medium inline-flex items-center">
                        Read More
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section> */}

          {/* Testimonials Section */}
          {/* <section className="py-16 px-6 md:px-8">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover why our customers love shopping with us
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={
                            testimonial.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              testimonial.name
                            )}&background=random`
                          }
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              testimonial.name
                            )}&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      "{testimonial.content}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section> */}

          {/* Newsletter Section */}
          <section className="py-16 bg-secondary text-white px-6 md:px-8">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}>
                  <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
                  <p className="text-lg mb-8 opacity-90">
                    Subscribe to our newsletter for exclusive offers, new
                    arrivals, and fashion tips.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium transition-colors">
                      Subscribe
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
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
