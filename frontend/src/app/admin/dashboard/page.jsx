"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

// Fetch dashboard stats from backend API
async function getDashboardStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return await res.json();
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Error Loading Dashboard
        </h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Failed to load dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors duration-200 w-[100%] md:w-100%] lg:w-[100%] xl:w-[100%]">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Sales
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalSales.toLocaleString()} EGP
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
            <span className="text-green-500 dark:text-green-400 font-medium">
              12% increase
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors duration-200 w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%]">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Orders
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
            <span className="text-green-500 dark:text-green-400 font-medium">
              8% increase
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors duration-200 w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] ">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Customers
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
            <span className="text-green-500 dark:text-green-400 font-medium">
              5% increase
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 transition-colors duration-200 w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] ">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Products
              </h2>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalProducts}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
            <span className="text-red-500 dark:text-red-400 font-medium">
              2% decrease
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 transition-colors duration-200 overflow-x-auto w-[435px] md:w-[75%] lg:w-[100%] xl:w-[100%]">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-secondary hover:underline flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentOrders.map(order =>
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary">
                      {order.id}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {order.date}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {order.amount.toFixed(2)} EGP
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : ""}
                      ${order.status === "processing"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : ""}
                      ${order.status === "paid"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : ""}
                      ${order.status === "pending"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        : ""}
                      ${order.status === "cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : ""}
                    `}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 transition-colors duration-200 overflow-x-auto w-[435px] md:w-[435px] lg:w-[100%] xl:w-[100%]">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Selling Products
          </h2>
          <Link
            href="/admin/products"
            className="text-secondary hover:underline flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.topProducts.map(product =>
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {product.sales} units
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {product.revenue.toFixed(2)} EGP
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${product.stock < 10
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"}`}>
                      {product.stock} in stock
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
