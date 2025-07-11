"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import adminAPI from "@/services/admin-api";
import ProductImage from "@/components/ProductImage";

// Function to get order details from the API
async function getOrderDetails(id) {
  try {
    // Fetch order details from the API using the admin API service
    return await adminAPI.getOrderDetails(id);


    return orderDetails;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusOptions, setStatusOptions] = useState([
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "PAID", label: "Paid" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" }
  ]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(
    () => {
      async function fetchOrderDetails() {
        // Prevent API call if id is missing or invalid
        if (!params.id || params.id === 'undefined') {
          setOrder(null);
          setLoading(false);
          return;
        }
        try {
          const orderData = await getOrderDetails(params.id);
          setOrder(orderData);
          setSelectedStatus(orderData?.status);
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchOrderDetails();
    },
    [params.id]
  );

  useEffect(() => {
    if (order) {
      // تأكد أن selectedStatus دائماً بحروف كبيرة
      setSelectedStatus(order.status?.toUpperCase());
      setNotes(order.notes || "");
    }
  }, [order]);

  // Notes state is declared above

  // Handle status update
  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;

    setIsUpdating(true);

    try {
      // Call the API to update the order status using the admin API service
      await adminAPI.updateOrderStatus(
        params.id,
        selectedStatus
      );
      // بعد التحديث، أعد جلب تفاصيل الطلب من جديد
      const refreshedOrder = await adminAPI.getOrderDetails(params.id);
      setOrder(refreshedOrder);
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      setIsUpdating(false);
      // Fallback to client-side update if API call fails
      setOrder(prev => ({ ...prev, status: selectedStatus }));
    }
  };


  // Handle notes update
  const handleNotesUpdate = async () => {
    if (notes === order.notes) return;

    setIsSavingNotes(true);

    try {
      // Call the API to update the order notes using the admin API service
      const updatedOrder = await adminAPI.updateOrderNotes(
        params.id,
        notes
      );
      setOrder(updatedOrder);
      setIsSavingNotes(false);
    } catch (error) {
      console.error("Error updating order notes:", error);
      setIsSavingNotes(false);
      // Fallback to client-side update if API call fails
      setOrder(prev => ({ ...prev, notes }));
    }
  };

  // Get status badge color
  const getStatusBadgeColor = status => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  // Get payment status badge color
  const getPaymentStatusBadgeColor = status => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case "  COMPLETED":
      case "DELIVERED":
      case "PAID":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "CANCELLED":
      case "REFUNDED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
      case "PROCESSING":
      case "SHIPPED":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500 text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Order not found
        </h3>
        <p className="text-gray-500 mb-6">
          The order you are looking for does not exist.
        </p>
        <Link href="/admin/orders" className="text-secondary hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Order #{order.id || order._id}</h1>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
              order.status || 'PENDING'
            )}`}>
            {(order.status_display || (order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'PENDING'))}
          </span>

          {/* Status Dropdown */}
          <select
            className="ml-4 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none"
            value={selectedStatus || order.status || 'PENDING'}
            onChange={e => setSelectedStatus(e.target.value)}
            disabled={isUpdating}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating || (selectedStatus === (order.status || '  PENDING'))}
            className="ml-2 px-3 py-1 bg-secondary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            <Download className="mr-2 h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map(item =>
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 relative">
                            {console.log(item.product.image)}
                            {item.product?.image ? (
                              <ProductImage
                                src={item.product.image}
                                alt={item.product.name}
                                width={128}
                                height={128}
                                className="object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-500">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product?.name || 'Product'}</div>
                            <div className="text-sm text-gray-500">
                              {item.product?.color && <span>Color: {item.product.color}</span>}
                              {item.product?.size && <span> | Size: {item.product.size}</span>}
                            </div>
                            <div className="text-xs text-gray-500">SKU: {item.product?.id || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.price} EGP
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.total_price ? parseFloat(item.total_price).toFixed(2) : (parseFloat(item.price) * item.quantity).toFixed(2)} EGP</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal:</span>
                    <span className="text-sm font-medium">
                      {order.totalAmount} EGP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping:</span>
                    <span className="text-sm font-medium text-green-900">
                      Free
                    </span>
                  </div>
                  {/* {order.tax && parseFloat(order.tax) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tax:</span>
                      <span className="text-sm font-medium">
                        ${order.tax} EGP
                      </span>
                    </div>
                  )} */}
                  {/* {order.discount && parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Discount:</span>
                      <span className="text-sm font-medium text-red-600">
                        -${order.discount} EGP
                      </span>
                    </div>
                  )} */}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-base font-medium">Total:</span>
                    <span className="text-base font-bold">
                      {order.totalAmount} EGP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Order Timeline</h2>
            </div>
            <div className="px-6 py-4">
              <ol className="relative border-l border-gray-200">
                {/* {order.timeline.map((event, index) =>
                  <li key={index} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white">
                      {getStatusIcon(event.status)}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                      {event.status}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                      {event.date}
                    </time>
                    <p className="text-base font-normal text-gray-500">
                      {event.description}
                    </p>
                  </li>
                )} */}
              </ol>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium">Order Information</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Order Status
                </h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm">
                    {statusOptions.map(option =>
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={selectedStatus === order.status || isUpdating}
                    className={`px-3 py-2 rounded-md text-white text-sm ${selectedStatus ===
                      order.status || isUpdating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-secondary hover:bg-secondary-dark"}`}>
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
                {selectedStatus === 'completed' && order.status !== 'completed' && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                    <span className="font-medium">Note:</span> When an order is marked as completed, the payment status will automatically be updated to completed.
                  </div>
                )}
              </div>
              {/* <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Status
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(order.payment?.status || 'pending')}`}>
                  {(order.payment?.status || 'pending').charAt(0).toUpperCase() + (order.payment?.status || 'pending').slice(1)}
                </span>
              </div> */}
              {/* <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                <p className="text-sm">{order.payment?.payment_method === 'card' ? 'Credit/Debit Card' : 
                order.payment?.payment_method === 'vodafone_cash' ? 'Vodafone Cash' : 
                order.payment?.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Unknown'}</p>
              </div> */}
              {order.tracking_number && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tracking Number
                  </h3>
                  <p className="text-sm">
                    {order.tracking_number}
                  </p>
                </div>
              )}
              {order.shipping_method && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Shipping Method
                  </h3>
                  <p className="text-sm">
                    {order.shipping_method}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Customer</h2>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">{order.full_name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{order.email}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>
                      {order.phone}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Shipping Address
                </h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p>{order.address}</p>
                    <p>{order.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Notes</h2>
            </div>
            <div className="px-6 py-4">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this order..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                rows="3"
              />
              <button
                className="mt-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
                onClick={handleNotesUpdate}
                disabled={isSavingNotes || notes === order.notes}
              >
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
