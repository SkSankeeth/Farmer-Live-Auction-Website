import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AnalyticsDashboard = ({ userType, analytics, payments, auctions }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data based on user type
  const getMockAnalytics = () => {
    const baseData = {
      farmer: {
        totalRevenue: 125000,
        monthlyRevenue: 45000,
        totalAuctions: 24,
        activeAuctions: 8,
        completedAuctions: 16,
        averageBidPrice: 8500,
        totalBids: 156,
        conversionRate: 68.5,
        topProduct: 'Fresh Tomatoes',
        topProductRevenue: 25000,
        recentActivity: [
          { type: 'auction_created', message: 'Created auction for Organic Wheat', timestamp: '2 hours ago' },
          { type: 'bid_received', message: 'Received bid of ₹12,000 for Fresh Tomatoes', timestamp: '4 hours ago' },
          { type: 'payment_received', message: 'Payment of ₹18,500 received', timestamp: '1 day ago' }
        ],
        charts: {
          revenue: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [15000, 22000, 18000, 35000, 28000, 45000]
          },
          auctions: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [3, 5, 4, 6]
          }
        }
      },
      buyer: {
        totalSpent: 89000,
        monthlySpent: 25000,
        totalBids: 45,
        wonAuctions: 12,
        lostAuctions: 33,
        averageBidAmount: 5200,
        successRate: 26.7,
        favoriteCategory: 'Grains',
        totalSavings: 15000,
        recentActivity: [
          { type: 'bid_placed', message: 'Placed bid of ₹15,000 on Wheat auction', timestamp: '1 hour ago' },
          { type: 'auction_won', message: 'Won auction for Fresh Vegetables', timestamp: '3 hours ago' },
          { type: 'payment_made', message: 'Made payment of ₹22,000', timestamp: '2 days ago' }
        ],
        charts: {
          spending: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [8000, 12000, 15000, 18000, 22000, 25000]
          },
          bids: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [8, 12, 10, 15]
          }
        }
      },
      farmer_admin: {
        totalCommission: 12500,
        monthlyCommission: 4500,
        totalUsers: 156,
        activeUsers: 89,
        pendingApprovals: 12,
        totalAuctions: 89,
        totalTransactions: 234,
        averageTransactionValue: 8500,
        platformGrowth: 15.2,
        recentActivity: [
          { type: 'user_approved', message: 'Approved buyer John Doe', timestamp: '30 minutes ago' },
          { type: 'payment_processed', message: 'Processed payment of ₹45,000', timestamp: '2 hours ago' },
          { type: 'dispute_resolved', message: 'Resolved payment dispute', timestamp: '1 day ago' }
        ],
        charts: {
          commission: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [2000, 3200, 2800, 4500, 3800, 4500]
          },
          users: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [12, 18, 15, 22]
          }
        }
      },
      super_admin: {
        totalRevenue: 250000,
        monthlyRevenue: 85000,
        totalUsers: 1250,
        activeUsers: 890,
        totalAuctions: 456,
        totalTransactions: 1234,
        platformCommission: 25000,
        systemUptime: 99.8,
        averageResponseTime: 1.2,
        recentActivity: [
          { type: 'system_alert', message: 'High server load detected', timestamp: '1 hour ago' },
          { type: 'user_registered', message: '25 new users registered today', timestamp: '3 hours ago' },
          { type: 'payment_processed', message: 'Processed ₹125,000 in payments', timestamp: '6 hours ago' }
        ],
        charts: {
          revenue: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [35000, 45000, 52000, 68000, 75000, 85000]
          },
          users: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [45, 62, 58, 78]
          }
        }
      },
      transporter: {
        totalEarnings: 45000,
        monthlyEarnings: 15000,
        completedJobs: 156,
        activeJobs: 8,
        averageRating: 4.5,
        totalDistance: 12500,
        totalCommission: 2250,
        pendingPayments: 5000,
        recentActivity: [
          { type: 'job_assigned', message: 'Assigned transport job for Fresh Milk', timestamp: '2 hours ago' },
          { type: 'delivery_completed', message: 'Completed delivery to Mumbai', timestamp: '5 hours ago' },
          { type: 'payment_received', message: 'Received payment of ₹3,500', timestamp: '1 day ago' }
        ],
        charts: {
          earnings: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [8000, 12000, 10000, 15000, 13000, 15000]
          },
          jobs: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [18, 25, 22, 28]
          }
        }
      }
    };

    return baseData[userType] || baseData.farmer;
  };

  const analyticsData = analytics || getMockAnalytics();

  const getMetricCards = () => {
    const cards = {
      farmer: [
        { title: 'Total Revenue', value: `₹${analyticsData.totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: '💰' },
        { title: 'Active Auctions', value: analyticsData.activeAuctions, change: '+2', trend: 'up', icon: '🏷️' },
        { title: 'Conversion Rate', value: `${analyticsData.conversionRate}%`, change: '+5.2%', trend: 'up', icon: '📈' },
        { title: 'Total Bids', value: analyticsData.totalBids, change: '+18', trend: 'up', icon: '🎯' }
      ],
      buyer: [
        { title: 'Total Spent', value: `₹${analyticsData.totalSpent.toLocaleString()}`, change: '+8.3%', trend: 'up', icon: '💳' },
        { title: 'Won Auctions', value: analyticsData.wonAuctions, change: '+3', trend: 'up', icon: '🏆' },
        { title: 'Success Rate', value: `${analyticsData.successRate}%`, change: '+2.1%', trend: 'up', icon: '📊' },
        { title: 'Total Savings', value: `₹${analyticsData.totalSavings.toLocaleString()}`, change: '+15.7%', trend: 'up', icon: '💡' }
      ],
      farmer_admin: [
        { title: 'Total Commission', value: `₹${analyticsData.totalCommission.toLocaleString()}`, change: '+18.2%', trend: 'up', icon: '💼' },
        { title: 'Active Users', value: analyticsData.activeUsers, change: '+12', trend: 'up', icon: '👥' },
        { title: 'Pending Approvals', value: analyticsData.pendingApprovals, change: '-3', trend: 'down', icon: '⏳' },
        { title: 'Platform Growth', value: `${analyticsData.platformGrowth}%`, change: '+2.3%', trend: 'up', icon: '🚀' }
      ],
      super_admin: [
        { title: 'Total Revenue', value: `₹${analyticsData.totalRevenue.toLocaleString()}`, change: '+22.1%', trend: 'up', icon: '💰' },
        { title: 'Total Users', value: analyticsData.totalUsers, change: '+45', trend: 'up', icon: '👥' },
        { title: 'System Uptime', value: `${analyticsData.systemUptime}%`, change: '+0.2%', trend: 'up', icon: '⚡' },
        { title: 'Platform Commission', value: `₹${analyticsData.platformCommission.toLocaleString()}`, change: '+15.8%', trend: 'up', icon: '💼' }
      ],
      transporter: [
        { title: 'Total Earnings', value: `₹${analyticsData.totalEarnings.toLocaleString()}`, change: '+14.6%', trend: 'up', icon: '💰' },
        { title: 'Completed Jobs', value: analyticsData.completedJobs, change: '+8', trend: 'up', icon: '✅' },
        { title: 'Average Rating', value: analyticsData.averageRating, change: '+0.2', trend: 'up', icon: '⭐' },
        { title: 'Total Distance', value: `${analyticsData.totalDistance.toLocaleString()} km`, change: '+1250', trend: 'up', icon: '🛣️' }
      ]
    };

    return cards[userType] || cards.farmer;
  };

  const getChartData = () => {
    const chartType = selectedMetric === 'revenue' ? 'revenue' : 
                     selectedMetric === 'earnings' ? 'earnings' :
                     selectedMetric === 'spending' ? 'spending' :
                     selectedMetric === 'commission' ? 'commission' : 'revenue';
    
    return analyticsData.charts[chartType] || analyticsData.charts.revenue;
  };

  const getRecentActivity = () => {
    return analyticsData.recentActivity || [];
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'auction_created': return '🏷️';
      case 'bid_received': return '💰';
      case 'bid_placed': return '🎯';
      case 'auction_won': return '🏆';
      case 'payment_received': return '💳';
      case 'payment_made': return '💸';
      case 'user_approved': return '✅';
      case 'payment_processed': return '⚡';
      case 'dispute_resolved': return '🔧';
      case 'system_alert': return '⚠️';
      case 'user_registered': return '👤';
      case 'job_assigned': return '🚚';
      case 'delivery_completed': return '📦';
      default: return '📢';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'auction_created':
      case 'bid_received':
      case 'auction_won':
      case 'payment_received':
      case 'user_approved':
      case 'delivery_completed':
        return 'text-green-600 dark:text-green-400';
      case 'bid_placed':
      case 'payment_made':
      case 'job_assigned':
        return 'text-blue-600 dark:text-blue-400';
      case 'system_alert':
      case 'dispute_resolved':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="revenue">Revenue</option>
            <option value="earnings">Earnings</option>
            <option value="spending">Spending</option>
            <option value="commission">Commission</option>
            <option value="auctions">Auctions</option>
            <option value="users">Users</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetricCards().map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                card.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {card.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedMetric === 'revenue' ? 'Revenue Trend' :
             selectedMetric === 'earnings' ? 'Earnings Trend' :
             selectedMetric === 'spending' ? 'Spending Trend' :
             selectedMetric === 'commission' ? 'Commission Trend' :
             selectedMetric === 'auctions' ? 'Auctions Created' :
             'User Growth'}
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Data: {getChartData().data.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {getRecentActivity().map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products/Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {userType === 'farmer' ? 'Top Products' : 
             userType === 'buyer' ? 'Favorite Categories' :
             'Top Categories'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {userType === 'farmer' ? analyticsData.topProduct : 'Grains'}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {userType === 'farmer' ? `₹${analyticsData.topProductRevenue.toLocaleString()}` : '45%'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Vegetables</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fruits</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">23%</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-gray-900 dark:text-white">
                  {analyticsData.averageResponseTime || 1.2}s
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                <span className="text-gray-900 dark:text-white">
                  {analyticsData.successRate || analyticsData.conversionRate || 95}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analyticsData.successRate || analyticsData.conversionRate || 95}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">User Satisfaction</span>
                <span className="text-gray-900 dark:text-white">
                  {analyticsData.averageRating || 4.5}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(analyticsData.averageRating || 4.5) * 20}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {userType === 'farmer' ? `₹${analyticsData.monthlyRevenue.toLocaleString()}` :
                 userType === 'buyer' ? `₹${analyticsData.monthlySpent.toLocaleString()}` :
                 userType === 'farmer_admin' ? `₹${analyticsData.monthlyCommission.toLocaleString()}` :
                 userType === 'super_admin' ? `₹${analyticsData.monthlyRevenue.toLocaleString()}` :
                 `₹${analyticsData.monthlyEarnings.toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +{analyticsData.platformGrowth || 15.2}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Now</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {analyticsData.activeUsers || analyticsData.activeAuctions || analyticsData.activeJobs || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;





