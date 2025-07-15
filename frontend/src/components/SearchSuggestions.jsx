import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function SearchSuggestions({ query, onSelect }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setShow(false);
      return;
    }
    setLoading(true);
    fetch(`/search-products?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.slice(0, 8));
        setShow(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShow(false);
      }
    }
    if (show) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [show]);

  if (!show || !query || results.length === 0) return null;

  return (
    <div ref={containerRef} className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
      {loading && (
        <div className="px-4 py-2 text-gray-500 dark:text-gray-300 text-sm">Loading...</div>
      )}
      {results.map(product => (
        <button
          key={product.id}
          className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
          onClick={() => onSelect(product)}
        >
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="h-8 w-8 rounded object-cover mr-3 border border-gray-200 dark:border-gray-700"
          />
          <span className="text-gray-900 dark:text-gray-100 text-sm line-clamp-1">{product.name}</span>
        </button>
      ))}
      {!loading && results.length === 0 && (
        <div className="px-4 py-2 text-gray-500 dark:text-gray-300 text-sm">No results found</div>
      )}
    </div>
  );
}
