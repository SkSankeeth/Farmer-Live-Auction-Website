import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FarmerAdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard states
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingBuyers, setPendingBuyers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  
  // Buyer approval states
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalReason, setApprovalReason] = useState('');
  
  // Payment states
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Filter states
  const [buyerFilter, setBuyerFilter] = useState('pending');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [auctionFilter, setAuctionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication and initialize dashboard
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/farmer-admin-login');
      return;
    }
    
    if (!['admin', 'super_admin'].includes(user.userType)) {
      navigate('/');
      return;
    }
    
    initializeDashboard();
  }, [isAuthenticated, user, navigate]);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      const buyersRes = await fetch('http://localhost:5000/api/auth/list/buyers');
      const buyersData = await buyersRes.json();
      const buyers = buyersData.buyers || [];
      setPendingBuyers(buyers.filter(b => !(b.verification?.isVerified)));
    } catch (e) {
      console.error('Failed to load buyers', e);
    }
    
    // Mock pending buyers data
    const mockPendingBuyers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@foods.com',
        companyName: 'Fresh Foods Ltd',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        businessType: 'Food Processing',
        annualTurnover: '₹50,00,000',
        description: 'Leading food processing company in Mumbai',
        registrationDate: '2024-01-15',
        kycStatus: 'pending',
        kycDocuments: {
          panCard: 'uploaded',
          aadharCard: 'uploaded',
          businessLicense: 'uploaded',
          bankStatement: 'pending'
        }
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah@restaurant.com',
        companyName: 'Green Restaurant Chain',
        phone: '+91 98765 43211',
        location: 'Delhi, India',
        businessType: 'Restaurant',
        annualTurnover: '₹25,00,000',
        description: 'Chain of organic restaurants',
        registrationDate: '2024-01-18',
        kycStatus: 'pending',
        kycDocuments: {
          panCard: 'uploaded',
          aadharCard: 'uploaded',
          businessLicense: 'uploaded',
          bankStatement: 'uploaded'
        }
      },
      {
        id: '3',
        firstName: 'Raj',
        lastName: 'Sharma',
        email: 'raj@export.com',
        companyName: 'Global Export Co',
        phone: '+91 98765 43212',
        location: 'Ahmedabad, Gujarat',
        businessType: 'Export',
        annualTurnover: '₹1,00,00,000',
        description: 'International food export company',
        registrationDate: '2024-01-20',
        kycStatus: 'pending',
        kycDocuments: {
          panCard: 'uploaded',
          aadharCard: 'pending',
          businessLicense: 'uploaded',
          bankStatement: 'uploaded'
        }
      }
    ];
    
    // Mock payments data
    const mockPayments = [
      {
        id: '1',
        buyerName: 'John Doe',
        buyerEmail: 'john@foods.com',
        paymentType: 'security_deposit',
        amount: 25000,
        status: 'completed',
        date: '2024-01-20',
        auctionId: null,
        description: 'Security deposit for platform access'
      },
      {
        id: '2',
        buyerName: 'Sarah Wilson',
        buyerEmail: 'sarah@restaurant.com',
        paymentType: 'part_payment',
        amount: 15000,
        status: 'pending',
        date: '2024-01-21',
        auctionId: '1',
        description: 'Part payment for Fresh Tomatoes auction'
      },
      {
        id: '3',
        buyerName: 'Mike Johnson',
        buyerEmail: 'mike@wholesale.com',
        paymentType: 'full_payment',
        amount: 45000,
        status: 'completed',
        date: '2024-01-19',
        auctionId: '2',
        description: 'Full payment for Wheat Grain auction'
      },
      {
        id: '4',
        buyerName: 'Lisa Brown',
        buyerEmail: 'lisa@retail.com',
        paymentType: 'security_deposit',
        amount: 30000,
        status: 'pending',
        date: '2024-01-22',
        auctionId: null,
        description: 'Security deposit for platform access'
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
        createdAt: '2024-01-15',
        totalRevenue: 142500,
        commission: 7125
      },
      {
        id: '2',
        productName: 'Wheat Grain',
        farmerName: 'Suresh Patel',
        status: 'completed',
        basePrice: 45.00,
        finalPrice: 47.25,
        totalBids: 3,
        endDate: '2024-01-20',
        createdAt: '2024-01-10',
        totalRevenue: 472500,
        commission: 23625
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
        createdAt: '2024-01-12',
        totalRevenue: 0,
        commission: 0
      }
    ];
    
    // Mock analytics data
    const mockAnalytics = {
      totalBuyers: 45,
      pendingApprovals: 3,
      approvedBuyers: 42,
      totalPayments: 125000,
      pendingPayments: 45000,
      completedPayments: 80000,
      totalAuctions: 25,
      activeAuctions: 18,
      completedAuctions: 7,
      totalRevenue: 875000,
      totalCommission: 43750,
      monthlyGrowth: 8.5,
      topProducts: ['tomatoes', 'wheat', 'milk'],
      paymentTrends: [15000, 25000, 18000, 30000, 22000, 35000]
    };
    
    setPendingBuyers(mockPendingBuyers);
    setPayments(mockPayments);
    setAuctions(mockAuctions);
    setAnalytics(mockAnalytics);
    setLoading(false);
  };

  const approveBuyer = async (buyerId, approved) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/buyers/${buyerId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved: !!approved })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update');
      setPendingBuyers(prev => prev.filter(b => b.id !== buyerId));
    } catch (e) {
      alert(e.message || 'Failed to update approval');
    }
  };

  const handleBuyerApproval = async (e) => {
    e.preventDefault();
    
    // TEMPORARY: Mock buyer approval
    setTimeout(() => {
      const updatedBuyers = pendingBuyers.map(buyer => {
        if (buyer.id === selectedBuyer.id) {
          return {
            ...buyer,
            kycStatus: approvalAction === 'approve' ? 'approved' : 'rejected'
          };
        }
        return buyer;
      });
      
      setPendingBuyers(updatedBuyers);
      setShowApprovalModal(false);
      setSelectedBuyer(null);
      setApprovalAction('');
      setApprovalReason('');
      alert(`Buyer ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully!`);
    }, 1500);
  };

  const handlePaymentAction = async (e) => {
    e.preventDefault();
    
    // TEMPORARY: Mock payment action
    setTimeout(() => {
      const updatedPayments = payments.map(payment => {
        if (payment.id === selectedPayment.id) {
          return {
            ...payment,
            status: 'completed'
          };
        }
        return payment;
      });
      
      setPayments(updatedPayments);
      setShowPaymentModal(false);
      setSelectedPayment(null);
      alert('Payment marked as completed successfully!');
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'security_deposit': return 'text-blue-600 bg-blue-100';
      case 'part_payment': return 'text-yellow-600 bg-yellow-100';
      case 'full_payment': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return 'text-green-600';
      case 'pending': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredBuyers = pendingBuyers.filter(buyer => {
    const matchesFilter = buyerFilter === 'all' || buyer.kycStatus === buyerFilter;
    const matchesSearch = buyer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredPayments = payments.filter(payment => {
    return paymentFilter === 'all' || payment.status === paymentFilter;
  });

  const filteredAuctions = auctions.filter(auction => {
    return auctionFilter === 'all' || auction.status === auctionFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Farmer Admin Dashboard...</p>
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
                Farmer's Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, Farmer Admin (Demo Mode)
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
              { id: 'buyers', name: 'Buyer Management', icon: '👥' },
              { id: 'payments', name: 'Payment Monitoring', icon: '💰' },
              { id: 'auctions', name: 'Auction Activities', icon: '🏷️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approvals</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{analytics.pendingApprovals}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-lg">💰</span>
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
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                      <span className="text-yellow-600 dark:text-yellow-400 text-lg">🏷️</span>
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
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-lg">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Commission</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹{analytics.totalCommission.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer & Payment Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Buyer Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Buyers</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.totalBuyers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Approved Buyers</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.approvedBuyers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{analytics.pendingApprovals}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Payments</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">₹{analytics.totalPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">₹{analytics.completedPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">₹{analytics.pendingPayments.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product} className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">#{index + 1}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{product}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buyer Management Tab */}
        {activeTab === 'buyers' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search buyers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={buyerFilter}
                  onChange={(e) => setBuyerFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Buyers</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Buyers Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Buyer Profiles ({filteredBuyers.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">KYC Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Documents</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBuyers.map((buyer) => (
                      <tr key={buyer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {buyer.firstName} {buyer.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{buyer.email}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{buyer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {buyer.companyName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{buyer.businessType}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{buyer.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(buyer.kycStatus)}`}>
                            {buyer.kycStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="space-y-1">
                            <div>PAN: <span className={getDocumentStatusColor(buyer.kycDocuments.panCard)}>{buyer.kycDocuments.panCard}</span></div>
                            <div>Aadhar: <span className={getDocumentStatusColor(buyer.kycDocuments.aadharCard)}>{buyer.kycDocuments.aadharCard}</span></div>
                            <div>License: <span className={getDocumentStatusColor(buyer.kycDocuments.businessLicense)}>{buyer.kycDocuments.businessLicense}</span></div>
                            <div>Bank: <span className={getDocumentStatusColor(buyer.kycDocuments.bankStatement)}>{buyer.kycDocuments.bankStatement}</span></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {buyer.kycStatus === 'pending' && (
                            <div className="space-y-2">
                              <button
                                onClick={() => approveBuyer(buyer.id, true)}
                                className="block w-full bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-md text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => approveBuyer(buyer.id, false)}
                                className="block w-full bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Monitoring Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment Transactions ({filteredPayments.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.buyerName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{payment.buyerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentTypeColor(payment.paymentType)}`}>
                            {payment.paymentType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentModal(true);
                              }}
                              className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-md text-xs font-medium"
                            >
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Auction Activities Tab */}
        {activeTab === 'auctions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <select
                value={auctionFilter}
                onChange={(e) => setAuctionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Auctions</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Auctions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Auction Activities ({filteredAuctions.length})
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Commission</th>
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
                          <div>Current: ₹{auction.currentBid || auction.finalPrice}</div>
                          <div>Bids: {auction.totalBids}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{auction.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600 dark:text-purple-400">
                          ₹{auction.commission.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Buyer Approval Modal */}
      {showApprovalModal && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {approvalAction === 'approve' ? 'Approve' : 'Reject'} Buyer
                </h2>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to {approvalAction} <strong>{selectedBuyer.firstName} {selectedBuyer.lastName}</strong>?
                </p>
              </div>

              <form onSubmit={handleBuyerApproval} className="space-y-4">
                {approvalAction === 'reject' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for rejection
                    </label>
                    <textarea
                      value={approvalReason}
                      onChange={(e) => setApprovalReason(e.target.value)}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-md transition-colors duration-200 ${
                      approvalAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {approvalAction === 'approve' ? 'Approve Buyer' : 'Reject Buyer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Action Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Mark Payment Complete
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to mark the payment of <strong>₹{selectedPayment.amount.toLocaleString()}</strong> from <strong>{selectedPayment.buyerName}</strong> as complete?
                </p>
              </div>

              <form onSubmit={handlePaymentAction} className="space-y-4">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                  >
                    Mark Complete
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

export default FarmerAdminDashboard;

