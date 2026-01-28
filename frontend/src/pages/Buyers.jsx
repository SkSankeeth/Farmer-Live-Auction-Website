import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdvancedSearch from '../components/AdvancedSearch';
import { apiClient, withApiBase } from '../utils/apiClient';

const Buyers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedBuyerAuctions, setSelectedBuyerAuctions] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);

  // Search and filter configuration
  const searchConfig = {
    searchFields: ['name', 'businessName', 'location', 'description', 'specialties'],
    filterOptions: {
      category: [
        { value: 'all', label: 'All Categories' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'retailer', label: 'Retailer' },
        { value: 'wholesaler', label: 'Wholesaler' },
        { value: 'exporter', label: 'Exporter' },
        { value: 'processor', label: 'Processor' }
      ],
      location: [
        { value: 'all', label: 'All Locations' },
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Bangalore', label: 'Bangalore' },
        { value: 'Chennai', label: 'Chennai' },
        { value: 'Kolkata', label: 'Kolkata' }
      ],
      rating: [
        { value: 'all', label: 'All Ratings' },
        { value: '4.5+', label: '4.5+ Stars' },
        { value: '4.0+', label: '4.0+ Stars' },
        { value: '3.5+', label: '3.5+ Stars' },
        { value: '3.0+', label: '3.0+ Stars' }
      ],
      businessSize: [
        { value: 'all', label: 'All Sizes' },
        { value: 'small', label: 'Small Business' },
        { value: 'medium', label: 'Medium Business' },
        { value: 'large', label: 'Large Business' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
    },
    sortOptions: [
      { value: 'rating', label: 'Rating' },
      { value: 'totalPurchases', label: 'Total Purchases' },
      { value: 'experience', label: 'Experience' },
      { value: 'name', label: 'Name' },
      { value: 'businessSize', label: 'Business Size' }
    ]
  };

  // Initialize from API, fallback to mock
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.get('auth/list/buyers');
        const apiBuyers = (data.buyers || []).map(b => ({
          id: b.id,
          name: `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.email,
          location: b.address?.city || 'Unknown',
          businessName: b.businessInfo?.businessName || 'Buyer',
          category: 'retailer',
          rating: Number(b.stats?.averageRating || 4.6),
          totalPurchases: Number(b.stats?.totalPurchases || 0),
          ordersCompleted: Number(b.stats?.ordersCompleted || 0),
          experience: 2,
          image: withApiBase(b.profileImage) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          businessImage: withApiBase(b.businessInfo?.businessImage) || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
          description: 'Member of OnlyFarmers marketplace',
          specialties: [],
          certifications: [],
          languages: ['English'],
          contact: b.phone || '',
          email: b.email,
          verified: Boolean(b.verification?.isVerified),
          memberSince: new Date(b.createdAt).getFullYear().toString(),
          activeBids: 0,
          businessType: b.businessInfo?.businessType || 'Retail',
          annualTurnover: '—'
        }));
        const merged = apiBuyers.length ? apiBuyers : buyers;
        setFilteredBuyers(merged);
      } catch (e) {
        setFilteredBuyers(buyers);
      }
    };
    load();
  }, []);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Pre-populated buyer data
  const buyers = [
    {
      id: 1,
      name: "Arjun Singh",
      location: "Delhi",
      businessName: "FreshMart Supermarkets",
      category: "retail",
      rating: 4.9,
      totalPurchases: 2500000,
      ordersCompleted: 45,
      experience: 6,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      businessImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Leading supermarket chain owner with 6 years of experience in retail. Committed to providing fresh, organic products to customers across Delhi.",
      specialties: ["Organic Vegetables", "Fresh Fruits", "Dairy Products"],
      certifications: ["FSSAI Licensed", "Organic Certified", "ISO 9001"],
      languages: ["Hindi", "English", "Punjabi"],
      contact: "+91 98765 43220",
      email: "arjun@freshmart.com",
      verified: true,
      memberSince: "2020",
      activeBids: 8,
      businessType: "Supermarket Chain",
      annualTurnover: "₹5.2 Cr"
    },
    {
      id: 2,
      name: "Priya Mehta",
      location: "Mumbai",
      businessName: "Green Kitchen Restaurant",
      category: "restaurant",
      rating: 4.8,
      totalPurchases: 1800000,
      ordersCompleted: 32,
      experience: 4,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      businessImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Restaurant owner specializing in organic and farm-fresh ingredients. Known for sustainable cooking practices and supporting local farmers.",
      specialties: ["Organic Produce", "Fresh Herbs", "Seasonal Vegetables"],
      certifications: ["FSSAI Licensed", "Organic Certified", "HACCP"],
      languages: ["Hindi", "English", "Marathi"],
      contact: "+91 98765 43221",
      email: "priya@greenkitchen.com",
      verified: true,
      memberSince: "2021",
      activeBids: 5,
      businessType: "Fine Dining Restaurant",
      annualTurnover: "₹2.8 Cr"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      location: "Bangalore",
      businessName: "TechCorp Canteen Services",
      category: "corporate",
      rating: 4.7,
      totalPurchases: 3200000,
      ordersCompleted: 67,
      experience: 8,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      businessImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Corporate catering specialist providing healthy meals to tech companies. Focus on fresh, nutritious ingredients for employee wellness.",
      specialties: ["Bulk Vegetables", "Fresh Fruits", "Dairy Products"],
      certifications: ["FSSAI Licensed", "ISO 22000", "HACCP"],
      languages: ["Hindi", "English", "Kannada"],
      contact: "+91 98765 43222",
      email: "rajesh@techcorp.com",
      verified: true,
      memberSince: "2019",
      activeBids: 12,
      businessType: "Corporate Catering",
      annualTurnover: "₹8.5 Cr"
    },
    {
      id: 4,
      name: "Sunita Devi",
      location: "Chennai",
      businessName: "Spice Garden Export Co.",
      category: "export",
      rating: 4.9,
      totalPurchases: 4500000,
      ordersCompleted: 89,
      experience: 10,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      businessImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Export specialist with 10 years of experience in international trade. Focuses on premium quality agricultural products for global markets.",
      specialties: ["Premium Rice", "Organic Spices", "Exotic Fruits"],
      certifications: ["Export License", "Organic Certified", "ISO 9001"],
      languages: ["Hindi", "English", "Tamil", "French"],
      contact: "+91 98765 43223",
      email: "sunita@spicegarden.com",
      verified: true,
      memberSince: "2018",
      activeBids: 15,
      businessType: "Export Company",
      annualTurnover: "₹12.3 Cr"
    },
    {
      id: 5,
      name: "Vikram Sharma",
      location: "Pune",
      businessName: "FarmFresh Online Store",
      category: "ecommerce",
      rating: 4.6,
      totalPurchases: 1200000,
      ordersCompleted: 28,
      experience: 3,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      businessImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "E-commerce entrepreneur revolutionizing online grocery delivery. Committed to bringing farm-fresh products directly to customers' doorsteps.",
      specialties: ["Fresh Vegetables", "Organic Fruits", "Dairy Products"],
      certifications: ["FSSAI Licensed", "ISO 9001", "HACCP"],
      languages: ["Hindi", "English", "Marathi"],
      contact: "+91 98765 43224",
      email: "vikram@farmfresh.com",
      verified: true,
      memberSince: "2022",
      activeBids: 6,
      businessType: "E-commerce Platform",
      annualTurnover: "₹1.8 Cr"
    },
    {
      id: 6,
      name: "Anita Patel",
      location: "Ahmedabad",
      businessName: "Healthy Living Wellness Center",
      category: "wellness",
      rating: 4.8,
      totalPurchases: 950000,
      ordersCompleted: 19,
      experience: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      businessImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Wellness center owner promoting healthy living through organic and natural products. Specializes in therapeutic and medicinal plants.",
      specialties: ["Medicinal Herbs", "Organic Vegetables", "Natural Products"],
      certifications: ["Ayurveda Certified", "Organic Certified", "FSSAI Licensed"],
      languages: ["Hindi", "English", "Gujarati"],
      contact: "+91 98765 43225",
      email: "anita@healthyliving.com",
      verified: true,
      memberSince: "2021",
      activeBids: 4,
      businessType: "Wellness Center",
      annualTurnover: "₹1.2 Cr"
    }
  ];

  // Pre-populated auction data for buyers
  const buyerAuctions = {
    1: [
      { id: 1, title: "Fresh Organic Tomatoes", currentBid: 4500, endTime: "2 hours", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 2, title: "Fresh Onions", currentBid: 2800, endTime: "5 hours", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 3, title: "Organic Spinach", currentBid: 1200, endTime: "1 day", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    ],
    2: [
      { id: 4, title: "Premium Basmati Rice", currentBid: 8500, endTime: "4 hours", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 5, title: "Jasmine Rice", currentBid: 7200, endTime: "6 hours", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    ],
    3: [
      { id: 6, title: "Fresh Dairy Milk", currentBid: 3200, endTime: "1 hour", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    ],
    4: [
      { id: 7, title: "Organic Apples", currentBid: 6800, endTime: "6 hours", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 8, title: "Fresh Pears", currentBid: 4200, endTime: "8 hours", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 9, title: "Organic Plums", currentBid: 3800, endTime: "12 hours", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 10, title: "Fresh Cherries", currentBid: 5500, endTime: "1 day", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    ],
    5: [
      { id: 11, title: "Fresh Eggs", currentBid: 1800, endTime: "3 hours", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
      { id: 12, title: "Free Range Chicken", currentBid: 4500, endTime: "5 hours", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    ],
    6: [
      { id: 13, title: "Organic Honey", currentBid: 4200, endTime: "5 hours", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Buyers', icon: '🛒' },
    { id: 'retail', name: 'Retail', icon: '🏪' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'corporate', name: 'Corporate', icon: '🏢' },
    { id: 'export', name: 'Export', icon: '🌍' },
    { id: 'ecommerce', name: 'E-commerce', icon: '💻' },
    { id: 'wellness', name: 'Wellness', icon: '🌿' }
  ];

  // filteredBuyers is managed via AdvancedSearch and initialized from buyers

  const handleBuyerClick = (buyer) => {
    setSelectedBuyer(buyer);
    setSelectedBuyerAuctions(buyerAuctions[buyer.id] || []);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">⭐</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">⭐</span>);
    }
    
    return stars;
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Buyers';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our
              </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Buyers
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-1000"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Meet the trusted buyers who are part of the OnlyFarmers community. 
            Discover their businesses, specialties, and commitment to quality products.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {buyers.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Buyers</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {buyers.filter(b => b.verified).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Verified</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ₹{Math.round(buyers.reduce((sum, buyer) => sum + buyer.totalPurchases, 0) / 100000) / 10}L
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                {buyers.reduce((sum, buyer) => sum + buyer.activeBids, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Bids</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <AdvancedSearch
            data={buyers}
            onFilteredData={setFilteredBuyers}
            searchFields={searchConfig.searchFields}
            filterOptions={searchConfig.filterOptions}
            sortOptions={searchConfig.sortOptions}
            placeholder="Search buyers, businesses, or locations..."
            showFilters={true}
            showSort={true}
          />
        </section>

        {/* Buyers Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuyers.map(buyer => (
            <div
              key={buyer.id}
              onClick={() => handleBuyerClick(buyer)}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={buyer.image}
                  alt={buyer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  {buyer.verified && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-500">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/50 backdrop-blur-sm">
                    {buyer.activeBids} bids
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(buyer.rating)}
                    <span className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded">
                      {buyer.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {buyer.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {buyer.businessName}
                </p>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">📍</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{buyer.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {buyer.experience} years
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Orders</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {buyer.ordersCompleted}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Business Type</div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {buyer.businessType}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {buyer.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                    {buyer.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{buyer.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                    👁️ View Profile
                  </button>
                  <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300">
                    📞
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* No Results */}
        {filteredBuyers.length === 0 && (
          <section className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Buyers Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search criteria or check back later for new buyers.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Clear Filters
            </button>
          </section>
        )}
      </div>

      {/* Buyer Detail Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedBuyer.name}
                </h2>
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <img
                    src={selectedBuyer.image}
                    alt={selectedBuyer.name}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  <img
                    src={selectedBuyer.businessImage}
                    alt={selectedBuyer.businessName}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedBuyer.businessName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedBuyer.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      {renderStars(selectedBuyer.rating)}
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedBuyer.rating}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedBuyer.experience} years
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{Math.round(selectedBuyer.totalPurchases / 100000) / 10}L
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Orders Completed</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedBuyer.ordersCompleted}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Annual Turnover</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedBuyer.annualTurnover}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuyer.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuyer.certifications.map((cert, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h4>
                      <p className="text-gray-600 dark:text-gray-300">{selectedBuyer.contact}</p>
                      <p className="text-gray-600 dark:text-gray-300">{selectedBuyer.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedBuyer.languages.map((lang, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Bids */}
              {selectedBuyerAuctions.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Active Bids ({selectedBuyerAuctions.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedBuyerAuctions.map(auction => (
                      <div key={auction.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {auction.title}
                        </h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ₹{auction.currentBid.toLocaleString()}
                          </span>
                          <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                            {auction.endTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                  📞 Contact Buyer
                </button>
                <Link
                  to="/auctions"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
                >
                  🎯 View All Auctions
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buyers;

