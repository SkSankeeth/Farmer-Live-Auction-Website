import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const NotificationSystem = ({ userType }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock notification data
  const mockNotifications = [
    {
      id: 'N-001',
      type: 'auction',
      title: 'New Bid Placed',
      message: 'A new bid of ₹15,000 has been placed on your "Fresh Tomatoes" auction',
      timestamp: new Date('2024-01-20T10:30:00Z'),
      read: false,
      priority: 'high',
      actionUrl: '/auctions/auction-123',
      metadata: {
        auctionId: 'auction-123',
        bidAmount: 15000,
        bidderName: 'John Doe'
      }
    },
    {
      id: 'N-002',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹45,000 has been received for auction "Wheat Grain"',
      timestamp: new Date('2024-01-20T09:15:00Z'),
      read: false,
      priority: 'high',
      actionUrl: '/payments/payment-456',
      metadata: {
        paymentId: 'payment-456',
        amount: 45000,
        auctionTitle: 'Wheat Grain'
      }
    },
    {
      id: 'N-003',
      type: 'transport',
      title: 'Transport Request Approved',
      message: 'Your transport request for "Fresh Milk" has been approved and assigned to FastTrack Logistics',
      timestamp: new Date('2024-01-20T08:45:00Z'),
      read: true,
      priority: 'medium',
      actionUrl: '/transport/request-789',
      metadata: {
        requestId: 'request-789',
        transporterName: 'FastTrack Logistics',
        productName: 'Fresh Milk'
      }
    },
    {
      id: 'N-004',
      type: 'auction',
      title: 'Auction Ending Soon',
      message: 'Your "Organic Rice" auction ends in 2 hours. Current highest bid: ₹25,000',
      timestamp: new Date('2024-01-20T07:20:00Z'),
      read: true,
      priority: 'medium',
      actionUrl: '/auctions/auction-456',
      metadata: {
        auctionId: 'auction-456',
        timeLeft: '2 hours',
        currentBid: 25000
      }
    },
    {
      id: 'N-005',
      type: 'system',
      title: 'Profile Verification Complete',
      message: 'Your KYC documents have been verified and your profile is now active',
      timestamp: new Date('2024-01-19T16:30:00Z'),
      read: true,
      priority: 'low',
      actionUrl: '/profile',
      metadata: {
        verificationStatus: 'approved',
        documentType: 'KYC'
      }
    },
    {
      id: 'N-006',
      type: 'transport',
      title: 'Delivery Completed',
      message: 'Your shipment of "Fresh Vegetables" has been successfully delivered to Mumbai',
      timestamp: new Date('2024-01-19T14:15:00Z'),
      read: true,
      priority: 'medium',
      actionUrl: '/transport/request-123',
      metadata: {
        requestId: 'request-123',
        deliveryLocation: 'Mumbai',
        productName: 'Fresh Vegetables'
      }
    },
    {
      id: 'N-007',
      type: 'payment',
      title: 'Escrow Release',
      message: 'Escrow amount of ₹30,000 has been released for "Organic Wheat" auction',
      timestamp: new Date('2024-01-19T11:45:00Z'),
      read: true,
      priority: 'high',
      actionUrl: '/payments/escrow-789',
      metadata: {
        escrowId: 'escrow-789',
        amount: 30000,
        auctionTitle: 'Organic Wheat'
      }
    },
    {
      id: 'N-008',
      type: 'auction',
      title: 'Auction Won',
      message: 'Congratulations! You won the "Premium Rice" auction with a bid of ₹18,500',
      timestamp: new Date('2024-01-18T15:20:00Z'),
      read: true,
      priority: 'high',
      actionUrl: '/auctions/won-auctions',
      metadata: {
        auctionId: 'auction-789',
        winningBid: 18500,
        auctionTitle: 'Premium Rice'
      }
    }
  ];

  useEffect(() => {
    // Load notifications from mock data
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'auction': return '🏷️';
      case 'payment': return '💰';
      case 'transport': return '🚚';
      case 'system': return '⚙️';
      case 'security': return '🔒';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-orange-600 dark:text-orange-400';
      case 'low': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'auction': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'payment': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'transport': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'system': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setUnreadCount(prev => {
      const deletedNotif = notifications.find(n => n.id === notificationId);
      return deletedNotif && !deletedNotif.read ? Math.max(0, prev - 1) : prev;
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h5l-5-5v5zM12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1">
              {[
                { id: 'all', label: 'All', count: notifications.length },
                { id: 'unread', label: 'Unread', count: unreadCount },
                { id: 'auction', label: 'Auctions', count: notifications.filter(n => n.type === 'auction').length },
                { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
                { id: 'transport', label: 'Transport', count: notifications.filter(n => n.type === 'transport').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    filter === tab.id
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="w-12 h-12 mx-auto mb-3">
                  <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h5l-5-5v5zM12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 ${
                          !notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {notification.message}
                        </p>
                        {notification.metadata && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {notification.type === 'auction' && notification.metadata.bidAmount && (
                              <span>Bid: ₹{notification.metadata.bidAmount.toLocaleString()}</span>
                            )}
                            {notification.type === 'payment' && notification.metadata.amount && (
                              <span>Amount: ₹{notification.metadata.amount.toLocaleString()}</span>
                            )}
                            {notification.type === 'transport' && notification.metadata.transporterName && (
                              <span>Transporter: {notification.metadata.transporterName}</span>
                            )}
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  // Navigate to full notifications page
                  console.log('Navigate to notifications page');
                }}
                className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;





