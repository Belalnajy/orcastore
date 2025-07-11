"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  User, Package, CreditCard, Heart, LogOut, 
  Settings, Edit, Camera, Save, X, Eye, EyeOff 
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+20 123 456 7890",
    address: "123 Main St, Cairo, Egypt",
    profileImage: "/images/avatar-placeholder.jpg"
  });
  const [editedUser, setEditedUser] = useState({ ...user });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data and orders
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock orders data
        const mockOrders = [
          {
            id: "ORD-1234",
            date: "2025-05-01",
            status: "Delivered",
            total: 149.97,
            items: [
              { id: 1, name: "Classic White T-Shirt", quantity: 2, price: 29.99, image: "/images/products/classic-white-t-shirt.png" },
              { id: 3, name: "Slim Fit Jeans", quantity: 1, price: 89.99, image: "/images/products/slim-fit-jeans.png" }
            ]
          },
          {
            id: "ORD-1235",
            date: "2025-04-15",
            status: "Processing",
            total: 69.99,
            items: [
              { id: 4, name: "Summer Floral Dress", quantity: 1, price: 69.99, image: "/images/products/summer-floral-dress.png" }
            ]
          },
          {
            id: "ORD-1236",
            date: "2025-03-22",
            status: "Delivered",
            total: 119.98,
            items: [
              { id: 2, name: "Black Denim Jacket", quantity: 1, price: 89.99, image: "/images/products/black-denim-jacket.png" },
              { id: 5, name: "Kids Hoodie", quantity: 1, price: 29.99, image: "/images/products/kids-hoodie.png" }
            ]
          }
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUser(editedUser);
    } else {
      // Start editing
      setEditedUser({ ...user });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send password change request to your backend
    alert("Password change functionality would be implemented here");
    setPassword({
      current: "",
      new: "",
      confirm: ""
    });
  };

  const handleLogout = () => {
    // Here you would implement logout functionality
    alert("Logout functionality would be implemented here");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary dark:text-white">Profile Information</h2>
              <button 
                onClick={handleEditToggle}
                className="flex items-center gap-2 text-secondary hover:text-secondary-dark"
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <Image 
                    src={user.profileImage || "/images/avatar-placeholder.jpg"} 
                    alt={user.name} 
                    fill
                    className="object-cover rounded-full"
                  />
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-secondary text-white p-2 rounded-full hover:bg-secondary-dark">
                      <Camera size={18} />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-primary dark:text-white">{user.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">Member since April 2025</p>
              </div>

              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editedUser.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'orders':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Order History</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
                <Link href="/products" className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary-dark transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-primary dark:text-white">Order #{order.id}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-primary dark:text-white">
                          Total: {order.total.toFixed(2)} EGP
                        </p>
                        <Link 
                          href={`/order-details/${order.id}`}
                          className="text-secondary hover:text-secondary-dark text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                              <Image 
                                src={item.image || "/images/product-placeholder.jpg"} 
                                alt={item.name} 
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-medium text-primary dark:text-white truncate">{item.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.quantity} x {item.price.toFixed(2)} EGP
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'security':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Security Settings</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="current"
                        value={password.current}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <button className="bg-gray-200 dark:bg-gray-700 text-primary dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Enable
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary dark:text-white">Login Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when someone logs into your account</p>
                  </div>
                  <button className="bg-gray-200 dark:bg-gray-700 text-primary dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'wishlist':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">My Wishlist</h2>
            
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Wishlist is Empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love to your wishlist.</p>
              <Link href="/products" className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary-dark transition-colors">
                Explore Products
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary dark:text-white">
          My Account
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Manage your profile, track orders, and update your preferences
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === "profile" 
                    ? "bg-secondary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === "orders" 
                    ? "bg-secondary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Package size={20} />
                <span>Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === "wishlist" 
                    ? "bg-secondary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Heart size={20} />
                <span>Wishlist</span>
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === "security" 
                    ? "bg-secondary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Settings size={20} />
                <span>Security</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:w-3/4"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}
