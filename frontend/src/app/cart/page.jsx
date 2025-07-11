"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
    isLoading
  } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center dark:text-white">
        <div className="max-w-md mx-auto">
          <ShoppingBag
            size={64}
            className="mx-auto text-gray-400 dark:text-gray-500 mb-6"
          />
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors inline-flex items-center gap-2">
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const taxRate = 0.1;
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 dark:bg-gray-700 p-4 font-medium text-gray-600 dark:text-gray-300">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map(item =>
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-center">
                  <div className="md:col-span-2 flex items-center gap-4">
                    <div className="relative bg-gray-200 dark:bg-gray-600 rounded w-20 h-20 overflow-hidden">
                      <ProductImage
                        src={item.product.images[1]}
                        alt={item.product.name}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">
                        {item.product.name}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.size &&
                          <span className="mr-2">
                            Size: {item.size}
                          </span>}
                        {item.color &&
                          <span className="flex items-center">
                            Color:
                            <span
                              className="inline-block w-3 h-3 rounded-full ml-1 mr-1"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.color}
                          </span>}
                      </div>
                    </div>
                  </div>

                  <div className="md:text-center dark:text-white">
                    <div className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                      Price:
                    </div>
                    {parseFloat(item.product.price).toFixed(2)} EGP
                  </div>

                  <div>
                    <div className="md:hidden text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Quantity:
                    </div>
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-l-md p-1 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        onClick={() =>
                          updateCartItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}>
                        <Minus size={16} />
                      </button>
                      <span className="bg-gray-100 dark:bg-gray-700 px-4 py-1 text-center dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r-md p-1 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        onClick={() =>
                          updateCartItemQuantity(item.id, item.quantity + 1)}
                        disabled={item.product.stock <= item.quantity}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                        Total:
                      </div>
                      <div className="font-medium dark:text-white">
                        {(parseFloat(item.product.price) *
                          item.quantity).toFixed(2)}{" "}
                        EGP
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/products"
              className="text-secondary dark:text-secondary hover:underline inline-flex items-center gap-1">
              <ArrowRight size={16} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between dark:text-white">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span>
                  {cartTotal.toFixed(2)} EGP
                </span>
              </div>
              <div className="flex justify-between dark:text-white">
                <span className="text-gray-600 dark:text-gray-300">
                  Shipping
                </span>
                <span>
                  {shippingCost === 0
                    ? <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    : `${shippingCost.toFixed(2)} EGP`}
                </span>
              </div>
              {/* <div className="flex justify-between dark:text-white">
                <span className="text-gray-600 dark:text-gray-300">
                  Tax (10%)
                </span>
                <span>
                  {taxAmount.toFixed(2)} EGP
                </span>
              </div> */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
              <div className="flex justify-between font-bold text-lg dark:text-white">
                <span>Order Total</span>
                <span>
                  {orderTotal.toFixed(2)} EGP
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
