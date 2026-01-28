import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { withApiBase } from '../utils/apiClient';
import ThemeToggle from './ThemeToggle';
import NotificationSystem from './NotificationSystem';
import { MobileBottomNav, MobileFloatingAction } from './MobileOptimized';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  console.log('Header - isAuthenticated:', isAuthenticated, 'user:', user);

  // Handle scroll effect and mobile detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Check initial size
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowDropdown(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 dark:from-green-800 dark:via-emerald-700 dark:to-teal-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 border border-white/20 dark:border-gray-700/20">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  🌾
                </span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-1000 shadow-lg"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-2xl font-bold transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-white'
              }`}>
                Only<span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Farmers</span>
              </h1>
              <p className={`text-sm font-medium transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-600 dark:text-gray-400' 
                  : 'text-green-100'
              }`}>
                🚀 Future of Agriculture
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative group transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              <span className="font-medium">Home</span>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </Link>
            
            <Link 
              to="/auctions" 
              className={`relative group transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              <span className="font-medium">Live Auctions</span>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </Link>
            
            <Link 
              to="/farmers" 
              className={`relative group transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              <span className="font-medium">Farmers</span>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </Link>
            
            <Link 
              to="/buyers" 
              className={`relative group transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              <span className="font-medium">Buyers</span>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </Link>
            
            <Link 
              to="/contact" 
              className={`relative group transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              <span className="font-medium">Contact</span>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {isAuthenticated && (
              <NotificationSystem userType={user?.userType} />
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick Dashboard Button removed: avatar acts as entry with dropdown */}

            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 backdrop-blur-sm' 
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                  }`}
                >
                  {user?.profileImage ? (
                    <img src={withApiBase(user.profileImage)} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-semibold">
                    {user?.firstName || user?.email?.split('@')[0]}
                  </span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-3 z-50">
                    <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{getGreeting()},</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{user?.firstName || user?.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">{user?.userType?.replace('_', ' ')}</p>
                    </div>
                    
                    <div className="py-2">
                      {user?.userType === 'farmer' && (
                        <Link 
                          to="/farmer-dashboard" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="text-xl">📊</span>
                          <span className="font-medium">Farmer Dashboard</span>
                        </Link>
                      )}
                      {user?.userType === 'farmer' && (
                        <Link 
                          to="/farmer-dashboard?account=settings"
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="text-xl">⚙️</span>
                          <span className="font-medium">Account Settings</span>
                        </Link>
                      )}
                      {user?.userType === 'buyer' && (
                        <Link 
                          to="/buyer-dashboard" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="text-xl">🛒</span>
                          <span className="font-medium">Buyer Dashboard</span>
                        </Link>
                      )}
                      {user?.userType === 'super_admin' && (
                        <Link 
                          to="/super-admin-dashboard" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="text-xl">👑</span>
                          <span className="font-medium">Super Admin Dashboard</span>
                        </Link>
                      )}
                      {user?.userType === 'farmer_admin' && (
                        <Link 
                          to="/farmer-admin-dashboard" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="text-xl">⚙️</span>
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      )}
                      {user?.userType === 'transporter' && (
                        <Link 
                          to="/transporter-dashboard" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 transition-all duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="text-xl">🚚</span>
                          <span className="font-medium">Transporter Dashboard</span>
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-4 px-5 py-3 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 w-full font-medium"
                      >
                        <span className="text-xl">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                {/* Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-lg">🔐</span>
                    <span className="font-semibold">Login</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${showLoginDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* Login Dropdown Menu */}
                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-3 z-50">
                      <div className="px-5 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                        <p className="font-bold text-gray-900 dark:text-white">Choose Your Role</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Select your account type</p>
                      </div>
                      
                      <div className="py-2 space-y-1">
                        <Link 
                          to="/farmer-login" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                          onClick={() => setShowLoginDropdown(false)}
                        >
                          <span className="text-xl">👨‍🌾</span>
                          <div>
                            <span className="font-semibold block">Farmer</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Sell your produce</span>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/buyer-login" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300"
                          onClick={() => setShowLoginDropdown(false)}
                        >
                          <span className="text-xl">🛒</span>
                          <div>
                            <span className="font-semibold block">Buyer</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Buy fresh produce</span>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/farmer-admin-login" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 transition-all duration-300"
                          onClick={() => setShowLoginDropdown(false)}
                        >
                          <span className="text-xl">⚙️</span>
                          <div>
                            <span className="font-semibold block">Admin</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Manage operations</span>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/super-admin-login" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 dark:hover:from-pink-900/20 dark:hover:to-rose-900/20 transition-all duration-300"
                          onClick={() => setShowLoginDropdown(false)}
                        >
                          <span className="text-xl">👑</span>
                          <div>
                            <span className="font-semibold block">Super Admin</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">System management</span>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/transporter-login" 
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 dark:hover:from-orange-900/20 dark:hover:to-amber-900/20 transition-all duration-300"
                          onClick={() => setShowLoginDropdown(false)}
                        >
                          <span className="text-xl">🚚</span>
                          <div>
                            <span className="font-semibold block">Transporter</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Provide logistics</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Get Started Button */}
                <Link 
                  to="/farmer-register" 
                  className={`px-5 py-3 rounded-2xl transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                  }`}
                >
                  <span className="font-semibold">Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`lg:hidden p-3 rounded-2xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 backdrop-blur-sm' 
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-3 pt-3 pb-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-b-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <Link 
                to="/" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium">Home</span>
              </Link>
              <Link 
                to="/auctions" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium">Live Auctions</span>
              </Link>
              <Link 
                to="/farmers" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium">Farmers</span>
              </Link>
              <Link 
                to="/buyers" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium">Buyers</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium">Contact</span>
              </Link>
              
              {!isAuthenticated && (
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 mt-4 space-y-3">
                  <div className="px-4 py-2">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Login Options</p>
                  </div>
                  <Link 
                    to="/farmer-login" 
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Farmer Login</span>
                  </Link>
                  <Link 
                    to="/buyer-login" 
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Buyer Login</span>
                  </Link>
                  <Link 
                    to="/farmer-admin-login" 
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Admin Login</span>
                  </Link>
                  <Link 
                    to="/super-admin-login" 
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Super Admin</span>
                  </Link>
                  <Link 
                    to="/transporter-login" 
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Transporter Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showDropdown || showLoginDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowDropdown(false);
            setShowLoginDropdown(false);
          }}
        />
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && isAuthenticated && (
        <MobileBottomNav
          items={[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'auctions', icon: '⚡', label: 'Auctions' },
            { id: 'farmers', icon: '👨‍🌾', label: 'Farmers' },
            { id: 'buyers', icon: '🛒', label: 'Buyers' },
            { id: 'profile', icon: '👤', label: 'Profile' }
          ]}
          activeItem="home"
          onItemClick={(itemId) => {
            // Handle navigation
            if (itemId === 'home') window.location.href = '/';
            else if (itemId === 'auctions') window.location.href = '/auctions';
            else if (itemId === 'farmers') window.location.href = '/farmers';
            else if (itemId === 'buyers') window.location.href = '/buyers';
            else if (itemId === 'profile') {
              // Show profile dropdown
              setShowDropdown(true);
            }
          }}
        />
      )}

      {/* Mobile Floating Action Button */}
      {isMobile && isAuthenticated && (
        <MobileFloatingAction
          icon="➕"
          onClick={() => {
            // Handle FAB click - could open quick actions menu
            console.log('FAB clicked');
          }}
        />
      )}
    </header>
  );
};

export default Header;
