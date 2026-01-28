import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdvancedSearch from '../components/AdvancedSearch';
import { apiClient, withApiBase } from '../utils/apiClient';

const Farmers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedFarmerAuctions, setSelectedFarmerAuctions] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);

  // Search and filter configuration
  const searchConfig = {
    searchFields: ['name', 'farmName', 'location', 'description', 'specialties'],
    filterOptions: {
      category: [
        { value: 'all', label: 'All Categories' },
        { value: 'vegetables', label: 'Vegetables' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'grains', label: 'Grains' },
        { value: 'dairy', label: 'Dairy' },
        { value: 'spices', label: 'Spices' }
      ],
      location: [
        { value: 'all', label: 'All Locations' },
        { value: 'Maharashtra', label: 'Maharashtra' },
        { value: 'Punjab', label: 'Punjab' },
        { value: 'Karnataka', label: 'Karnataka' },
        { value: 'Tamil Nadu', label: 'Tamil Nadu' },
        { value: 'Gujarat', label: 'Gujarat' }
      ],
      rating: [
        { value: 'all', label: 'All Ratings' },
        { value: '4.5+', label: '4.5+ Stars' },
        { value: '4.0+', label: '4.0+ Stars' },
        { value: '3.5+', label: '3.5+ Stars' },
        { value: '3.0+', label: '3.0+ Stars' }
      ],
      experience: [
        { value: 'all', label: 'All Experience' },
        { value: '0-2', label: '0-2 Years' },
        { value: '3-5', label: '3-5 Years' },
        { value: '6-10', label: '6-10 Years' },
        { value: '10+', label: '10+ Years' }
      ]
    },
    sortOptions: [
      { value: 'rating', label: 'Rating' },
      { value: 'totalSales', label: 'Total Sales' },
      { value: 'experience', label: 'Experience' },
      { value: 'name', label: 'Name' },
      { value: 'products', label: 'Number of Products' }
    ]
  };

  // Initialize from API, fallback to mock
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.get('auth/list/farmers');
        const apiFarmers = (data.farmers || []).map(f => ({
          id: f.id,
          name: `${f.firstName || ''} ${f.lastName || ''}`.trim() || f.email,
          location: f.address?.city || 'Unknown',
          farmName: f.farmDetails?.farmName || 'Farm',
          category: (f.farmDetails?.crops?.[0] || 'vegetables').toLowerCase(),
          rating: Number(f.stats?.averageRating || 4.5),
          totalSales: Number(f.stats?.totalEarnings || 0),
          products: Array.isArray(f.farmDetails?.crops) ? f.farmDetails.crops.length : 0,
          experience:  Math.max(0, new Date().getFullYear() - (f.farmDetails?.establishedYear || new Date().getFullYear())),
          image: withApiBase(f.profileImage) || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
          farmImage: withApiBase(f.farmDetails?.farmImage) || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
          description: 'Member of OnlyFarmers marketplace',
          specialties: f.farmDetails?.crops || [],
          certifications: f.farmDetails?.certification || [],
          languages: ['English'],
          contact: f.phone || '',
          email: f.email,
          verified: Boolean(f.verification?.isVerified),
          memberSince: new Date(f.createdAt).getFullYear().toString(),
          activeAuctions: Number(f.stats?.totalAuctions || 0)
        }));
        const merged = apiFarmers.length ? apiFarmers : farmers;
        setFilteredFarmers(merged);
      } catch (e) {
        setFilteredFarmers(farmers);
      }
    };
    load();
  }, []);

  // Pre-populated farmer data
  const farmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Maharashtra",
      farmName: "Green Valley Organic Farm",
      category: "vegetables",
      rating: 4.8,
      totalSales: 1250000,
      products: 15,
      experience: 8,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Dedicated organic farmer with 8 years of experience in sustainable farming practices. Specializes in tomatoes, onions, and leafy greens.",
      specialties: ["Organic Tomatoes", "Fresh Onions", "Leafy Greens"],
      certifications: ["Organic Certified", "GAP Certified", "ISO 22000"],
      languages: ["Hindi", "Marathi", "English"],
      contact: "+91 98765 43210",
      email: "rajesh@greenvalleyfarm.com",
      verified: true,
      memberSince: "2020",
      activeAuctions: 3
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Punjab",
      farmName: "Golden Harvest Rice Farm",
      category: "grains",
      rating: 4.9,
      totalSales: 2100000,
      products: 8,
      experience: 12,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Expert rice farmer with over 12 years of experience. Known for premium Basmati rice varieties and sustainable farming methods.",
      specialties: ["Basmati Rice", "Jasmine Rice", "Brown Rice"],
      certifications: ["Organic Certified", "Export Certified", "HACCP"],
      languages: ["Hindi", "Punjabi", "English"],
      contact: "+91 98765 43211",
      email: "priya@goldenharvest.com",
      verified: true,
      memberSince: "2018",
      activeAuctions: 2
    },
    {
      id: 3,
      name: "Amit Patel",
      location: "Gujarat",
      farmName: "Dairy Delight Farm",
      category: "dairy",
      rating: 4.7,
      totalSales: 890000,
      products: 6,
      experience: 6,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Modern dairy farmer with state-of-the-art facilities. Provides fresh milk and dairy products with highest quality standards.",
      specialties: ["Fresh Milk", "Curd", "Butter", "Ghee"],
      certifications: ["FSSAI Certified", "ISO 9001", "HACCP"],
      languages: ["Hindi", "Gujarati", "English"],
      contact: "+91 98765 43212",
      email: "amit@dairydelight.com",
      verified: true,
      memberSince: "2021",
      activeAuctions: 1
    },
    {
      id: 4,
      name: "Suresh Verma",
      location: "Himachal Pradesh",
      farmName: "Apple Valley Orchard",
      category: "fruits",
      rating: 4.6,
      totalSales: 1560000,
      products: 12,
      experience: 10,
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Specialized in apple cultivation in the beautiful hills of Himachal Pradesh. Organic farming methods with focus on quality.",
      specialties: ["Organic Apples", "Pears", "Plums", "Cherries"],
      certifications: ["Organic Certified", "GAP Certified"],
      languages: ["Hindi", "Pahari", "English"],
      contact: "+91 98765 43213",
      email: "suresh@applevalley.com",
      verified: true,
      memberSince: "2019",
      activeAuctions: 4
    },
    {
      id: 5,
      name: "Lakshmi Devi",
      location: "Andhra Pradesh",
      farmName: "Happy Hens Poultry Farm",
      category: "poultry",
      rating: 4.5,
      totalSales: 680000,
      products: 4,
      experience: 5,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Free-range poultry farmer committed to ethical farming practices. Fresh eggs and poultry products from happy, healthy birds.",
      specialties: ["Fresh Eggs", "Chicken", "Duck Eggs"],
      certifications: ["FSSAI Certified", "Animal Welfare"],
      languages: ["Hindi", "Telugu", "English"],
      contact: "+91 98765 43214",
      email: "lakshmi@happyhens.com",
      verified: true,
      memberSince: "2022",
      activeAuctions: 2
    },
    {
      id: 6,
      name: "Ramesh Kumar",
      location: "Uttarakhand",
      farmName: "Forest Honey Farm",
      category: "honey",
      rating: 4.8,
      totalSales: 420000,
      products: 3,
      experience: 7,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Traditional beekeeper preserving ancient honey harvesting techniques. Pure, unprocessed honey from the forests of Uttarakhand.",
      specialties: ["Wild Honey", "Forest Honey", "Organic Honey"],
      certifications: ["Organic Certified", "FSSAI Certified"],
      languages: ["Hindi", "Garhwali", "English"],
      contact: "+91 98765 43215",
      email: "ramesh@foresthoney.com",
      verified: true,
      memberSince: "2020",
      activeAuctions: 1
    }
  ];

  // Pre-populated auction data for farmers
  const farmerAuctions = {
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
    { id: 'all', name: 'All Farmers', icon: '👨‍🌾' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'poultry', name: 'Poultry', icon: '🥚' },
    { id: 'honey', name: 'Honey', icon: '🍯' }
  ];

  // filteredFarmers is managed via AdvancedSearch and initialized from farmers

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setSelectedFarmerAuctions(farmerAuctions[farmer.id] || []);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Our
              </span>
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Farmers
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-1000"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Meet the dedicated farmers who are part of the OnlyFarmers community. 
            Discover their stories, products, and sustainable farming practices.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {farmers.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Farmers</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {farmers.filter(f => f.verified).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Verified</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                ₹{Math.round(farmers.reduce((sum, farmer) => sum + farmer.totalSales, 0) / 100000) / 10}L
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {farmers.reduce((sum, farmer) => sum + farmer.activeAuctions, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Live Auctions</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <AdvancedSearch
            data={farmers}
            onFilteredData={setFilteredFarmers}
            searchFields={searchConfig.searchFields}
            filterOptions={searchConfig.filterOptions}
            sortOptions={searchConfig.sortOptions}
            placeholder="Search farmers, farms, or locations..."
            showFilters={true}
            showSort={true}
          />
        </section>

        {/* Farmers Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map(farmer => (
            <div
              key={farmer.id}
              onClick={() => handleFarmerClick(farmer)}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group cursor-pointer"
            >
              {/* Cover and Profile visual like Facebook */}
              <div className="relative h-48 overflow-hidden">
                {/* Cover = farm image */}
                <img
                  src={farmer.farmImage}
                  alt={farmer.farmName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Profile avatar overlay */}
                <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl ring-4 ring-white dark:ring-gray-800 overflow-hidden shadow-xl">
                  <img src={farmer.image} alt={farmer.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-4 left-4">
                  {farmer.verified && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-500">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/50 backdrop-blur-sm">
                    {farmer.activeAuctions} auctions
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(farmer.rating)}
                    <span className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded">
                      {farmer.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {farmer.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {farmer.farmName}
                </p>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">📍</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{farmer.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {farmer.experience} years
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {farmer.products}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {farmer.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                    {farmer.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{farmer.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
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
        {filteredFarmers.length === 0 && (
          <section className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Farmers Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search criteria or check back later for new farmers.
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

      {/* Farmer Detail Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedFarmer.name}
                </h2>
                <button
                  onClick={() => setSelectedFarmer(null)}
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
                    src={selectedFarmer.image}
                    alt={selectedFarmer.name}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  <img
                    src={selectedFarmer.farmImage}
                    alt={selectedFarmer.farmName}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedFarmer.farmName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedFarmer.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      {renderStars(selectedFarmer.rating)}
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedFarmer.rating}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedFarmer.experience} years
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{Math.round(selectedFarmer.totalSales / 100000) / 10}L
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedFarmer.products}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedFarmer.memberSince}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFarmer.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFarmer.certifications.map((cert, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h4>
                      <p className="text-gray-600 dark:text-gray-300">{selectedFarmer.contact}</p>
                      <p className="text-gray-600 dark:text-gray-300">{selectedFarmer.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedFarmer.languages.map((lang, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Auctions */}
              {selectedFarmerAuctions.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Active Auctions ({selectedFarmerAuctions.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFarmerAuctions.map(auction => (
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
                <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                  📞 Contact Farmer
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

export default Farmers;
