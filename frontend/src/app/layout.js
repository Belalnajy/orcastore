import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata = {
  title: "ORCA - Premium Clothing Store",
  description:
    "Premium clothing for the modern lifestyle. Quality materials, timeless designs.",
};

import RootLayoutClient from "./layout-client";

export default function RootLayout(props) {
  return <RootLayoutClient {...props} />;
}
