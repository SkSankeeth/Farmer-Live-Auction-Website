import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TransportManagement from '../components/TransportManagement';
import FinancialDashboard from '../components/FinancialDashboard';

const TransporterDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    businessType: '',
    licenseNumber: '',
    serviceAreas: '',
    baseFare: '',
    distanceRate: '',
    weightRate: '',
    currentLocation: '',
    isAvailable: true
  });

  // Mock data for demo
  const mockProfile = {
    id: 'transporter-001',
    userId: 'user-001',
    businessName: 'FastTrack Logistics',
    businessType: 'Transport Company',
    licenseNumber: 'TR-2024-001',
    vehicleFleet: [
      {
        id: 'vehicle-001',
        vehicleType: 'truck',
        vehicleNumber: 'MH-12-AB-1234',
        capacity: 5000,
        isAvailable: true,
        currentLocation: 'Mumbai'
      },
      {
        id: 'vehicle-002',
        vehicleType: 'mini_truck',
        vehicleNumber: 'MH-12-CD-5678',
        capacity: 2000,
        isAvailable: true,
        currentLocation: 'Mumbai'
      }
    ],
    serviceAreas: ['Mumbai', 'Pune', 'Nashik', 'Thane'],
    pricing: {
      baseFare: 500,
      distanceRate: 15,
      weightRate: 2,
      currency: 'INR'
    },
    ratings: {
      average: 4.5,
      totalReviews: 25
    },
    availability: {
      isAvailable: true,
      currentLocation: 'Mumbai',
      workingHours: '24/7'
    },
    documents: {
      businessLicense: 'https://example.com/license.pdf',
      vehicleRC: 'https://example.com/rc.pdf',
      insurance: 'https://example.com/insurance.pdf',
      permit: 'https://example.com/permit.pdf'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  };

  useEffect(() => {
    // Demo mode - use mock data
    setProfile(mockProfile);
    setProfileForm({
      businessName: mockProfile.businessName,
      businessType: mockProfile.businessType,
      licenseNumber: mockProfile.licenseNumber,
      serviceAreas: mockProfile.serviceAreas.join(', '),
      baseFare: mockProfile.pricing.baseFare.toString(),
      distanceRate: mockProfile.pricing.distanceRate.toString(),
      weightRate: mockProfile.pricing.weightRate.toString(),
      currentLocation: mockProfile.availability.currentLocation,
      isAvailable: mockProfile.availability.isAvailable
    });
    setLoading(false);
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call
      const updatedProfile = {
        ...profile,
        businessName: profileForm.businessName,
        businessType: profileForm.businessType,
        licenseNumber: profileForm.licenseNumber,
        serviceAreas: profileForm.serviceAreas.split(',').map(area => area.trim()),
        pricing: {
          ...profile.pricing,
          baseFare: parseFloat(profileForm.baseFare),
          distanceRate: parseFloat(profileForm.distanceRate),
          weightRate: parseFloat(profileForm.weightRate)
        },
        availability: {
          ...profile.availability,
          currentLocation: profileForm.currentLocation,
          isAvailable: profileForm.isAvailable
        },
        updatedAt: new Date()
      };
      setProfile(updatedProfile);
      setShowProfileForm(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const newAvailability = !profile.availability.isAvailable;
      const updatedProfile = {
        ...profile,
        availability: {
          ...profile.availability,
          isAvailable: newAvailability
        }
      };
      setProfile(updatedProfile);
      alert(`Availability ${newAvailability ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">T</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transporter Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.businessName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAvailabilityToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  profile?.availability?.isAvailable
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {profile?.availability?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🚚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Vehicles</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {profile?.vehicleFleet?.filter(v => v.isAvailable).length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-green-600 dark:text-green-400 text-xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {profile?.ratings?.average || 0}/5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <span className="text-orange-600 dark:text-orange-400 text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Jobs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Earnings</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹45,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Transport Requests
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Profile & Settings
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vehicles'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Vehicle Fleet
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'earnings'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Earnings & Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {activeTab === 'requests' && (
            <div className="p-6">
              <TransportManagement userType="transporter" />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Business Profile
                </h3>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Business Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Business Name:</span>
                      <p className="text-gray-900 dark:text-white">{profile?.businessName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Business Type:</span>
                      <p className="text-gray-900 dark:text-white">{profile?.businessType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">License Number:</span>
                      <p className="text-gray-900 dark:text-white">{profile?.licenseNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Service Areas:</span>
                      <p className="text-gray-900 dark:text-white">{profile?.serviceAreas?.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Pricing & Availability</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Base Fare:</span>
                      <p className="text-gray-900 dark:text-white">₹{profile?.pricing?.baseFare}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Distance Rate:</span>
                      <p className="text-gray-900 dark:text-white">₹{profile?.pricing?.distanceRate}/km</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Weight Rate:</span>
                      <p className="text-gray-900 dark:text-white">₹{profile?.pricing?.weightRate}/kg</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Location:</span>
                      <p className="text-gray-900 dark:text-white">{profile?.availability?.currentLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        profile?.availability?.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profile?.availability?.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Vehicle Fleet
                </h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Add Vehicle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.vehicleFleet?.map((vehicle) => (
                  <div key={vehicle.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {vehicle.vehicleType.replace('_', ' ').toUpperCase()}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.isAvailable ? 'Available' : 'In Use'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Vehicle Number:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{vehicle.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{vehicle.capacity} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Location:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{vehicle.currentLocation}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                        Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="p-6">
              <FinancialDashboard
                userType="transporter"
                analytics={{
                  totalEarnings: 45000,
                  monthlyEarnings: 15000,
                  completedJobs: 156,
                  averageRating: 4.5,
                  totalCommission: 2250,
                  pendingPayments: 5000
                }}
                payments={[]}
                auctions={[]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Edit Business Profile
              </h3>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.businessName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={profileForm.businessType}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, businessType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.licenseNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Service Areas (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={profileForm.serviceAreas}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, serviceAreas: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Mumbai, Pune, Nashik"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Base Fare (₹)
                    </label>
                    <input
                      type="number"
                      value={profileForm.baseFare}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, baseFare: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Distance Rate (₹/km)
                    </label>
                    <input
                      type="number"
                      value={profileForm.distanceRate}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, distanceRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight Rate (₹/kg)
                    </label>
                    <input
                      type="number"
                      value={profileForm.weightRate}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, weightRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.currentLocation}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, currentLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={profileForm.isAvailable}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Available for new requests
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Profile
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

export default TransporterDashboard;

