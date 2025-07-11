import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { WishlistProvider } from "../contexts/WishlistContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata = {
  title: "BRAND - Premium Clothing Store",
  description:
    "Premium clothing for the modern lifestyle. Quality materials, timeless designs."
};

import RootLayoutClient from "./layout-client";

export default function RootLayout(props) {
  return <RootLayoutClient {...props} />;
}
