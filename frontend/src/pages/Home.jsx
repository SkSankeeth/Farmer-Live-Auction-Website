import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  console.log('Home page - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-cyan-400/10 dark:from-emerald-600/20 dark:via-teal-600/20 dark:to-cyan-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Only</span>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Farmers</span>
                </h1>
                {isAuthenticated ? (
                  <>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                      Welcome back, {user?.firstName || user?.email?.split('@')[0]}!
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      Ready to continue your agricultural journey? Explore auctions, manage your listings, 
                      or discover new opportunities in the marketplace.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                      Connecting Farmers Directly to Buyers
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      Revolutionizing agricultural commerce with our innovative auction platform. 
                      Farmers sell directly to buyers, eliminating middlemen and ensuring fair prices 
                      for everyone in the supply chain.
                    </p>
                  </>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auctions"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Explore Auctions
                </Link>
                {isAuthenticated ? (
                  <Link
                    to={
                      user?.userType === 'farmer' ? '/farmer-dashboard' :
                      user?.userType === 'buyer' ? '/buyer-dashboard' :
                      user?.userType === 'super_admin' ? '/super-admin-dashboard' :
                      user?.userType === 'farmer_admin' ? '/farmer-admin-dashboard' :
                      user?.userType === 'transporter' ? '/transporter-dashboard' : '/'
                    }
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Learn More
                  </Link>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                                 <div className="text-center">
                   <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">500+</div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">Active Farmers</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">1000+</div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">Verified Buyers</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">₹50M+</div>
                   <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
                 </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Farmers working in field"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Portal Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Portal
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join the OnlyFarmers ecosystem and experience seamless agricultural commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
            {/* Farmer Card */}
            <Link 
              to="/farmer-login" 
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
              
              {/* Card Content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Farmer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  Farmer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Create auctions, sell your produce directly, and maximize your profits
                </p>
                <div className="inline-flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                  Login as Farmer
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Buyer Card */}
            <Link 
              to="/buyer-login" 
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
              
              {/* Card Content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Buyer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Buyer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Browse fresh produce, participate in auctions, and get the best deals
                </p>
                <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                  Login as Buyer
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Farmer's Admin Card */}
            <Link 
              to="/farmer-admin-login" 
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-purple-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
              
              {/* Card Content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Admin"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  Farmer's Admin
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Manage operations, approve buyers, and oversee transactions
                </p>
                <div className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                  Login as Admin
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Super Admin Card */}
            <Link 
              to="/super-admin-login" 
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 via-pink-500/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 via-pink-500/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&auto=format&fit=crop"
                    alt="Super Admin"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                  Super Admin
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Oversee platform operations, compliance, and system configurations
                </p>
                <div className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors duration-300">
                  Login as Super Admin
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Transporter Card */}
            <Link 
              to="/transporter-login" 
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-orange-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
              
              {/* Card Content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Transporter"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Transporter
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Provide transport services and earn from auction deliveries
                </p>
                <div className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">
                  Login as Transporter
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose OnlyFarmers?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of agricultural commerce with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Direct Trade"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Direct Trade
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Eliminate middlemen and connect directly with buyers. Get fair market prices 
                for your produce with transparent pricing and real-time market data.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Live Auctions"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Live Auctions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Participate in real-time auctions with live bidding. Get instant notifications 
                and track your bids with our advanced auction system.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Logistics"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Complete Logistics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                From auction to delivery, we handle everything. Transport booking, 
                real-time tracking, and secure payments all in one platform.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Security"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Escrow system ensures safe transactions. Your money is protected until 
                delivery is confirmed, providing peace of mind for all parties.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Quality"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quality Assurance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Verified farmers and quality-checked produce. Our quality assurance 
                system ensures you get the best products every time.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Support"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Round-the-clock customer support. Our dedicated team is always ready 
                to help you with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple steps to revolutionize your agricultural business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Register</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your account and complete your profile with KYC verification
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">List/Browse</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Farmers list their produce, buyers browse and find what they need
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Auction</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Participate in live auctions with real-time bidding and instant updates
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">4</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Deliver</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure payment and logistics ensure smooth delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from farmers and buyers who transformed their business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Farmer"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Rajesh Kumar</h4>
                  <p className="text-gray-600 dark:text-gray-400">Farmer, Maharashtra</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "OnlyFarmers helped me increase my profits by 40%. The direct connection 
                with buyers eliminated middlemen and I get fair prices for my produce."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Buyer"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Priya Sharma</h4>
                  <p className="text-gray-600 dark:text-gray-400">Food Processor, Delhi</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The quality of produce is excellent and the delivery is always on time. 
                OnlyFarmers has become my go-to platform for sourcing fresh ingredients."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Transporter"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Amit Patel</h4>
                  <p className="text-gray-600 dark:text-gray-400">Transporter, Gujarat</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The transport booking system is seamless. I get regular assignments 
                and the payment process is transparent and quick."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of farmers and buyers who are already benefiting from our platform. 
            Start your journey today and experience the future of agricultural commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/farmer-register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Selling
            </Link>
            <Link
              to="/buyer-register"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Buying
            </Link>
          </div>
        </div>
        </section>
      )}
    </div>
  );
};

export default Home;
