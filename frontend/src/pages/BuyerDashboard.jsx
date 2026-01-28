import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import TransportRequest from '../components/TransportRequest';
import { withApiBase } from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import AuctionBidding from '../components/AuctionBidding';
import PaymentSystem from '../components/PaymentSystem';
import FinancialDashboard from '../components/FinancialDashboard';
import { connectRealtime } from '../utils/realtime';

const BuyerDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  // Dashboard states
  const [loading, setLoading] = useState(true);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [escrowBalance, setEscrowBalance] = useState(0);
  
  // Profile setup states
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: { street: '', city: '', state: '', pincode: '' },
    businessInfo: { businessName: '', businessType: 'retailer', gstNumber: '', panNumber: '', bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' } }
  });
  
  // KYC states
  const [kycDocuments, setKycDocuments] = useState({
    panCard: null,
    aadharCard: null,
    businessLicense: null,
    bankStatement: null
  });
  
  // Escrow states
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowAmount, setEscrowAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  
  // Auction participation & payment states
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  // Transport request states
  const [showTransportRequest, setShowTransportRequest] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // KYC document upload states
  const [showKycModal, setShowKycModal] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    panCard: null,
    aadharCard: null,
    businessLicense: null,
    bankStatement: null
  });

  // Check authentication and initialize dashboard
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/buyer-login');
      return;
    }
    
    if (user.userType !== 'buyer') {
      navigate('/');
      return;
    }
    
    initializeDashboard();
    // Realtime updates
    (async () => {
      try {
        const s = await connectRealtime('http://localhost:5000');
        s.on('auction:bid', (payload) => {
          setLiveAuctions((prev) => prev.map(a => a.id === payload.auctionId ? { ...a, currentBid: payload.amount, totalBids: (a.totalBids||0)+1 } : a));
        });
        s.on('auction:created', (auction) => {
          setLiveAuctions((prev) => [auction, ...prev]);
        });
        s.on('escrow:updated', (data) => {
          if (data?.buyerId === user?.id) setEscrowBalance(data.balance || 0);
        });
      } catch {}
    })();
  }, [isAuthenticated, user, navigate]);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch buyer profile
      const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setBuyerProfile(profileData.user);
        setProfileForm({
          firstName: profileData.user.firstName || '',
          lastName: profileData.user.lastName || '',
          phone: profileData.user.phone || '',
          address: {
            street: profileData.user.address?.street || '',
            city: profileData.user.address?.city || '',
            state: profileData.user.address?.state || '',
            pincode: profileData.user.address?.pincode || ''
          },
          businessInfo: {
            businessName: profileData.user.businessInfo?.businessName || '',
            businessType: profileData.user.businessInfo?.businessType || 'retailer',
            gstNumber: profileData.user.businessInfo?.gstNumber || '',
            panNumber: profileData.user.businessInfo?.panNumber || '',
            bankDetails: {
              accountNumber: profileData.user.businessInfo?.bankDetails?.accountNumber || '',
              ifscCode: profileData.user.businessInfo?.bankDetails?.ifscCode || '',
              bankName: profileData.user.businessInfo?.bankDetails?.bankName || '',
              accountHolderName: profileData.user.businessInfo?.bankDetails?.accountHolderName || ''
            }
          }
        });
        setIsProfileComplete(profileData.user.isProfileComplete || false);
        setIsApproved(!!(profileData.user.verification?.isVerified));
        setEscrowBalance(profileData.user.escrowBalance || 0);
      } else {
        console.error('Failed to fetch buyer profile');
        // Fallback to mock data
        setBuyerProfile(getMockProfile());
        setIsProfileComplete(true);
        setIsApproved(true);
        setEscrowBalance(25000);
      }

      // Fetch live auctions
      const auctionsResponse = await fetch('http://localhost:5000/api/auctions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (auctionsResponse.ok) {
        const auctionsData = await auctionsResponse.json();
        setLiveAuctions(auctionsData.auctions || []);
      } else {
        console.error('Failed to fetch auctions');
        // Fallback to mock data
        setLiveAuctions(getMockAuctions());
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      // Fallback to mock data
      setBuyerProfile(getMockProfile());
      setIsProfileComplete(true);
      setIsApproved(true);
      setEscrowBalance(25000);
      setLiveAuctions(getMockAuctions());
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        address: profileForm.address,
        businessInfo: profileForm.businessInfo
      };
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) setShowProfileForm(false);
    } catch (e) {
      console.error('Failed to save buyer profile', e);
    }
  };

  const getMockProfile = () => {
    return {
      id: 'buyer-1',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Fresh Foods Ltd',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      businessType: 'Food Processing',
      annualTurnover: '₹50,00,000',
      description: 'Leading food processing company in Mumbai',
      isProfileComplete: true,
      isApproved: true,
      escrowBalance: 25000,
      kycStatus: 'approved'
    };
  };

  const getMockAuctions = () => {
    return [
      {
        id: '1',
        productName: 'Fresh Tomatoes',
        category: 'vegetables',
        quantity: 50,
        basePrice: 25.00,
        currentBid: 28.50,
        totalBids: 5,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        farmerName: 'Rajesh Kumar',
        location: 'Pune, Maharashtra',
        imageUrl: null,
        description: 'Fresh organic tomatoes from our farm'
      },
      {
        id: '2',
        productName: 'Wheat Grain',
        category: 'grains',
        quantity: 100,
        basePrice: 45.00,
        currentBid: 47.25,
        totalBids: 3,
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        farmerName: 'Suresh Patel',
        location: 'Ahmedabad, Gujarat',
        imageUrl: null,
        description: 'High-quality wheat grain'
      }
    ];
  };

  const handleProfileInputChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileImagePreview) {
      alert('Please upload a profile picture.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profileForm,
          profileImage: profileImagePreview,
          isProfileComplete: true,
          kycStatus: 'pending'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBuyerProfile(data.user);
        setIsProfileComplete(true);
        setShowProfileForm(false);
        alert('Profile submitted successfully! Waiting for admin approval.');
      } else {
        const errorData = await response.json();
        alert(`Error updating profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleEscrowDeposit = async (e) => {
    e.preventDefault();
    setDepositing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/escrow/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(escrowAmount) })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to deposit');
      }
      setEscrowBalance(data.balance || 0);
      setShowEscrowModal(false);
      setEscrowAmount('');
      toast.success(`Successfully deposited ₹${escrowAmount} to escrow account!`);
    } catch (err) {
      toast.error(err.message || 'Error depositing to escrow');
    } finally {
      setDepositing(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidding(true);
    // Mock bid submit
    setTimeout(() => {
      const updated = liveAuctions.map(auction => auction.id === selectedAuction.id ? { ...auction, currentBid: parseFloat(bidAmount), totalBids: auction.totalBids + 1 } : auction);
      setLiveAuctions(updated);
      setShowBidModal(false);
      setBidAmount('');
      setBidding(false);
      alert(`Bid of ₹${bidAmount} submitted successfully!`);
    }, 1200);
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700" role="banner" aria-label="Buyer dashboard header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Buyer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back{buyerProfile?.firstName ? `, ${buyerProfile.firstName} ${buyerProfile?.lastName || ''}` : ''}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isApproved && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Escrow Balance:</span>
                  <span className="text-lg font-semibold text-green-600">₹{escrowBalance.toLocaleString()}</span>
                  <button
                    onClick={() => setShowEscrowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                    aria-label="Deposit to escrow"
                  >
                    Deposit
                  </button>
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Go to Home page"
              >
                Home
              </button>
              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu ? 'true' : 'false'}
                  aria-label="Account menu"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {buyerProfile?.firstName?.[0]?.toUpperCase() || buyerProfile?.email?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'B'}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">{buyerProfile?.firstName || 'Buyer'}</span>
                  <svg className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showUserMenu && (
                  <div role="menu" className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                    <button
                      onClick={() => { setShowUserMenu(false); setShowProfileForm(true); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Account Settings
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); logout(); navigate('/'); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Buyer Profile Card */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Profile image */}
                  <div className="shrink-0">
                    <img
                      src={withApiBase(buyerProfile?.profileImage) || 'https://via.placeholder.com/96'}
                      alt="Buyer profile"
                      className="w-24 h-24 rounded-2xl object-cover ring-2 ring-blue-500/20"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {buyerProfile?.firstName || 'Buyer'} {buyerProfile?.lastName || ''}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{buyerProfile?.email || user?.email}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{buyerProfile?.address?.city || 'City'}, {buyerProfile?.address?.state || 'State'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {isApproved && (
                          <button onClick={() => setShowEscrowModal(true)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow">
                            Deposit Escrow
                          </button>
                        )}
                        <button onClick={() => setShowProfileForm(true)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          Edit Profile
                        </button>
                        <button onClick={() => navigate('/')} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          Go Home
                        </button>
                      </div>
                    </div>

                    {/* Escrow and status */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Approval</p>
                        <p className={`font-semibold ${isApproved ? 'text-green-600' : 'text-yellow-600'}`}>{isApproved ? 'Approved' : 'Pending'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Escrow Balance</p>
                        <p className="font-semibold text-blue-600">₹{escrowBalance.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Live Auctions</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{liveAuctions?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bids Today</p>
                        <p className="font-semibold text-gray-900 dark:text-white">—</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 h-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => navigate('/auctions')} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow">
                  <span>⚡</span>
                  <span>Explore Live Auctions</span>
                </button>
                <button onClick={() => setShowProfileForm(true)} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <span>🖊️</span>
                  <span>Update Profile</span>
                </button>
                <button onClick={() => navigate('/')} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <span>🏠</span>
                  <span>Go to Home</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* Profile Status */}
        {!isProfileComplete && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Profile Setup Required
                </h3>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                  Please complete your profile and upload KYC documents to start bidding on auctions.
                </p>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {isProfileComplete && !isApproved && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Awaiting Approval
                </h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  Your profile has been submitted and is under review by the Farmer's Admin. You'll be notified once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information */}
        {buyerProfile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Personal Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {buyerProfile.firstName} {buyerProfile.lastName}</p>
                    <p><span className="font-medium">Company:</span> {buyerProfile.companyName}</p>
                    <p><span className="font-medium">Phone:</span> {buyerProfile.phone}</p>
                    <p><span className="font-medium">Location:</span> {buyerProfile.location}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Business Type:</span> {buyerProfile.businessType}</p>
                    <p><span className="font-medium">Annual Turnover:</span> {buyerProfile.annualTurnover}</p>
                    <p><span className="font-medium">KYC Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(buyerProfile.kycStatus)}`}>
                        {buyerProfile.kycStatus}
                      </span>
                    </p>
                    <p><span className="font-medium">Approval Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(isApproved ? 'approved' : 'pending')}`}>
                        {isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        {isApproved && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('auctions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'auctions'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Live Auctions
                </button>
                <button
                  onClick={() => setActiveTab('escrow')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'escrow'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Escrow Account
                </button>
                <button
                  onClick={() => setActiveTab('transport')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transport'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Transport
                </button>
                <button
                  onClick={() => setActiveTab('kyc')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'kyc'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  KYC Documents
                </button>
                <button
                  onClick={() => setActiveTab('financials')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'financials'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Financial Overview
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {isApproved && activeTab === 'auctions' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Auctions ({liveAuctions.length})
              </h2>
            </div>
            
            {liveAuctions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No live auctions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new auctions from farmers.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {liveAuctions.map((auction) => (
                  <div key={auction.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {auction.productName}
                          </h3>
                          <span className="text-sm text-red-600 font-medium">
                            {getTimeRemaining(auction.endDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Farmer: {auction.farmerName} • Location: {auction.location}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {auction.quantity} • Category: {auction.category}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Base Price: <span className="font-medium">₹{auction.basePrice}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Current Bid: <span className="font-medium text-green-600">₹{auction.currentBid}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total Bids: <span className="font-medium">{auction.totalBids}</span>
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              if (!isApproved) {
                                alert('Your account is not approved yet.');
                                return;
                              }
                              if (!escrowBalance || escrowBalance <= 0) {
                                alert('Please deposit security money into escrow to participate.');
                                setActiveTab('escrow');
                                return;
                              }
                              setSelectedAuction(auction);
                              setBidAmount((auction.currentBid + 1).toString());
                              setShowBidModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                          >
                            Place Bid
                          </button>
                            <button
                              onClick={() => {
                                setSelectedAuction(auction);
                                setShowPayment(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                              Pay Now
                          </button>
                          </div>
                        </div>
                        {auction.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {auction.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Escrow Account Tab */}
        {isApproved && activeTab === 'escrow' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Escrow Account
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  ₹{escrowBalance.toLocaleString()}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Available balance for auction participation
                </p>
                <button
                  onClick={() => setShowEscrowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-200"
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transport Tab */}
        {isApproved && activeTab === 'transport' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transport Services
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Request Transport
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Need transport for your won auctions? Request transport services from our network of transporters.
                </p>
                <button
                  onClick={() => setShowTransportRequest(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md transition-colors duration-200"
                >
                  Request Transport
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KYC Documents Tab */}
        {isApproved && activeTab === 'kyc' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                KYC Document Management
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'panCard', name: 'PAN Card', required: true },
                  { key: 'aadharCard', name: 'Aadhar Card', required: true },
                  { key: 'businessLicense', name: 'Business License', required: true },
                  { key: 'bankStatement', name: 'Bank Statement', required: true }
                ].map((doc) => (
                  <div key={doc.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        uploadedDocs[doc.key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {uploadedDocs[doc.key] ? 'Uploaded' : 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {uploadedDocs[doc.key] ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>File: {uploadedDocs[doc.key].name}</p>
                          <p>Size: {(uploadedDocs[doc.key].size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          No document uploaded
                        </div>
                      )}
                      <button
                        onClick={() => setShowKycModal(true)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        {uploadedDocs[doc.key] ? 'Replace Document' : 'Upload Document'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Overview Tab */}
        {isApproved && activeTab === 'financials' && (
          <div className="space-y-6">
            <FinancialDashboard
              userType="buyer"
              analytics={{
                totalSpent: 125000,
                monthlySpent: 25000,
                escrowBalance: escrowBalance,
                totalBids: 45,
                wonAuctions: 12,
                averageBid: 2800
              }}
              payments={[]}
              auctions={liveAuctions}
            />
          </div>
        )}
      </main>

      {/* Profile Setup Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={()=>setShowProfileForm(false)} onKeyDown={(e)=>{ if(e.key==='Escape') setShowProfileForm(false); }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Complete profile" tabIndex={-1} onClick={(e)=>e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Complete Your Profile
                </h2>
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Profile picture - mandatory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    aria-required="true"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      try {
                        const token = localStorage.getItem('token');
                        const form = new FormData();
                        form.append('image', file);
                        const resp = await fetch('http://localhost:5000/api/uploads/profile', {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` },
                          body: form
                        });
                        const data = await resp.json();
                        if (!resp.ok || !data.success) throw new Error(data.message || 'Upload failed');
                        setProfileImagePreview(data.imageUrl);
                      } catch (err) {
                        toast.error(err.message || 'Failed to upload profile image');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {profileImagePreview && (
                    <img src={profileImagePreview} alt="Profile preview" className="mt-2 h-16 w-16 rounded-full object-cover" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={profileForm.companyName}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={profileForm.businessType}
                      onChange={handleProfileInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select business type</option>
                      <option value="Food Processing">Food Processing</option>
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Export">Export</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Annual Turnover *
                  </label>
                  <input
                    type="text"
                    name="annualTurnover"
                    value={profileForm.annualTurnover}
                    onChange={handleProfileInputChange}
                    required
                    placeholder="e.g., ₹50,00,000"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Description
                  </label>
                  <textarea
                    name="description"
                    value={profileForm.description}
                    onChange={handleProfileInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  >
                    Submit Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Deposit Modal */}
      {showEscrowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Deposit to Escrow
                </h2>
                <button
                  onClick={() => setShowEscrowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEscrowDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={escrowAmount}
                    onChange={(e) => setEscrowAmount(e.target.value)}
                    required
                    min="1000"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter amount"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current Balance: ₹{escrowBalance.toLocaleString()}
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEscrowModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={depositing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  >
                    {depositing ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transport Request Modal */}
      {showTransportRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Request Transport
                </h3>
                <button
                  onClick={() => setShowTransportRequest(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <TransportRequest onClose={() => setShowTransportRequest(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && selectedAuction && (
        <AuctionBidding
          auction={{
            productName: selectedAuction.productName,
            farmerName: selectedAuction.farmerName,
            quantity: `${selectedAuction.quantity}`,
            currentBid: selectedAuction.currentBid,
            startingPrice: selectedAuction.basePrice,
            bids: selectedAuction.totalBids,
            endTime: selectedAuction.endDate,
            minIncrement: 1,
            description: selectedAuction.description,
            quality: 'Premium',
            delivery: 'Within 72 hours'
          }}
          onBidPlaced={async (amount) => {
            try {
              const token = localStorage.getItem('token');
              const response = await fetch(`http://localhost:5000/api/auctions/${selectedAuction.id}/bid`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bidAmount: amount })
              });
              const data = await response.json();
              if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to place bid');
              }
              const updated = liveAuctions.map(a => a.id === selectedAuction.id ? { ...a, currentBid: amount, totalBids: (a.totalBids || 0) + 1 } : a);
              setLiveAuctions(updated);
              setShowBidModal(false);
              alert('Bid placed successfully');
            } catch (err) {
              alert(err.message || 'Error placing bid');
            }
          }}
          onClose={() => setShowBidModal(false)}
        />
      )}

      {/* Payment Modal */}
      {showPayment && selectedAuction && (
        <PaymentSystem
          auction={{ currentBid: selectedAuction.currentBid, startingPrice: selectedAuction.basePrice }}
          onPaymentUpdate={() => setShowPayment(false)}
          userType="buyer"
        />
      )}

      {/* KYC Document Upload Modal */}
      {showKycModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upload KYC Document
                </h2>
                <button
                  onClick={() => setShowKycModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Document Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="panCard">PAN Card</option>
                    <option value="aadharCard">Aadhar Card</option>
                    <option value="businessLicense">Business License</option>
                    <option value="bankStatement">Bank Statement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowKycModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={uploadingDoc}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200"
                  >
                    {uploadingDoc ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;