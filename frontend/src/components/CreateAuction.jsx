import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { withApiBase } from '../utils/apiClient';

const CreateAuction = ({ onClose, onAuctionCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    unit: 'kg',
    basePrice: '', // Changed from startingPrice to basePrice
    minIncrement: 50,
    reservePrice: '',
    instantBuyPrice: '',
    duration: 7, // days
    description: '',
    quality: 'standard', // Changed from 'Premium' to 'standard'
    delivery: 'Within 72 hours',
    location: user?.address?.street || '', // Updated to use address structure
    images: [],
    autoExtend: false,
    instantBuy: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'honey', name: 'Honey', icon: '🍯' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'poultry', name: 'Poultry', icon: '🐔' },
    { id: 'seafood', name: 'Seafood', icon: '🐟' }
  ];

  const units = [
    { id: 'kg', name: 'Kilograms' },
    { id: 'g', name: 'Grams' },
    { id: 'lb', name: 'Pounds' },
    { id: 'tons', name: 'Tons' },
    { id: 'pieces', name: 'Pieces' },
    { id: 'boxes', name: 'Boxes' },
    { id: 'bags', name: 'Bags' },
    { id: 'liters', name: 'Liters' }
  ];

  const qualityOptions = [
    { id: 'premium', name: 'Premium Grade' },
    { id: 'standard', name: 'Standard Grade' },
    { id: 'commercial', name: 'Commercial Grade' },
    { id: 'organic', name: 'Organic Certified' },
    { id: 'export-quality', name: 'Export Quality' }
  ];

  const deliveryOptions = [
    { id: '24-hours', name: 'Within 24 hours' },
    { id: '48-hours', name: 'Within 48 hours' },
    { id: '72-hours', name: 'Within 72 hours' },
    { id: '1-week', name: 'Within 1 week' },
    { id: 'pickup', name: 'Pickup only' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Mock image upload - in real app, upload to server
      const uploadedImages = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }));
      setImageFiles(prev => [...prev, ...files].slice(0, 5));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages].slice(0, 5) // Max 5 images
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required';
        if (!formData.basePrice || formData.basePrice <= 0) newErrors.basePrice = 'Valid base price is required';
        break;
      case 2:
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 3:
        if (formData.instantBuy && (!formData.instantBuyPrice || formData.instantBuyPrice <= formData.basePrice)) {
          newErrors.instantBuyPrice = 'Instant buy price must be higher than base price';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3 && !validateStep(currentStep)) {
      setCurrentStep(3);
      return;
    }
    if (!validateStep(3)) return;

    setCreating(true);
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      for (const key in formData) {
        if (key === 'images') {
          // Append actual File objects captured from input
          imageFiles.forEach(file => formDataToSend.append('images', file));
        } else if (key !== 'imagePreviews') {
          formDataToSend.append(key, formData[key]);
        }
      }
      
      // Add required fields for Firestore schema
      formDataToSend.append('farmerId', user.id);
      formDataToSend.append('stage', 'bidding');
      formDataToSend.append('status', 'active');

      const response = await fetch(withApiBase('/api/auctions'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      const text = await response.text();
      const result = text ? JSON.parse(text) : { success: false, message: 'Empty response from server' };
      
      if (result.success) {
        onAuctionCreated(result.auction);
        onClose();
        alert('Auction created successfully!');
      } else {
        alert(`Error creating auction: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Failed to create auction');
    } finally {
      setCreating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.productName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g., Fresh Organic Tomatoes"
            />
            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('category', category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.category === category.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                </button>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="100"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Starting Price (₹) *
              </label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => handleInputChange('basePrice', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.basePrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="1000"
                min="0"
                step="0.01"
              />
              {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Bid Increment (₹)
              </label>
              <input
                type="number"
                value={formData.minIncrement}
                onChange={(e) => handleInputChange('minIncrement', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="50"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auction Duration (Days)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Product Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Describe your product in detail..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality Grade
              </label>
              <select
                value={formData.quality}
                onChange={(e) => handleInputChange('quality', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {qualityOptions.map(quality => (
                  <option key={quality.id} value={quality.name}>{quality.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Time
              </label>
              <select
                value={formData.delivery}
                onChange={(e) => handleInputChange('delivery', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {deliveryOptions.map(delivery => (
                  <option key={delivery.id} value={delivery.name}>{delivery.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images * (Max 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-4xl mb-2">📷</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG up to 10MB each
                </div>
              </label>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Auction Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reserve Price (₹) - Optional
            </label>
            <input
              type="number"
              value={formData.reservePrice}
              onChange={(e) => handleInputChange('reservePrice', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Minimum price you'll accept"
              min="0"
              step="0.01"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              If no bid reaches this price, the auction won't sell
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoExtend"
                checked={formData.autoExtend}
                onChange={(e) => handleInputChange('autoExtend', e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="autoExtend" className="text-sm text-gray-700 dark:text-gray-300">
                Auto-extend auction if bids are placed in the last 5 minutes
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="instantBuy"
                checked={formData.instantBuy}
                onChange={(e) => handleInputChange('instantBuy', e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="instantBuy" className="text-sm text-gray-700 dark:text-gray-300">
                Enable instant buy option
              </label>
            </div>

            {formData.instantBuy && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instant Buy Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.instantBuyPrice}
                  onChange={(e) => handleInputChange('instantBuyPrice', parseFloat(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.instantBuyPrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Price for instant purchase"
                  min={formData.basePrice + 1}
                  step="0.01"
                />
                {errors.instantBuyPrice && <p className="text-red-500 text-sm mt-1">{errors.instantBuyPrice}</p>}
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Auction Summary</h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex justify-between">
                <span>Product:</span>
                <span className="font-medium">{formData.productName}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{formData.quantity} {formData.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span className="font-medium">₹{formData.basePrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{formData.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span>Images:</span>
                <span className="font-medium">{formData.images.length} uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create New Auction
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Step {currentStep} of 3
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step <= currentStep
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Product Details'}
              {currentStep === 3 && 'Auction Settings'}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : handlePrevious}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Auction'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
