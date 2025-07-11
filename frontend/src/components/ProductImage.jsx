"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export default function ProductImage({ src, alt, className = "" }) {
  const [imageError, setImageError] = useState(false);

  // Process image URL
  const processedSrc = (() => {
    if (!src) return "/images/product-placeholder.jpg";

    // Absolute URL (already complete)
    if (src.startsWith("http")) return src;

    // Starts with a slash => treat as already absolute path from public folder or external
    if (src.startsWith("/")) return src;

    // Fallback – assume relative filename coming from backend, prefix with API base + /uploads
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return src.startsWith("uploads/")
      ? `${apiBase}/${src}`
      : `${apiBase}/uploads/${src}`;
  })();

  if (imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
        <ImageIcon size={48} className="text-gray-400" />
        <span className="sr-only">
          {alt}
        </span>
      </div>
    );
  }

  // Check if className contains object-fit or height/width
  const hasObjectFit = /object-(cover|contain|fill|none|scale-down)/.test(className);
  const hasHeight = /h-\[?\d/.test(className);
  const hasWidth = /w-\[?\d/.test(className);

  return (
    <Image
      src={processedSrc}
      alt={alt}
      className={
        `${hasObjectFit ? '' : 'object-cover'} ${hasHeight ? '' : 'h-[500px]'} ${hasWidth ? '' : 'w-[500px]'} ${className}`.trim()
      }
      fill
      onError={() => setImageError(true)}
    />
  );
}
