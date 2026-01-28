import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressPincode: '',
    businessName: '',
    businessType: 'retailer',
    gstNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankAccountHolderName: ''
  });
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [error, setError] = useState('');
  
  const { registerBuyer, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      if (!profileImageFile) {
        setError('Please upload a profile picture');
        setLoading(false);
        return;
      }
      const { confirmPassword, ...f } = formData;
      const registrationData = {
        firstName: f.firstName,
        lastName: f.lastName,
        email: f.email,
        password: f.password,
        phone: f.phone,
        address: {
          street: f.addressStreet,
          city: f.addressCity,
          state: f.addressState,
          pincode: f.addressPincode,
          coordinates: { latitude: 0, longitude: 0 }
        },
        businessInfo: {
          businessName: f.businessName,
          businessType: f.businessType,
          gstNumber: f.gstNumber,
          panNumber: f.panNumber,
          bankDetails: {
            accountNumber: f.bankAccountNumber,
            ifscCode: f.bankIfscCode,
            bankName: f.bankName,
            accountHolderName: f.bankAccountHolderName
          }
        }
      };
      const result = await registerBuyer(registrationData);
      if (result.success) {
        // Upload profile image using the token from registration response
        const token = result.data.token;
        try {
          const profileFormData = new FormData();
          profileFormData.append('image', profileImageFile);
          const profileResponse = await fetch('http://localhost:5000/api/uploads/profile', { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` }, 
            body: profileFormData 
          });
          const profileResult = await profileResponse.json();
          if (!profileResponse.ok || !profileResult.success) {
            throw new Error(profileResult.message || 'Profile image upload failed');
          }
          console.log('Profile image uploaded successfully:', profileResult);

          // Refresh user data to get updated image URLs
          await refreshUserData();
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          toast.error(uploadErr.message || 'Image upload failed');
        }
        toast.success('Registration successful! Welcome to OnlyFarmers.');
        navigate('/buyer-login');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Register as Buyer
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join the OnlyFarmers community and start buying fresh produce
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Required profile image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture *</label>
              <input type="file" accept="image/*" required onChange={(e)=>{ const f=e.target.files&&e.target.files[0]; setProfileImageFile(f||null); if(f){ const r=new FileReader(); r.onloadend=()=>setProfilePreview(r.result); r.readAsDataURL(f);} }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              {profilePreview && <img src={profilePreview} alt="Profile preview" className="mt-2 h-16 w-16 rounded-full object-cover" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
                <input id="addressStreet" name="addressStreet" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressStreet} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input id="addressCity" name="addressCity" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressCity} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="addressState" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <input id="addressState" name="addressState" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressState} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="addressPincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                <input id="addressPincode" name="addressPincode" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressPincode} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
                <input id="businessName" name="businessName" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.businessName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type</label>
                <select id="businessType" name="businessType" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.businessType} onChange={handleChange}>
                  <option value="retailer">Retailer</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="wholesale">Wholesaler</option>
                  <option value="corporate">Corporate</option>
                  <option value="exporter">Exporter</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number</label>
                <input id="gstNumber" name="gstNumber" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.gstNumber} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PAN Number</label>
                <input id="panNumber" name="panNumber" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.panNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Account Number</label>
                <input id="bankAccountNumber" name="bankAccountNumber" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankAccountNumber} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="bankIfscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IFSC Code</label>
                <input id="bankIfscCode" name="bankIfscCode" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankIfscCode} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                <input id="bankName" name="bankName" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="bankAccountHolderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Holder Name</label>
                <input id="bankAccountHolderName" name="bankAccountHolderName" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankAccountHolderName} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Buyer Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/buyer-login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in as Buyer
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerRegister;
