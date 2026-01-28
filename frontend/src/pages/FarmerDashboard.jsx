import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, withApiBase } from '../utils/apiClient';
import AuctionStages from '../components/AuctionStages';
import { useNavigate } from 'react-router-dom';
import CreateAuction from '../components/CreateAuction';
import AuctionManagement from '../components/AuctionManagement';
import PaymentSystem from '../components/PaymentSystem';

const FarmerDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingAuction, setCreatingAuction] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', phone: '',
    address: { street: '', city: '', state: '', pincode: '' },
    farmDetails: { farmName: '', farmSize: '', farmType: 'conventional', crops: [], certification: [], establishedYear: '' },
    businessInfo: { gstNumber: '', panNumber: '', bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '' } }
  });

  const [auctionForm, setAuctionForm] = useState({
    productName: '',
    category: '',
    quantity: '',
    basePrice: '',
    duration: '',
    description: ''
  });

  // Check authentication and fetch data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/farmer-login');
      return;
    }
    
    if (user.userType !== 'farmer') {
      navigate('/');
      return;
    }
    
    fetchAuctions();
    // Seed profile form from current user
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || ''
        },
        farmDetails: {
          farmName: user.farmDetails?.farmName || '',
          farmSize: user.farmDetails?.farmSize || '',
          farmType: user.farmDetails?.farmType || 'conventional',
          crops: user.farmDetails?.crops || [],
          certification: user.farmDetails?.certification || [],
          establishedYear: user.farmDetails?.establishedYear || ''
        },
        businessInfo: {
          gstNumber: user.businessInfo?.gstNumber || '',
          panNumber: user.businessInfo?.panNumber || '',
          bankDetails: {
            accountNumber: user.businessInfo?.bankDetails?.accountNumber || '',
            ifscCode: user.businessInfo?.bankDetails?.ifscCode || '',
            bankName: user.businessInfo?.bankDetails?.bankName || '',
            accountHolderName: user.businessInfo?.bankDetails?.accountHolderName || ''
          }
        }
      });
    }
  }, [isAuthenticated, user, navigate]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const path = user?.id ? `auctions?farmerId=${encodeURIComponent(user.id)}` : 'auctions';
      const data = await apiClient.get(path);
      const mine = data.auctions || [];
      setAuctions(mine.length ? mine : getMockAuctions());
    } catch (error) {
      console.error('Error fetching auctions:', error);
      // Fallback to mock data if API fails
      setAuctions(getMockAuctions());
    } finally {
      setLoading(false);
    }
  };

  const getMockAuctions = () => {
    // Mock auction data with new stage system
    return [
      {
        id: '1',
        productName: 'Fresh Tomatoes',
        category: 'vegetables',
        quantity: 50,
        unit: 'kg',
        basePrice: 25.00,
        currentBid: 25.00,
        minIncrement: 1,
        duration: 7,
        description: 'Fresh organic tomatoes from our farm',
        status: 'active',
        stage: 'bidding',
        stageDetails: {
          bidding: {
            startTime: new Date(),
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            totalBids: 0,
            highestBid: 25.00,
            highestBidder: null
          }
        },
        createdAt: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        images: [],
        location: 'Farm Location'
      },
      {
        id: '2',
        productName: 'Wheat Grain',
        category: 'grains',
        quantity: 100,
        unit: 'kg',
        basePrice: 45.00,
        currentBid: 45.00,
        minIncrement: 1,
        duration: 14,
        description: 'High-quality wheat grain',
        status: 'active',
        stage: 'harvesting',
        stageDetails: {
          bidding: {
            startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            totalBids: 3,
            highestBid: 52.00,
            highestBidder: 'buyer123'
          },
          harvesting: {
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            completionTime: null,
            farmerNotes: 'Crop is ready for harvest',
            photos: [],
            isReady: false
          }
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        images: [],
        location: 'Farm Location',
        winner: {
          buyerId: 'buyer123',
          finalBid: 52.00,
          winningTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    ];
  };

  const handleProfileChange = (path, value) => {
    setProfileForm(prev => {
      const copy = { ...prev };
      const keys = path.split('.');
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]] ||= {};
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const saveProfile = async () => {
    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        address: profileForm.address,
        farmDetails: {
          ...profileForm.farmDetails,
          farmSize: Number(profileForm.farmDetails.farmSize || 0),
          crops: Array.isArray(profileForm.farmDetails.crops) ? profileForm.farmDetails.crops : String(profileForm.farmDetails.crops || '').split(',').map(s=>s.trim()).filter(Boolean),
          certification: Array.isArray(profileForm.farmDetails.certification) ? profileForm.farmDetails.certification : String(profileForm.farmDetails.certification || '').split(',').map(s=>s.trim()).filter(Boolean),
          establishedYear: Number(profileForm.farmDetails.establishedYear || new Date().getFullYear())
        },
        businessInfo: profileForm.businessInfo
      };
      const result = await apiClient.put('auth/profile', payload);
      if (result?.message) setShowEditProfile(false);
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setAuctionForm({
      ...auctionForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setCreatingAuction(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add form fields
      formData.append('productName', auctionForm.productName);
      formData.append('category', auctionForm.category);
      formData.append('quantity', auctionForm.quantity);
      formData.append('unit', 'kg');
      formData.append('basePrice', auctionForm.basePrice);
      formData.append('minIncrement', '1');
      formData.append('duration', auctionForm.duration);
      formData.append('description', auctionForm.description);
      formData.append('location', 'Farm Location');
      
      // Add image if selected
      if (imageFile) {
        formData.append('images', imageFile);
      }

      const response = await fetch('http://localhost:5000/api/auctions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh auctions list
        fetchAuctions();
        setShowCreateForm(false);
        setAuctionForm({
          productName: '',
          category: '',
          quantity: '',
          basePrice: '',
          duration: '',
          description: ''
        });
        setImageFile(null);
        setImagePreview(null);
        alert('Auction created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error creating auction: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Error creating auction. Please try again.');
    } finally {
      setCreatingAuction(false);
    }
  };

  const handleStageUpdate = async (stage, stageData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/auctions/${selectedAuction.id}/stage`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stage,
          stageData
        })
      });

      if (response.ok) {
        // Refresh auctions list
        fetchAuctions();
        alert(`Auction stage updated to ${stage} successfully!`);
      } else {
        const errorData = await response.json();
        alert(`Error updating stage: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Error updating stage. Please try again.');
    }
  };

  const handleMockStageUpdate = async (stage, stageData) => {
    try {
      // Fallback: Update mock auction stage
      const updatedAuctions = auctions.map(auction => {
        if (auction.id === selectedAuction?.id) {
          return {
            ...auction,
            stage,
            stageDetails: {
              ...auction.stageDetails,
              [stage]: {
                ...auction.stageDetails[stage],
                ...stageData,
                updatedAt: new Date()
              }
            }
          };
        }
        return auction;
      });
      
      setAuctions(updatedAuctions);
      alert(`Auction moved to ${stage} stage successfully!`);
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Failed to update stage');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'ended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
                Farmer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back{user?.firstName ? `, ${user.firstName} ${user?.lastName || ''}` : ''}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = '/')}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Create New Auction
              </button>
              <button
                onClick={() => setShowEditProfile(true)}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cover/Profile Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-56 md:h-72 w-full">
            <img
              src={withApiBase(user?.farmDetails?.farmImage) || 'https://via.placeholder.com/1200x300'}
              alt="Farm cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-10 left-6 flex items-end space-x-4">
              <img
                src={withApiBase(user?.profileImage) || 'https://via.placeholder.com/160'}
                alt="Farmer profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-800"
              />
              <div className="pb-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.farmDetails?.farmName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Auction Form Modal */}
        {showCreateForm && (
          <CreateAuction
            onClose={() => setShowCreateForm(false)}
            onAuctionCreated={(newAuction) => {
              setAuctions([newAuction, ...auctions]);
              setShowCreateForm(false);
            }}
          />
        )}

        {/* Auctions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Auctions ({auctions.length})
            </h2>
          </div>

          {auctions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No auctions yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first auction to start selling your products.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Create Your First Auction
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {auctions.map((auction) => (
                <div key={auction.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {auction.images && auction.images.length > 0 && (
                      <img
                        src={withApiBase(auction.images[0])}
                        alt={auction.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {auction.productName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                            {auction.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            auction.stage === 'bidding' ? 'bg-blue-100 text-blue-800' :
                            auction.stage === 'harvesting' ? 'bg-green-100 text-green-800' :
                            auction.stage === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                            auction.stage === 'billing' ? 'bg-purple-100 text-purple-800' :
                            auction.stage === 'in_transit' ? 'bg-orange-100 text-orange-800' :
                            auction.stage === 'delivery' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {auction.stage.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Category: {auction.category} • Quantity: {auction.quantity} {auction.unit}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Base Price: ₹{auction.basePrice} • Current Bid: ₹{auction.currentBid} • Duration: {auction.duration} days
                      </p>
                      {auction.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {auction.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created: {formatDate(auction.createdAt)}</span>
                        {auction.endDate && (
                          <span>Ends: {formatDate(auction.endDate)}</span>
                        )}
                      </div>
                      
                      {/* Stage Progress */}
                      <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress:</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                auction.stage === 'bidding' ? 'bg-blue-500 w-1/6' :
                                auction.stage === 'harvesting' ? 'bg-green-500 w-2/6' :
                                auction.stage === 'loading' ? 'bg-yellow-500 w-3/6' :
                                auction.stage === 'billing' ? 'bg-purple-500 w-4/6' :
                                auction.stage === 'in_transit' ? 'bg-orange-500 w-5/6' :
                                auction.stage === 'delivery' ? 'bg-red-500 w-full' :
                                'bg-gray-500 w-0'
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 mt-4">
                        <button
                          onClick={() => setSelectedAuction(auction)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                        >
                          View Details
                        </button>
                        {auction.stage === 'bidding' && (
                          <button
                            onClick={() => handleStageUpdate('harvesting', {})}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm"
                          >
                            Start Harvesting
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auction Details Modal */}
        {selectedAuction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Auction Details: {selectedAuction.productName}</h2>
                <button onClick={() => setSelectedAuction(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              <div className="p-4 space-y-6">
                <AuctionManagement
                  auction={{
                    productName: selectedAuction.productName,
                    status: selectedAuction.status === 'active' ? 'live' : selectedAuction.status,
                    quantity: `${selectedAuction.quantity} ${selectedAuction.unit}`,
                    category: selectedAuction.category,
                    createdAt: selectedAuction.createdAt || new Date(),
                    endTime: selectedAuction.endDate || new Date(),
                    image: (selectedAuction.images && selectedAuction.images[0]) || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
                    currentBid: selectedAuction.currentBid,
                    startingPrice: selectedAuction.basePrice,
                    bids: selectedAuction.totalBids || 0,
                    minIncrement: selectedAuction.minIncrement || 1,
                    description: selectedAuction.description,
                    quality: 'Premium',
                    delivery: 'Within 72 hours',
                    stage: selectedAuction.stage,
                    stageDetails: selectedAuction.stageDetails || {}
                  }}
                  onUpdate={(updated) => {
                    setAuctions(auctions.map(a => a.id === selectedAuction.id ? { ...a, ...updated } : a));
                    setSelectedAuction(prev => ({ ...prev, ...updated }));
                  }}
                  onDelete={(id) => {
                    setAuctions(auctions.filter(a => a.id !== id));
                    setSelectedAuction(null);
                  }}
                />

                    {selectedAuction.winner && (
                  <PaymentSystem
                    auction={{ currentBid: selectedAuction.winner.finalBid, startingPrice: selectedAuction.basePrice }}
                    onPaymentUpdate={() => {}}
                    userType="farmer_admin"
                  />
                )}
                          </div>
                        </div>
                      </div>
                    )}

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
                <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">First Name</label>
                    <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.firstName} onChange={(e)=>handleProfileChange('firstName', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Last Name</label>
                    <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.lastName} onChange={(e)=>handleProfileChange('lastName', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                    <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.phone} onChange={(e)=>handleProfileChange('phone', e.target.value)} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Street" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.address.street} onChange={(e)=>handleProfileChange('address.street', e.target.value)} />
                    <input placeholder="City" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.address.city} onChange={(e)=>handleProfileChange('address.city', e.target.value)} />
                    <input placeholder="State" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.address.state} onChange={(e)=>handleProfileChange('address.state', e.target.value)} />
                    <input placeholder="Pincode" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.address.pincode} onChange={(e)=>handleProfileChange('address.pincode', e.target.value)} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Farm Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Farm Name" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.farmDetails.farmName} onChange={(e)=>handleProfileChange('farmDetails.farmName', e.target.value)} />
                    <input placeholder="Farm Size (acre)" type="number" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.farmDetails.farmSize} onChange={(e)=>handleProfileChange('farmDetails.farmSize', e.target.value)} />
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.farmDetails.farmType} onChange={(e)=>handleProfileChange('farmDetails.farmType', e.target.value)}>
                      <option value="conventional">Conventional</option>
                      <option value="organic">Organic</option>
                      <option value="mixed">Mixed</option>
                    </select>
                    <input placeholder="Established Year" type="number" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.farmDetails.establishedYear} onChange={(e)=>handleProfileChange('farmDetails.establishedYear', e.target.value)} />
                    <input placeholder="Crops (comma separated)" className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={Array.isArray(profileForm.farmDetails.crops)? profileForm.farmDetails.crops.join(', ') : (profileForm.farmDetails.crops || '')} onChange={(e)=>handleProfileChange('farmDetails.crops', e.target.value)} />
                    <input placeholder="Certifications (comma separated)" className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={Array.isArray(profileForm.farmDetails.certification)? profileForm.farmDetails.certification.join(', ') : (profileForm.farmDetails.certification || '')} onChange={(e)=>handleProfileChange('farmDetails.certification', e.target.value)} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="GST Number" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.businessInfo.gstNumber} onChange={(e)=>handleProfileChange('businessInfo.gstNumber', e.target.value)} />
                    <input placeholder="PAN Number" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.businessInfo.panNumber} onChange={(e)=>handleProfileChange('businessInfo.panNumber', e.target.value)} />
                    <input placeholder="Bank Account Number" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.businessInfo.bankDetails.accountNumber} onChange={(e)=>handleProfileChange('businessInfo.bankDetails.accountNumber', e.target.value)} />
                    <input placeholder="IFSC Code" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.businessInfo.bankDetails.ifscCode} onChange={(e)=>handleProfileChange('businessInfo.bankDetails.ifscCode', e.target.value)} />
                    <input placeholder="Bank Name" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.businessInfo.bankDetails.bankName} onChange={(e)=>handleProfileChange('businessInfo.bankDetails.bankName', e.target.value)} />
                    <input placeholder="Account Holder Name" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={profileForm.businessInfo.bankDetails.accountHolderName} onChange={(e)=>handleProfileChange('businessInfo.bankDetails.accountHolderName', e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button onClick={()=>setShowEditProfile(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                  <button onClick={saveProfile} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerDashboard;
