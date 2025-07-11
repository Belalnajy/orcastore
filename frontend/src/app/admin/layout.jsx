'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Tag,
  Moon,
  Sun
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Protected route wrapper component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Skip redirect for login page
    if (pathname === '/admin/login') return;
    
    if (!loading && !isAuthenticated()) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router, pathname]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary dark:border-secondary"></div>
      </div>
    );
  }
  
  // If on login page or authenticated, render children
  if (pathname === '/admin/login' || isAuthenticated()) {
    return children;
  }
  
  // Otherwise, render nothing while redirecting
  return null;
}

// Admin sidebar and layout
function AdminDashboard({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  
  // Check for dark mode preference on mount
  useEffect(() => {
    // Check if user has a saved preference
    const savedDarkMode = localStorage.getItem('admin_dark_mode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('admin_dark_mode', darkMode);
  }, [darkMode]);
  
  // If on login page, just render children without the admin layout
  if (pathname === '/admin/login') {
    return children;
  }
  
  const isActive = (path) => {
    return pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className=" bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors duration-200">
        <Link href="/admin/dashboard" className="text-xl font-bold text-secondary">Dashboard</Link>
        <div className="flex items-center">
          <button 
            onClick={toggleDarkMode}
            className="p-2 mr-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative mr-2">
            <button 
              onClick={toggleDropdown}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="mr-1">{user?.name || 'Admin'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 transition-colors duration-200">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white dark:bg-gray-800 shadow-md fixed inset-y-0 left-0 z-30 md:z-0 md:mt-0 overflow-y-auto transition-colors duration-200`}>
          <div className="p-6 flex justify-between items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold text-secondary">Dashboard</Link>
            <button 
              onClick={toggleDarkMode}
              className="hidden md:block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <nav className="mt-6">
            <div className="px-4 py-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-200">Main</p>
              <div className="mt-2 space-y-1">
                <Link 
                  href="/admin/dashboard" 
                  className={`block px-4 py-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-secondary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    Dashboard
                  </div>
                </Link>
                <Link 
                  href="/admin/products" 
                  className={`block px-4 py-2 rounded-md ${isActive('/admin/products') ? 'bg-secondary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    Products
                  </div>
                </Link>
                <Link 
                  href="/admin/orders" 
                  className={`block px-4 py-2 rounded-md ${isActive('/admin/orders') ? 'bg-secondary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-3" />
                    Orders
                  </div>
                </Link>
                <Link 
                  href="/admin/categories" 
                  className={`block px-4 py-2 rounded-md ${isActive('/admin/categories') ? 'bg-secondary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-3" />
                    Categories
                  </div>
                </Link>
                {/* <Link 
                  href="/admin/customers" 
                  className={`block px-4 py-2 rounded-md ${isActive('/admin/customers') ? 'bg-secondary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    Customers
                  </div>
                </Link> */}
              </div>
            </div>
            <div className="px-4 py-2 mt-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-200">Settings</p>
              <div className="mt-2 space-y-1">
                <Link 
                  href="/admin/settings" 
                  className={`block px-4 py-2 rounded-md ${isActive('/admin/settings') ? 'bg-secondary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-6 transition-colors duration-200">
          {/* User dropdown (desktop) */}
          <div className="hidden md:block">
            <div className="flex justify-end">
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                >
                  <span className="mr-1">{user?.name || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 transition-colors duration-200">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}

// Main layout component that wraps everything with AuthProvider
export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminDashboard>
          {children}
        </AdminDashboard>
      </ProtectedRoute>
    </AuthProvider>
  );
}
