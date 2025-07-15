import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white pt-12 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">BRAND</h3>
            <p className="text-gray-400 dark:text-gray-300 text-base mb-4">
              Premium clothing for the modern lifestyle. Quality materials,
              timeless designs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61577698240978"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/theorca.1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@o.r.c.a03"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>{" "}
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 dark:text-gray-300 hover:text-white text-base transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=mens-t-shirts"
                  className="text-gray-400 dark:text-gray-300 hover:text-white text-base transition-colors">
                  T-shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=sweatpants"
                  className="text-gray-400 dark:text-gray-300 hover:text-white text-base transition-colors">
                  Sweatpants
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <address className="not-italic text-gray-400 dark:text-gray-300 text-base">
              <div className="flex items-center mb-2">
                <MapPin
                  size={16}
                  className="mr-2 text-gray-500 dark:text-gray-400"
                />
                <div>
                  <p>Alexandria, Egypt</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <Mail
                  size={16}
                  className="mr-2 text-gray-500 dark:text-gray-400"
                />
                <p>theorca10@gmail.com</p>
              </div>
              <div className="flex items-center">
                <Phone
                  size={16}
                  className="mr-2 text-gray-500 dark:text-gray-400"
                />
                <p>+01091906949</p>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-base">
            &copy; {new Date().getFullYear()} Orca. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
