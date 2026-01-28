import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuctionBidding from '../components/AuctionBidding';
import AuctionTimer from '../components/AuctionTimer';
import AdvancedSearch from '../components/AdvancedSearch';
import { apiClient, withApiBase } from '../utils/apiClient';

const Auctions = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seed search from URL ?q=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, []);

  // Helpers to normalize Firestore timestamps/ISO strings into JS Date
  const toJsDate = (value) => {
    if (!value) return null;
    if (typeof value === 'object' && value.seconds) {
      return new Date(value.seconds * 1000);
    }
    return new Date(value);
  };

  const getEndTime = (auction) => {
    return (
      toJsDate(auction.endTime) ||
      toJsDate(auction.endDate) ||
      toJsDate(auction?.stageDetails?.bidding?.endTime) ||
      null
    );
  };

  // Search and filter configuration
  const searchConfig = {
    searchFields: ['title', 'farmer', 'location', 'description', 'category'],
    filterOptions: {
      category: [
        { value: 'all', label: 'All Categories' },
        { value: 'vegetables', label: 'Vegetables' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'grains', label: 'Grains' },
        { value: 'dairy', label: 'Dairy' },
        { value: 'spices', label: 'Spices' }
      ],
      status: [
        { value: 'all', label: 'All Status' },
        { value: 'live', label: 'Live' },
        { value: 'ending', label: 'Ending Soon' },
        { value: 'ended', label: 'Ended' }
      ],
      location: [
        { value: 'all', label: 'All Locations' },
        { value: 'Maharashtra', label: 'Maharashtra' },
        { value: 'Punjab', label: 'Punjab' },
        { value: 'Karnataka', label: 'Karnataka' },
        { value: 'Tamil Nadu', label: 'Tamil Nadu' },
        { value: 'Gujarat', label: 'Gujarat' }
      ],
      priceRange: [
        { value: 'all', label: 'All Prices' },
        { value: '0-5000', label: 'Under ₹5,000' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000' },
        { value: '10000-20000', label: '₹10,000 - ₹20,000' },
        { value: '20000+', label: 'Above ₹20,000' }
      ]
    },
    sortOptions: [
      { value: 'endTime', label: 'Ending Time' },
      { value: 'currentBid', label: 'Current Bid' },
      { value: 'bids', label: 'Number of Bids' },
      { value: 'title', label: 'Product Name' },
      { value: 'farmer', label: 'Farmer Name' }
    ]
  };

  // Pre-populated auction data
  const mockAuctions = [
    {
      id: 1,
      title: "Fresh Organic Tomatoes",
      farmer: "Rajesh Kumar",
      location: "Maharashtra",
      currentBid: 4500,
      startingPrice: 3000,
      quantity: "500 kg",
      category: "vegetables",
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      bids: 12,
      status: "live",
      description: "Fresh organic tomatoes grown without pesticides. Perfect for restaurants and food processing units.",
      quality: "Premium Grade A",
      delivery: "Within 48 hours"
    },
    {
      id: 2,
      title: "Premium Basmati Rice",
      farmer: "Priya Sharma",
      location: "Punjab",
      currentBid: 8500,
      startingPrice: 6000,
      quantity: "1000 kg",
      category: "grains",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      bids: 8,
      status: "live",
      description: "Premium quality Basmati rice with long grains and aromatic flavor. Ideal for export and premium markets.",
      quality: "Export Grade",
      delivery: "Within 72 hours"
    },
    {
      id: 3,
      title: "Fresh Dairy Milk",
      farmer: "Amit Patel",
      location: "Gujarat",
      currentBid: 3200,
      startingPrice: 2500,
      quantity: "200 liters",
      category: "dairy",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      bids: 15,
      status: "live",
      description: "Fresh dairy milk from grass-fed cows. High in protein and calcium. Perfect for dairy products.",
      quality: "Grade A",
      delivery: "Same day"
    },
    {
      id: 4,
      title: "Organic Apples",
      farmer: "Suresh Verma",
      location: "Himachal Pradesh",
      currentBid: 6800,
      startingPrice: 5000,
      quantity: "300 kg",
      category: "fruits",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      bids: 6,
      status: "live",
      description: "Organic apples from the hills of Himachal Pradesh. Sweet and crisp with natural farming methods.",
      quality: "Organic Premium",
      delivery: "Within 48 hours"
    },
    {
      id: 5,
      title: "Fresh Eggs",
      farmer: "Lakshmi Devi",
      location: "Andhra Pradesh",
      currentBid: 1800,
      startingPrice: 1200,
      quantity: "500 pieces",
      category: "poultry",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      bids: 20,
      status: "live",
      description: "Fresh farm eggs from free-range chickens. Rich in protein and essential nutrients.",
      quality: "Farm Fresh",
      delivery: "Same day"
    },
    {
      id: 6,
      title: "Organic Honey",
      farmer: "Ramesh Kumar",
      location: "Uttarakhand",
      currentBid: 4200,
      startingPrice: 3000,
      quantity: "50 kg",
      category: "honey",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      bids: 9,
      status: "live",
      description: "Pure organic honey from the forests of Uttarakhand. Natural and unprocessed with medicinal properties.",
      quality: "Pure Organic",
      delivery: "Within 72 hours",
      minIncrement: 50
    }
  ];

  // Initialize auctions
  useEffect(() => {
    const initializeAuctions = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        if (isAuthenticated) {
          const data = await apiClient.get('auctions');
          const list = (data.auctions || []).map(a => {
            const pricing = a.pricing || {};
            const productDetails = a.productDetails || {};
            const timeline = a.timeline || {};
            return {
              ...a,
              id: a.id || a._id,
              title: a.title || a.productName,
              image: a.image || (Array.isArray(a.images) ? withApiBase(a.images[0]) : undefined),
              currentBid: pricing.currentBid ?? a.currentBid ?? pricing.basePrice ?? 0,
              startingPrice: pricing.basePrice ?? a.startingPrice ?? 0,
              quantity: productDetails.quantity ?? a.quantity,
              unit: productDetails.unit ?? a.unit,
              endTime: timeline.endTime || timeline.biddingEndTime || a.endTime,
              bids: a.stats?.totalBids ?? a.stageDetails?.bidding?.totalBids ?? a.bids ?? 0,
              status: a.status === 'active' ? 'live' : (a.status || 'live'),
            };
          });
          setAuctions(list.length ? list : mockAuctions);
          setFilteredAuctions(list.length ? list : mockAuctions);
        } else {
          setAuctions(mockAuctions);
          setFilteredAuctions(mockAuctions);
        }
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setAuctions(mockAuctions);
        setFilteredAuctions(mockAuctions);
      } finally {
        setLoading(false);
      }
    };

    initializeAuctions();
  }, [isAuthenticated]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌾' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'poultry', name: 'Poultry', icon: '🥚' },
    { id: 'honey', name: 'Honey', icon: '🍯' }
  ];

  // Per-auction timer is handled by AuctionTimer component

  // filteredAuctions is managed via AdvancedSearch and initialized from auctions

  const formatTime = (time) => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      return 'Ended';
    }
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-green-500';
      case 'ending':
        return 'bg-orange-500';
      case 'ended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAuctionClick = (auction) => {
    setSelectedAuction(auction);
  };

  const handleBidClick = (auction) => {
    if (!isAuthenticated) {
      alert('Please login to place a bid');
      return;
    }
    if (user.role === 'farmer') {
      alert('Farmers cannot bid on their own or other auctions');
      return;
    }
    setSelectedAuction(auction);
    setShowBiddingModal(true);
  };

  const handleBidPlaced = (newBidAmount) => {
    setAuctions(prev => prev.map(auction => 
      auction.id === selectedAuction.id 
        ? { ...auction, currentBid: newBidAmount, bids: auction.bids + 1 }
        : auction
    ));
    setSelectedAuction(prev => ({ ...prev, currentBid: newBidAmount, bids: prev.bids + 1 }));
  };

  const handleAuctionEnd = (auctionId) => {
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { ...auction, status: 'ended' }
        : auction
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Live
              </span>
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Auctions
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-1000"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover fresh produce and agricultural products through our live auction system. 
            Bid on quality items from trusted farmers across the region.
          </p>
          
          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {auctions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Auctions</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ₹{auctions.reduce((sum, auction) => sum + auction.currentBid, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {auctions.reduce((sum, auction) => sum + auction.bids, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bids</div>
            </div>
          </div>
        </section>

        {/* Advanced Search and Filters */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <AdvancedSearch
            data={auctions}
            onFilteredData={setFilteredAuctions}
            searchFields={searchConfig.searchFields}
            filterOptions={searchConfig.filterOptions}
            sortOptions={searchConfig.sortOptions}
            placeholder="Search auctions, farmers, or products..."
            showFilters={true}
            showSort={true}
          />
        </section>

        {/* Auctions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map(auction => (
            <div
              key={auction.id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={auction.image || (Array.isArray(auction.images) ? withApiBase(auction.images[0]) : '')}
                  alt={auction.title || auction.productName || 'Auction'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(auction.status)}`}>
                    {auction.status.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/50 backdrop-blur-sm">
                    {(auction.bids || auction.totalBids || 0)} bids
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {auction.title || auction.productName}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">👨‍🌾</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{auction.farmerName || auction.farmer || 'Farmer'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">📍 {auction.location?.farmAddress || auction.location || 'Location'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Bid</div>
                    <div className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ₹{Number(auction.pricing?.currentBid || auction.pricing?.basePrice || 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Quantity</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {auction.productDetails?.quantity || auction.quantity}{auction.productDetails?.unit || auction.unit ? ` ${auction.productDetails?.unit || auction.unit}` : ''}
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <AuctionTimer 
                  endTime={getEndTime(auction)} 
                  onAuctionEnd={() => handleAuctionEnd(auction.id)}
                  size="normal"
                />

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBidClick(auction)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🎯 Place Bid
                  </button>
                  <button 
                    onClick={() => handleAuctionClick(auction)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
                  >
                    👁️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* No Results */}
        {filteredAuctions.length === 0 && (
          <section className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Auctions Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search criteria or check back later for new auctions.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Clear Filters
            </button>
          </section>
        )}
      </div>

      {/* Auction Detail Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedAuction.title}
                </h2>
                <button
                  onClick={() => setSelectedAuction(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <img
                src={selectedAuction.image}
                alt={selectedAuction.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Bid</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ₹{selectedAuction.currentBid.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ₹{selectedAuction.startingPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quantity</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedAuction.quantity}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Bids</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedAuction.bids}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAuction.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{selectedAuction.quality}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Delivery</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{selectedAuction.delivery}</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                  🎯 Place Bid Now
                </button>
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300">
                  📞 Contact Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bidding Modal */}
      {showBiddingModal && selectedAuction && (
        <AuctionBidding
          auction={selectedAuction}
          onBidPlaced={handleBidPlaced}
          onClose={() => setShowBiddingModal(false)}
        />
      )}
    </div>
  );
};

export default Auctions;
