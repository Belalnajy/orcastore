'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import ThemeToggle from './ui/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, cartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const cartUniqueCount = cartItems.length;
  const wishlistItemCount = getWishlistCount ? getWishlistCount() : 0;
  const cartItemCount = cartUniqueCount;
  
  return (
    <>
      {/* Promo Bar */}
      <div className="bg-secondary text-white py-2 text-center text-sm z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <p>Free shipping on orders over $50 | Use code: SUMMER25 for 25% off</p>
        </div>
      </div>
      
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors py-2">
        <div className="max-w-screen-xl mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-secondary">ORCA </span><span>STORE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Products
              </Link>
              {/* <Link href="/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </Link> */}
              <Link href="/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/my-orders" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Orders
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="py-1 px-3 pr-8 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-secondary w-40 lg:w-56"
                />
                <Search className="absolute right-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              
              <ThemeToggle />
              
              <Link href="/cart" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative transition-colors">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative transition-colors">
                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              {/* Burger button for mobile */}
              <button
                className="md:hidden text-gray-700 dark:text-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation with smooth transition */}
          <div
            className={`md:hidden  border-t border-gray-100 dark:border-gray-800 pt-3 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-5 pointer-events-none h-0' } z-20`}
            style={{ minHeight: isMenuOpen ? '200px' : '0px' }}
          >
            <div className="flex items-center relative mb-4">
              <input 
                type="text" 
                placeholder="Search" 
                className="py-2 px-3 pr-8 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-secondary w-full"
              />
              <Search className="absolute right-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {/* <Link
                href="/about"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link> */}
              <Link
                href="/contact"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/my-orders"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
