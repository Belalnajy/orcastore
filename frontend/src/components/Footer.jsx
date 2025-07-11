import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white pt-12 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">BRAND</h3>
            <p className="text-gray-400 dark:text-gray-300 text-sm mb-4">
              Premium clothing for the modern lifestyle. Quality materials, timeless designs.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=kids" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h3>
            <address className="not-italic text-gray-400 dark:text-gray-300 text-sm">
              <div className="flex items-center mb-2">
                <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                <div>
                  <p>123 Fashion Street</p>
                  <p>Cairo, Egypt</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <Mail size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                <p>info@brand.com</p>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                <p>+20 123 456 7890</p>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} BRAND. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link>
            <Link href="/returns" className="hover:text-white transition-colors">Returns</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
