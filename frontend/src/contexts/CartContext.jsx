"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const GUEST_CART_KEY = "guest_cart_items";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// --- Guest Cart Handler ---
const guestCartHandler = {
  get: () => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  set: (items) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  },
  add: (product, quantity, size, color) => {
    const items = guestCartHandler.get();
    const idx = items.findIndex(
      (i) => i.product.id === product.id && i.size === size && i.color === color
    );
    if (idx > -1) {
      items[idx].quantity += quantity;
    } else {
      items.push({ id: `guest_${Date.now()}`, product, quantity, size, color });
    }
    guestCartHandler.set(items);
  },
  update: (itemId, quantity) => {
    const items = guestCartHandler.get();
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx > -1) items[idx].quantity = quantity;
    guestCartHandler.set(items);
  },
  remove: (itemId) => {
    const items = guestCartHandler.get().filter((i) => i.id !== itemId);
    guestCartHandler.set(items);
  },
  clear: () => {
    guestCartHandler.set([]);
  },
};

// --- API Cart Handler ---
const apiCartHandler = (authToken) => ({
  get: async () => {
    const res = await fetch(`${API_URL}/cart/my_cart`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },
  add: async (product, quantity, size, color) => {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ productId: product.id, quantity, size, color }),
    });
    if (!res.ok) throw new Error("Failed to add item");
  },
  update: async (itemId, quantity) => {
    const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to update quantity");
  },
  remove: async (itemId) => {
    const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error("Failed to remove item");
  },
  clear: async () => {
    const res = await fetch(`${API_URL}/cart/clear`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error("Failed to clear cart");
  },
  mergeGuest: async (guestItems) => {
    if (!guestItems.length) return;
    const itemsToMerge = guestItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
    await fetch(`${API_URL}/cart/batch_add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ items: itemsToMerge }),
    });
  },
});

// --- Provider ---
export const CartProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount or auth change
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (authToken) {
        // Merge guest cart if needed
        const guestItems = guestCartHandler.get();
        if (guestItems.length) {
          await apiCartHandler(authToken).mergeGuest(guestItems);
          guestCartHandler.clear();
        }
        const data = await apiCartHandler(authToken).get();
        setCartId(data.id);
        setCartItems(data.items || []);
      } else {
        setCartItems(guestCartHandler.get());
        setCartId(null);
      }
    } catch (e) {
      toast.error("Could not load cart.");
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // --- Unified Actions ---
  const perform = async (handlerFn, guestFn, ...args) => {
    setIsLoading(true);
    try {
      if (authToken) {
        await handlerFn(...args);
      } else {
        guestFn(...args);
      }
      await loadCart();
    } catch (e) {
      toast.error("Cart operation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    // Support legacy calls where variant details are inside the product object
    if (!size && product?.selectedSize) size = product.selectedSize;
    if (!color && product?.selectedColor) color = product.selectedColor;

    // Validate that required variant attributes are chosen if the product has options
    if (Array.isArray(product?.sizes) && product.sizes.length > 0 && !size) {
      toast.error("Please select a size first");
      return;
    }
    if (Array.isArray(product?.colors) && product.colors.length > 0 && !color) {
      toast.error("Please select a color first");
      return;
    }
    // Prevent adding more than available stock
    const existingItem = cartItems.find(
      (i) => i.product.id === product.id && i.size === size && i.color === color
    );
    const currentQty = existingItem ? existingItem.quantity : 0;
    if (currentQty + quantity > (product.stock ?? Infinity)) {
      toast.error("Exceeds available stock");
      return;
    }
    await perform(
      (...args) => apiCartHandler(authToken).add(...args),
      guestCartHandler.add,
      product,
      quantity,
      size,
      color
    );
    toast.success("Added to cart");
  };

  const updateCartItemQuantity = (itemId, quantity) =>
    perform(
      (...args) => apiCartHandler(authToken).update(...args),
      guestCartHandler.update,
      itemId,
      quantity
    );

  const removeFromCart = (itemId) =>
    perform(
      (...args) => apiCartHandler(authToken).remove(...args),
      guestCartHandler.remove,
      itemId
    );

  const clearCart = () =>
    perform(
      (...args) => apiCartHandler(authToken).clear(...args),
      guestCartHandler.clear
    );

  // --- Derived State ---
  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0),
    [cartItems]
  );

  // --- Context Value ---
  const value = useMemo(
    () => ({
      cartItems,
      cartId,
      isLoading,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [cartItems, cartId, isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};