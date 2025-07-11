'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { orderAPI, paymentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import ProductImage from '@/components/ProductImage';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { authToken } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Egypt',
    postal_code: '',
    notes: '',
    payment_method: 'card'
  });
  

  // Calculate shipping cost (free over $100)
  const shippingCost = cartTotal >= 100 ? 0 : 10;
  
  // Calculate tax (assume 10%)
  const taxRate = 0.1;
  const taxAmount = cartTotal * taxRate;
  
  // Calculate order total
  const orderTotal = cartTotal + shippingCost;
  
  // This ensures we only render cart content on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Log cart items for debugging
      // console.log('Cart items being submitted:', cartItems);
      
      // Ensure all product IDs are valid numbers or strings
      const validCart = cartItems.filter(item => {
        if (!item.id) {
          console.error(`Item missing ID:`, item);
          return false;
        }
        return true;
      });
      
      if (validCart.length === 0) {
        throw new Error('No valid products in cart');
      }
      
      // Build items payload including variant attributes
      const itemsPayload = validCart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      }));

      // Prepare order data (include items)
      const orderData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country || 'Egypt',
        postal_code: formData.postal_code || '00000',
        notes: formData.notes,
        payment_method: formData.payment_method,
        total_amount: parseFloat(orderTotal).toFixed(2),
        items: itemsPayload,
      };
      
      // console.log('Order data being sent to backend:', orderData);
      
      let orderResponse;
      if (authToken) {
        try {
          orderResponse = await orderAPI.createOrder(orderData, authToken);
        } catch (err) {
          // Fallback to guest if token is invalid/expired (401)
          if (err.message && err.message.toLowerCase().includes('unauthorized')) {
            console.warn('Auth failed, falling back to guest checkout');
            orderResponse = await orderAPI.createGuestOrder(orderData);
          } else {
            throw err;
          }
        }
      } else {
        orderResponse = await orderAPI.createGuestOrder(orderData);
      }
      // console.log('Order creation response:', orderResponse);
      
      // Store order ID in localStorage for reference
      if (orderResponse && orderResponse.id) {
        // keep last order id for backward compatibility
        localStorage.setItem('lastOrderId', orderResponse.orderId);
        // append to guest order ids array
        const existingIds = JSON.parse(localStorage.getItem('guestOrderIds') || '[]');
        if (!existingIds.includes(orderResponse.orderId)) {
          existingIds.push(orderResponse.orderId);
          localStorage.setItem('guestOrderIds', JSON.stringify(existingIds));
        }
      }
      
      // If Cash on Delivery, no payment API call is needed
      if (formData.payment_method === 'cash_on_delivery') {
        clearCart();
        router.push(`/order-confirmation?order_id=${orderResponse.orderId}&id=${orderResponse.id}`);
        return;
      }

      // Initialize online payment with Paymob (card / vodafone)
      const paymentResponse = await paymentAPI.createPayment({
        order_id: orderResponse.orderId,
        payment_method: formData.payment_method
      });
      
      // console.log('Payment response:', paymentResponse);
      
      // Clear cart after successful order creation
      clearCart();

      // Handle different payment methods (online)
      if (formData.payment_method === 'vodafone_cash') {
        // For Vodafone Cash, show instructions and redirect to pending page
        window.location.href = `/payment-pending?order_id=${orderResponse.orderId}&id=${orderResponse.id}`;
      } else {
        // Card payments, redirect to iframe
        if (paymentResponse.iframe_url) {
          window.location.href = paymentResponse.iframe_url;
        } else {
          throw new Error('لم يتم توفير عنوان URL للدفع');
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      
      // Provide more specific error message
      if (error.message && error.message.includes('Server returned 500')) {
        alert('هناك مشكلة في الخادم. يرجى المحاولة مرة أخرى لاحقًا أو التواصل مع الدعم الفني.');
      } else if (error.message && error.message.includes('No Product matches')) {
        alert('أحد المنتجات في سلة التسوق الخاصة بك لم يعد متوفرًا. يرجى تحديث سلة التسوق والمحاولة مرة أخرى.');
      } else if (error.message === 'No valid products in cart') {
        alert('هناك مشكلة في عناصر سلة التسوق الخاصة بك. يرجى إضافة المنتجات إلى سلة التسوق مرة أخرى.');
      } else {
        alert('حدث خطأ أثناء معالجة طلبك. يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }
  
  if (cartItems.length === 0 && !paymentUrl) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <CreditCard size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-6" />
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">You need to add products to your cart before checkout.</p>
          <Link href="/products" className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  if (paymentUrl) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Order Placed Successfully!</h1>
          {formData.payment_method === 'vodafone_cash' ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your order has been placed successfully. You will receive a notification on your Vodafone Cash mobile wallet to complete the payment.
              </p>
              <Link 
                href="/products"
                className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          ) : formData.payment_method === 'cash_on_delivery' ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your order has been placed successfully. You will pay when your order is delivered.
              </p>
              <Link 
                href="/products"
                className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You're being redirected to the payment gateway to complete your purchase.
              </p>
              <a 
                href={paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors"
              >
                Proceed to Payment
              </a>
            </>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/cart" className="flex items-center text-secondary hover:underline">
          <ChevronLeft size={16} />
          <span>Back to Cart</span>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                >
                  <option value="Egypt">Egypt</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Qatar">Qatar</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Special notes for delivery or product"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method *
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === 'card'}
                    onChange={handleInputChange}
                    className="mr-3 text-secondary focus:ring-secondary"
                  />
                  <div>
                    <div className="font-medium dark:text-white">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pay securely with your credit or debit card</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="payment_method"
                    value="vodafone_cash"
                    checked={formData.payment_method === 'vodafone_cash'}
                    onChange={handleInputChange}
                    className="mr-3 text-secondary focus:ring-secondary"
                  />
                  <div>
                    <div className="font-medium dark:text-white">Vodafone Cash</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pay using your Vodafone Cash mobile wallet</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash_on_delivery"
                    checked={formData.payment_method === 'cash_on_delivery'}
                    onChange={handleInputChange}
                    className="mr-3 text-secondary focus:ring-secondary"
                  />
                  <div>
                    <div className="font-medium dark:text-white">Cash on Delivery</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive your order</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="rounded text-secondary mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the <Link href="/terms" className="text-secondary hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
              </label>
            </div>
            
            <div className="lg:hidden">
              <h3 className="font-semibold mb-4 dark:text-white">Order Summary</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="dark:text-white">{parseFloat(cartTotal).toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="dark:text-white">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      `${parseFloat(shippingCost).toFixed(2)} EGP`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="dark:text-white">{parseFloat(taxAmount).toFixed(2)} EGP</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold">
                  <span className="dark:text-white">Total</span>
                  <span className="dark:text-white">{parseFloat(orderTotal).toFixed(2)} EGP</span>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-secondary text-white py-3 rounded-md font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size || ''}-${item.color || ''}`} className="flex gap-4">
                  <div className="relative bg-gray-200 dark:bg-gray-700 rounded w-16 h-16 flex-shrink-0 overflow-hidden">
                    <ProductImage
                      src={item.product?.images[1]}
                      alt={item.product?.name || 'Product'}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm dark:text-white">{item.product?.name}</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.size && <span className="mr-2">Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm dark:text-gray-300">{item.product?.price} EGP x {item.quantity}</span>
                      <span className="font-medium dark:text-white">{(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)} EGP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="dark:text-white">
                  {cartTotal.toFixed(2)} EGP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="dark:text-white">
                  {shippingCost === 0
                    ? <span className="text-green-600 dark:text-green-400">Free</span>
                    : `${shippingCost.toFixed(2)} EGP`}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                <span className="dark:text-white">
                  {taxAmount.toFixed(2)} EGP
                </span>
              </div> */}
              <div className="border-t dark:border-gray-700 pt-4 flex justify-between font-bold">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">
                  {orderTotal.toFixed(2)} EGP
                </span>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div>
              <h3 className="font-semibold mb-3">Payment Methods</h3>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <p className="text-sm text-gray-600 mb-2">
                  You'll be redirected to Paymob secure payment gateway after placing your order
                </p>
                <div className="flex justify-center gap-2">
                  <img src="/images/payment/visa.svg" alt="Visa" className="h-8" />
                  <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
