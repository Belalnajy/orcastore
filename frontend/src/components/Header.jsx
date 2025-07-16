'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import ThemeToggle from './ui/ThemeToggle';
import SearchSuggestions from './SearchSuggestions';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    if (router) router.push(`/products?search=${encodeURIComponent(searchValue)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (product) => {
    setSearchValue("");
    setShowSuggestions(false);
    if (router) router.push(`/products/${product.slug}`);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, cartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const cartUniqueCount = cartItems.length;
  const wishlistItemCount = getWishlistCount ? getWishlistCount() : 0;
  const cartItemCount = cartUniqueCount;
  const pathname = usePathname();

  const promoMessages = [
    'Orca Store | Make waves with your look',
    'Free shipping on all orders',
    'All orders are insured',
    'New arrivals are here! Check them out.',
  ];
  const [currentPromo, setCurrentPromo] = useState(0);

  useEffect(() => {
    const promoInterval = setInterval(() => {
      setCurrentPromo(prev => (prev + 1) % promoMessages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(promoInterval);
  }, [promoMessages.length]);
  
  return (
    <>
      {/* Promo Bar */}
      <div className="bg-secondary text-white py-2 text-center text-sm z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <p className="transition-all duration-300">
            {promoMessages[currentPromo]}
          </p>
        </div>
      </div>
      
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors py-2">
        <div className="max-w-screen-xl mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-secondary">ORCA </span><span>STORE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`text-base transition-colors ${pathname === '/' ? 'text-secondary font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                Home
              </Link>
              <Link href="/products" className={`text-base transition-colors ${pathname === '/products' ? 'text-secondary font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                Products
              </Link>
              {/* <Link href="/about" className="text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </Link> */}
              <Link href="/contact" className={`text-base transition-colors ${pathname === '/contact' ? 'text-secondary font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                Contact
              </Link>
              <Link href="/my-orders" className={`text-base transition-colors ${pathname === '/my-orders' ? 'text-secondary font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                Orders
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center relative">
                <div className="w-full relative">
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchValue}
                    onChange={e => {
                      setSearchValue(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    className="py-1 px-3 pr-8 text-base border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-secondary w-40 lg:w-56"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleSearch}
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  {showSuggestions && (
                    <SearchSuggestions query={searchValue} onSelect={handleSuggestionSelect} />
                  )}
                </div>
              </div>
              
              <ThemeToggle />
              
              <Link href="/cart" className={`p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative transition-colors ${pathname === '/cart' ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>

                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className={`p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative transition-colors ${pathname === '/wishlist' ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>

                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              {/* Burger button for mobile */}
              <button
                className="md:hidden text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="py-2 px-3 pr-8 text-base border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-secondary w-full"
              />
              <Search className="absolute right-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {/* <Link
                href="/about"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link> */}
              <Link
                href="/contact"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/my-orders"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
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
