"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { WishlistProvider } from "../contexts/WishlistContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  // إخفاء الهيدر في صفحات الأدمن
  const hideHeader = pathname.startsWith("/admin");
  
  // Track client-side route changes as PageView events
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      try {
        window.fbq("track", "PageView");
      } catch (_) {}
    }
  }, [pathname]);

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/orca-icon.png?v=1" sizes="any" />
        <link rel="apple-touch-icon" href="/orca-icon.png?v=1" />
        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '24440721158921753');
fbq('track', 'PageView');`
          }}
        />
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Meta Pixel NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=24440721158921753&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#333",
                    color: "#fff"
                  }
                }}
              />
              {!hideHeader && <Header />}
              <main className="flex-grow">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
