'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Eye, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { orderAPI } from '@/services/api';

export default function MyOrdersPage() {
  const router = useRouter();
  const { authToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders directly without authentication for demo purposes
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders directly from the API endpoint
      let data = [];
      if (authToken) {
        // Fetch all user orders when authenticated
        data = await orderAPI.getUserOrders(authToken);
      } else {
        // Guest user flow: load all stored guest order UUIDs
        if (typeof window !== 'undefined') {
          const guestIdsJson = localStorage.getItem('guestOrderIds');
          if (guestIdsJson) {
            const guestIds = JSON.parse(guestIdsJson);
            // Fetch all orders in parallel
            const ordersResp = await Promise.all(
              guestIds.map(async (oid) => {
                try {
                  return await orderAPI.getOrderByOrderId(oid);
                } catch (err) {
                  console.error('Failed to fetch guest order', oid, err);
                  return null;
                }
              })
            );
            data = ordersResp.filter(Boolean);
          }
          // Backward compatibility: if no array found, fall back to single stored ID
          if (data.length === 0) {
            const lastId = localStorage.getItem('lastOrderId');
            if (lastId) {
              try {
                const single = await orderAPI.getOrderByOrderId(lastId);
                if (single) data = [single];
              } catch (err) { /* ignore */ }
            }
          }
        }
      }
      // console.log('Orders fetched successfully:', data);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error loading orders. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Package className="mr-1 h-3 w-3" />
            Processing
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Truck className="mr-1 h-3 w-3" />
            Shipped
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-900 dark:text-white">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Use the orders directly from the API
  const displayOrders = orders;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Track and manage your orders
          </p>
        </div>

        {displayOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">No Orders Yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't placed any orders yet. Explore our products and make a purchase!</p>
            <Link href="/products" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayOrders.map((order) => (
                <li key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">
                          Order #{order.orderId}
                        </h3>
                        <span className="ml-2">
                          {getStatusBadge(order.status)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Payment Method:</span>{' '}
                        {getPaymentMethodText(order.payment?.paymentMethod)}
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Amount:</span>{' '}
                        {order.totalAmount} EGP
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:rtl:space-x-reverse">
                      <Link
                        href={`/order-details/${order.orderId}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="mr-1 -ml-0.5 h-4 w-4" /> View Details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Products ({order.items?.length || 0})
                    </h4>
                    <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                      {(order.items || []).slice(0, 2).map((item, index) => (
                        <li key={index} className="py-2 flex justify-between text-sm">
                          <div>
                            {item.product?.name} × {item.quantity}
                          </div>
                          <div className="font-medium">
                            {(item.price * item.quantity)} EGP
                          </div>
                        </li>
                      ))}
                      {(order.items?.length || 0) > 2 && (
                        <li className="py-2 text-sm text-blue-600 dark:text-blue-400">
                          <Link href={`/order-details/${order.orderId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                            View All Products <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
