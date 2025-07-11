'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { orderAPI } from '@/services/api';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // 1. Try to fetch via public order_id (UUID) if present in URL
        if (orderId && orderId !== 'undefined') {
          const orderData = await orderAPI.getOrderByOrderId(orderId);
          // console.log('Fetched order details by order_id:', orderData);
          setOrderDetails(orderData);
          // Persist internal id for any future requests
          if (orderData?.id) {
            localStorage.setItem('lastOrderId', orderData.id);
          }
          return;
        }

        // 2. Fallback: fetch by internal database id from query or localStorage
        const rawId = searchParams.get('id');
        const id = (rawId && rawId !== 'undefined') ? rawId : localStorage.getItem('lastOrderId');
        if (id) {
          const orderData = await orderAPI.getOrderById(id);
          console.log('Fetched order details by id:', orderData);
          setOrderDetails(orderData);
          return;
        }

        // If neither identifier exists, show error
        setError('No order identifier provided');
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Error loading order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    } else {
      const lastOrderId = localStorage.getItem('lastOrderId');
      if (lastOrderId) {
        fetchOrderDetails();
      } else {
        setLoading(false);
        setError('No order ID provided');
      }
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="mb-4">{error}</p>
          <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Order Not Found</h1>
          <p className="mb-4">We couldn't find the order you're looking for.</p>
          <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h1 className="mt-4 text-3xl font-extrabold">Your Order is Confirmed!</h1>
          <p className="mt-2 text-lg">
            Thank you for your order. We will deliver your order as soon as possible.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium">Order Details</h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{orderDetails.orderId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  Cash on Delivery
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {orderDetails.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {orderDetails.totalAmount || '0.00'} EGP
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-4">
            سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.
          </p>
          <div className="flex justify-between mt-8">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Return to Home
            </Link>
            <Link href="/my-orders" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
