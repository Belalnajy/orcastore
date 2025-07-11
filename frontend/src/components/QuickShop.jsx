"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function QuickShop({ product, onQuickView }) {
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  // determine quantity of this product (same id) in cart
  const cartQty = cartItems.filter(
    (i) => i.product.id === product.id
  ).reduce((sum, i) => sum + i.quantity, 0);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.sizes?.length > 0) || (product.colors?.length > 0)) {
      router.push(`/products/${product.slug}`);
    } else {
      addToCart(product);
    }
  };
  
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };
  
  return (
    <div 
      className="absolute inset-0 z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3 flex justify-center space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock <= 0 || cartQty >= product.stock}
              className={`p-2 rounded-full ${
                product.stock > 0 
                  ? "bg-accent hover:bg-accent/90" 
                  : "bg-gray-400 cursor-not-allowed"
              } text-white transition-colors`}
              title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            >
              <ShoppingCart size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white hover:bg-gray-100 text-primary transition-colors"
              title="Add to Wishlist"
            >
              <Heart size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/90 text-white transition-colors"
              title="Quick View"
            >
              <Eye size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
