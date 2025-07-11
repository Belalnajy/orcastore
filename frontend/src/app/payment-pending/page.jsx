'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, AlertCircle } from 'lucide-react';
import { orderAPI } from '@/services/api';

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // In a real app, you would fetch the order details
      // For now, we'll just set a mock order
      setOrderDetails({
        order_id: orderId,
        status: 'pending',
        payment_method: 'vodafone_cash',
        total_amount: 0,
        created_at: new Date().toISOString()
      });
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Clock className="mx-auto h-24 w-24 text-yellow-500" />
          <h1 className="mt-4 text-3xl font-extrabold">في انتظار الدفع</h1>
          <p className="mt-2 text-lg">
            تم استلام طلبك وهو في انتظار تأكيد الدفع.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium">تفاصيل الطلب</h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">رقم الطلب</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{orderDetails.order_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">تاريخ الطلب</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(orderDetails.created_at).toLocaleDateString('ar-EG')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">حالة الطلب</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                    في انتظار الدفع
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">طريقة الدفع</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">فودافون كاش</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                يرجى إكمال عملية الدفع من خلال تطبيق فودافون كاش الخاص بك. ستتلقى إشعارًا على هاتفك قريبًا.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-4">
            بمجرد تأكيد الدفع، سيتم تحديث حالة طلبك وإرسال تفاصيل الطلب إلى بريدك الإلكتروني.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}
