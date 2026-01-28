import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FinancialDashboard from '../components/FinancialDashboard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const SuperAdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard states
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  
  // User management states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userAction, setUserAction] = useState('');
  const [actionReason, setActionReason] = useState('');
  
  // Auction management states
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [auctionAction, setAuctionAction] = useState('');
  
  // Filter states
  const [userFilter, setUserFilter] = useState('all');
  const [auctionFilter, setAuctionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication and initialize dashboard
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/super-admin-login');
      return;
    }
    
    if (user.userType !== 'super-admin') {
      navigate('/');
      return;
    }
    
    initializeDashboard();
  }, [isAuthenticated, user, navigate]);

  const initializeDashboard = async () => {
    // TEMPORARY: Use mock data for testing
    console.log('Initializing Super Admin Dashboard with mock data');
    
    // Mock users data
    const mockUsers = [
      {
        id: '1',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh@farm.com',
        userType: 'farmer',
        status: 'active',
        registrationDate: '2024-01-15',
        lastLogin: '2024-01-20',
        totalAuctions: 5,
        totalBids: 0,
        location: 'Pune, Maharashtra'
      },
      {
        id: '2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@foods.com',
        userType: 'buyer',
        status: 'active',
        registrationDate: '2024-01-10',
        lastLogin: '2024-01-19',
        totalAuctions: 0,
        totalBids: 12,
        location: 'Mumbai, Maharashtra'
      },
      {
        id: '3',
        firstName: 'Suresh',
        lastName: 'Patel',
        email: 'suresh@farm.com',
        userType: 'farmer',
        status: 'suspended',
        registrationDate: '2024-01-05',
        lastLogin: '2024-01-18',
        totalAuctions: 3,
        totalBids: 0,
        location: 'Ahmedabad, Gujarat'
      },
      {
        id: '4',
        firstName: 'Lakshmi',
        lastName: 'Devi',
        email: 'lakshmi@farm.com',
        userType: 'farmer',
        status: 'active',
        registrationDate: '2024-01-12',
        lastLogin: '2024-01-20',
        totalAuctions: 2,
        totalBids: 0,
        location: 'Bangalore, Karnataka'
      },
      {
        id: '5',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@onlyfarmers.com',
        userType: 'farmer_admin',
        status: 'active',
        registrationDate: '2024-01-01',
        lastLogin: '2024-01-20',
        totalAuctions: 0,
        totalBids: 0,
        location: 'Delhi, India'
      }
    ];
    
    // Mock auctions data
    const mockAuctions = [
      {
        id: '1',
        productName: 'Fresh Tomatoes',
        farmerName: 'Rajesh Kumar',
        status: 'active',
        basePrice: 25.00,
        currentBid: 28.50,
        totalBids: 5,
        endDate: '2024-01-25',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        productName: 'Wheat Grain',
        farmerName: 'Suresh Patel',
        status: 'suspended',
        basePrice: 45.00,
        currentBid: 47.25,
        totalBids: 3,
        endDate: '2024-01-30',
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        productName: 'Milk',
        farmerName: 'Lakshmi Devi',
        status: 'active',
        basePrice: 35.00,
        currentBid: 35.00,
        totalBids: 0,
        endDate: '2024-01-22',
        createdAt: '2024-01-12'
      }
    ];
    
    // Mock analytics data
    const mockAnalytics = {
      totalUsers: 150,
      totalFarmers: 85,
      totalBuyers: 60,
      totalAdmins: 5,
      activeUsers: 142,
      suspendedUsers: 8,
      totalAuctions: 45,
      activeAuctions: 38,
      suspendedAuctions: 7,
      totalRevenue: 125000,
      monthlyGrowth: 12.5,
      topCategories: ['vegetables', 'grains', 'dairy'],
      userRegistrations: [12, 15, 8, 20, 18, 25],
      auctionActivity: [5, 8, 12, 6, 15, 10]
    };
    
    setUsers(mockUsers);
    setAuctions(mockAuctions);
    setAnalytics(mockAnalytics);
    setLoading(false);
  };

  const handleUserAction = async (e) => {
    e.preventDefault();
    
    // TEMPORARY: Mock user action
    setTimeout(() => {
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            status: userAction === 'suspend' ? 'suspended' : 'active'
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setShowUserModal(false);
      setSelectedUser(null);
      setUserAction('');
      setActionReason('');
      alert(`User ${userAction === 'suspend' ? 'suspended' : 'activated'} successfully!`);
    }, 1500);
  };

  const handleAuctionAction = async (e) => {
    e.preventDefault();
    
    // TEMPORARY: Mock auction action
    setTimeout(() => {
      const updatedAuctions = auctions.map(auction => {
        if (auction.id === selectedAuction.id) {
          return {
            ...auction,
            status: auctionAction === 'suspend' ? 'suspended' : 'active'
          };
        }
        return auction;
      });
      
      setAuctions(updatedAuctions);
      setShowAuctionModal(false);
      setSelectedAuction(null);
      setAuctionAction('');
      alert(`Auction ${auctionAction === 'suspend' ? 'suspended' : 'activated'} successfully!`);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'farmer': return 'text-blue-600 bg-blue-100';
      case 'buyer': return 'text-green-600 bg-green-100';
      case 'farmer_admin': return 'text-purple-600 bg-purple-100';
      case 'super_admin': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.userType === userFilter;
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredAuctions = auctions.filter(auction => {
    return auctionFilter === 'all' || auction.status === auctionFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, Super Admin (Demo Mode)
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'User Management', icon: '👥' },
              { id: 'auctions', name: 'Auction Management', icon: '🏷️' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'financials', name: 'Financial Overview', icon: '💰' },
              { id: 'dashboard', name: 'Analytics Dashboard', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-lg">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-lg">🏷️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Auctions</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.activeAuctions}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                      <span className="text-yellow-600 dark:text-yellow-400 text-lg">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-lg">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Growth</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">+{analytics.monthlyGrowth}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Farmers</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(analytics.totalFarmers / analytics.totalUsers) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.totalFarmers}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Buyers</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(analytics.totalBuyers / analytics.totalUsers) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.totalBuyers}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Admins</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(analytics.totalAdmins / analytics.totalUsers) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.totalAdmins}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {analytics.topCategories.map((category, index) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Users</option>
                  <option value="farmer">Farmers</option>
                  <option value="buyer">Buyers</option>
                  <option value="farmer_admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(user.userType)}`}>
                            {user.userType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div>Auctions: {user.totalAuctions}</div>
                          <div>Bids: {user.totalBids}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setUserAction(user.status === 'active' ? 'suspend' : 'activate');
                              setShowUserModal(true);
                            }}
                            className={`mr-2 px-3 py-1 rounded-md text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Auction Management Tab */}
        {activeTab === 'auctions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <select
                value={auctionFilter}
                onChange={(e) => setAuctionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Auctions</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Auctions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Auctions ({filteredAuctions.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bidding</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAuctions.map((auction) => (
                      <tr key={auction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {auction.productName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Base: ₹{auction.basePrice}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {auction.farmerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                            {auction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div>Current: ₹{auction.currentBid}</div>
                          <div>Bids: {auction.totalBids}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedAuction(auction);
                              setAuctionAction(auction.status === 'active' ? 'suspend' : 'activate');
                              setShowAuctionModal(true);
                            }}
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              auction.status === 'active'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {auction.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Registrations (Last 6 Months)</h3>
                <div className="space-y-2">
                  {analytics.userRegistrations.map((count, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Month {index + 1}</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(count / Math.max(...analytics.userRegistrations)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Auction Activity (Last 6 Months)</h3>
                <div className="space-y-2">
                  {analytics.auctionActivity.map((count, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Month {index + 1}</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(count / Math.max(...analytics.auctionActivity)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.activeUsers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{analytics.suspendedUsers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Suspended Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.activeAuctions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Auctions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analytics.suspendedAuctions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Suspended Auctions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Overview Tab */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <FinancialDashboard
              userType="super_admin"
              analytics={analytics}
              payments={[]}
              auctions={auctions}
            />
          </div>
        )}

        {/* Analytics Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <AnalyticsDashboard
              userType="super_admin"
              analytics={analytics}
              payments={[]}
              auctions={auctions}
            />
          </div>
        )}
      </main>

      {/* User Action Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {userAction === 'suspend' ? 'Suspend' : 'Activate'} User
                </h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to {userAction} <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?
                </p>
              </div>

              <form onSubmit={handleUserAction} className="space-y-4">
                {userAction === 'suspend' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for suspension
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter reason for suspension..."
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-md transition-colors duration-200 ${
                      userAction === 'suspend'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {userAction === 'suspend' ? 'Suspend User' : 'Activate User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Auction Action Modal */}
      {showAuctionModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {auctionAction === 'suspend' ? 'Suspend' : 'Activate'} Auction
                </h2>
                <button
                  onClick={() => setShowAuctionModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to {auctionAction} the auction for <strong>{selectedAuction.productName}</strong>?
                </p>
              </div>

              <form onSubmit={handleAuctionAction} className="space-y-4">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAuctionModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-md transition-colors duration-200 ${
                      auctionAction === 'suspend'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {auctionAction === 'suspend' ? 'Suspend Auction' : 'Activate Auction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;

