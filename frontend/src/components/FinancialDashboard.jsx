import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const FinancialDashboard = ({ userType }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [financialData, setFinancialData] = useState({
    totalEarnings: 0,
    totalCommissions: 0,
    totalPayments: 0,
    pendingPayments: 0,
    monthlyEarnings: [],
    topAuctions: [],
    recentTransactions: [],
    paymentMethods: {},
    escrowSummary: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, [timeRange, userType]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockFinancialData();
      setFinancialData(mockData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockFinancialData = () => {
    const baseData = {
      totalEarnings: 125000,
      totalCommissions: 6250,
      totalPayments: 118750,
      pendingPayments: 15000,
      monthlyEarnings: [
        { month: 'Jan', earnings: 15000, commissions: 750 },
        { month: 'Feb', earnings: 18000, commissions: 900 },
        { month: 'Mar', earnings: 22000, commissions: 1100 },
        { month: 'Apr', earnings: 19000, commissions: 950 },
        { month: 'May', earnings: 25000, commissions: 1250 },
        { month: 'Jun', earnings: 28000, commissions: 1400 }
      ],
      topAuctions: [
        { id: 1, product: 'Organic Tomatoes', amount: 15000, commission: 750, date: '2024-06-15' },
        { id: 2, product: 'Fresh Mangoes', amount: 12000, commission: 600, date: '2024-06-14' },
        { id: 3, product: 'Premium Rice', amount: 10000, commission: 500, date: '2024-06-13' },
        { id: 4, product: 'Organic Honey', amount: 8000, commission: 400, date: '2024-06-12' },
        { id: 5, product: 'Fresh Vegetables', amount: 7500, commission: 375, date: '2024-06-11' }
      ],
      recentTransactions: [
        { id: 1, type: 'payment', amount: 15000, status: 'completed', date: '2024-06-15', description: 'Organic Tomatoes Sale' },
        { id: 2, type: 'commission', amount: 750, status: 'completed', date: '2024-06-15', description: 'Platform Commission' },
        { id: 3, type: 'payment', amount: 12000, status: 'pending', date: '2024-06-14', description: 'Fresh Mangoes Sale' },
        { id: 4, type: 'refund', amount: 5000, status: 'completed', date: '2024-06-13', description: 'Quality Issue Refund' },
        { id: 5, type: 'payment', amount: 10000, status: 'completed', date: '2024-06-12', description: 'Premium Rice Sale' }
      ],
      paymentMethods: {
        upi: 45,
        netbanking: 30,
        card: 20,
        wallet: 5
      },
      escrowSummary: {
        totalHeld: 25000,
        totalReleased: 100000,
        pendingRelease: 15000,
        disputed: 2000
      }
    };

    // Adjust data based on user type
    if (userType === 'farmer') {
      return {
        ...baseData,
        totalEarnings: 118750, // Farmer gets amount minus commission
        totalCommissions: 0, // Farmers don't pay commission
        totalPayments: 118750,
        pendingPayments: 14250
      };
    } else if (userType === 'farmer_admin' || userType === 'super_admin') {
      return {
        ...baseData,
        totalEarnings: 6250, // Admin gets commission
        totalCommissions: 6250,
        totalPayments: 125000,
        pendingPayments: 15000
      };
    }

    return baseData;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    const icons = {
      payment: '💰',
      commission: '📊',
      refund: '↩️',
      withdrawal: '💸',
      deposit: '📥'
    };
    return icons[type] || '💰';
  };

  const getTransactionColor = (type) => {
    const colors = {
      payment: 'text-green-600 dark:text-green-400',
      commission: 'text-blue-600 dark:text-blue-400',
      refund: 'text-red-600 dark:text-red-400',
      withdrawal: 'text-orange-600 dark:text-orange-400',
      deposit: 'text-purple-600 dark:text-purple-400'
    };
    return colors[type] || 'text-gray-600 dark:text-gray-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Financial Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(financialData.totalEarnings)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                {userType === 'farmer' ? 'Pending Payments' : 'Total Commissions'}
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(userType === 'farmer' ? financialData.pendingPayments : financialData.totalCommissions)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Payments</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(financialData.totalPayments)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Escrow Held</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatCurrency(financialData.escrowSummary.totalHeld)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Earnings Trend
          </h3>
          <div className="space-y-4">
            {financialData.monthlyEarnings.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {month.month.slice(0, 1)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{month.month}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(month.earnings)}
                    </div>
                    {userType !== 'farmer' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Commission: {formatCurrency(month.commissions)}
                      </div>
                    )}
                  </div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${(month.earnings / Math.max(...financialData.monthlyEarnings.map(m => m.earnings))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Auctions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Auctions
          </h3>
          <div className="space-y-4">
            {financialData.topAuctions.map((auction, index) => (
              <div key={auction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{auction.product}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{auction.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(auction.amount)}
                  </div>
                  {userType !== 'farmer' && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(auction.commission)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {financialData.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === 'payment' || transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods & Escrow Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Methods Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(financialData.paymentMethods).map(([method, percentage]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {method.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {method.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escrow Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Escrow Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🔒</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total Held</span>
              </div>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {formatCurrency(financialData.escrowSummary.totalHeld)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total Released</span>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(financialData.escrowSummary.totalReleased)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">⏳</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pending Release</span>
              </div>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {formatCurrency(financialData.escrowSummary.pendingRelease)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">⚠️</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Disputed</span>
              </div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(financialData.escrowSummary.disputed)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

