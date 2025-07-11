'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft, Truck, Clock, CheckCircle, XCircle, MapPin, Phone, Mail, User } from 'lucide-react';
import { orderAPI } from '@/services/api';
import ProductImage from '@/components/ProductImage';

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  // Unwrap params promise (Next.js dynamic route parameters)
  const { orderId } = React.use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch order details directly without authentication for demo purposes
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Fetch order details using the order_id (UUID)
      const data = await orderAPI.getOrderByOrderId(orderId);
      // console.log('Order details fetched successfully:', data);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Error loading order details. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            <Package className="mr-1 h-3 w-3" /> Processing
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
            <Truck className="mr-1 h-3 w-3" /> Shipped
          </span>
        );
      case 'PAID':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Paid
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {status}
          </span>
        );
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'vodafone_cash':
        return 'Vodafone Cash';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      case 'success':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Paid
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            <XCircle className="mr-1 h-3 w-3" /> Payment Failed
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Error</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchOrderDetails}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-900 dark:text-white">
        <div className="text-xl mb-4">Order not found</div>
        <Link
          href="/my-orders"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="mr-1 -ml-0.5 h-4 w-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/my-orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Order Details #{order.orderId}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              {getStatusBadge(order.status)}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-gray-600 dark:text-gray-300">{order.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">{order.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">{order.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600 dark:text-gray-300">{order.address}</p>
                      <p className="text-gray-600 dark:text-gray-300">{order.city}, {order.country}</p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="flex items-start">
                      <div className="h-5 w-5 text-gray-400 mt-0.5 ml-2">📝</div>
                      <div>
                        <p className="font-medium">Notes</p>
                        <p className="text-gray-600 dark:text-gray-300">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</dt>
                <p className="mt-1">
                  Cash on Delivery
                </p> 
                {/* {getPaymentMethodText(order.payment?.paymentMethod)} */}
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <p className="mt-1">{getPaymentStatusBadge(order.payment?.status)}</p>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
                <p className="mt-1 font-bold">{order.totalAmount} EGP</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative">
                            <div className="h-10 w-10 relative">
                            <ProductImage
                              src={item.product.images[1]}
                              alt={item.product.name}
                              width={40}
                              height={40}
                            />
                            </div>
                          </div>
                          <div className="mr-4">
                            <Link 
                              href={`/products/${item.product?.slug}`}
                              className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {item.product?.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.size || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.color || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.price} EGP
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {(item.price * item.quantity)} EGP
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-right text-sm font-medium">
                      Grand Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {order.totalAmount} EGP
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/my-orders"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-1 -ml-0.5 h-4 w-4" /> Back to orders
          </Link>
        </div>
      </div>
    </div>
  );
}
