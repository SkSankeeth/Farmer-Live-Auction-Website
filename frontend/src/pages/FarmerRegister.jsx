import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FarmerRegister = () => {
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
    farmName: '',
    farmSize: '',
    farmType: 'conventional',
    crops: '',
    certification: '',
    establishedYear: '' ,
    gstNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    bankAccountHolderName: ''
  });
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [farmImageFile, setFarmImageFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [farmPreview, setFarmPreview] = useState(null);
  const [error, setError] = useState('');
  
  const { registerFarmer, refreshUserData } = useAuth();
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
      if (!profileImageFile || !farmImageFile) {
        setError('Please upload both profile and farm images');
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
        farmDetails: {
          farmName: f.farmName,
          farmSize: Number(f.farmSize || 0),
          farmType: f.farmType,
          crops: f.crops ? f.crops.split(',').map(s => s.trim()).filter(Boolean) : [],
          certification: f.certification ? f.certification.split(',').map(s => s.trim()).filter(Boolean) : [],
          establishedYear: Number(f.establishedYear || new Date().getFullYear())
        },
        businessInfo: {
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
      const result = await registerFarmer(registrationData);
      if (result.success) {
        // Upload images using the token from registration response
        const token = result.data.token;
        try {
          // Upload profile image
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

          // Upload farm image
          const farmFormData = new FormData();
          farmFormData.append('image', farmImageFile);
          const farmResponse = await fetch('http://localhost:5000/api/uploads/farm', { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` }, 
            body: farmFormData 
          });
          const farmResult = await farmResponse.json();
          if (!farmResponse.ok || !farmResult.success) {
            throw new Error(farmResult.message || 'Farm image upload failed');
          }
          console.log('Farm image uploaded successfully:', farmResult);

          // Refresh user data to get updated image URLs
          await refreshUserData();
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          toast.error(uploadErr.message || 'Image upload failed');
        }
        toast.success('Registration successful! Welcome to OnlyFarmers.');
        navigate('/farmer-login');
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
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m5-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Register as Farmer
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join the OnlyFarmers community and start selling your produce
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Required images */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture *</label>
                <input type="file" accept="image/*" required onChange={(e)=>{ const f=e.target.files&&e.target.files[0]; setProfileImageFile(f||null); if(f){ const r=new FileReader(); r.onloadend=()=>setProfilePreview(r.result); r.readAsDataURL(f);} }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                {profilePreview && <img src={profilePreview} alt="Profile preview" className="mt-2 h-16 w-16 rounded-full object-cover" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Picture *</label>
                <input type="file" accept="image/*" required onChange={(e)=>{ const f=e.target.files&&e.target.files[0]; setFarmImageFile(f||null); if(f){ const r=new FileReader(); r.onloadend=()=>setFarmPreview(r.result); r.readAsDataURL(f);} }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                {farmPreview && <img src={farmPreview} alt="Farm preview" className="mt-2 h-20 w-32 rounded-md object-cover" />}
              </div>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
                <input id="addressStreet" name="addressStreet" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressStreet} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input id="addressCity" name="addressCity" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressCity} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="addressState" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <input id="addressState" name="addressState" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressState} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="addressPincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                <input id="addressPincode" name="addressPincode" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.addressPincode} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Name *</label>
                <input id="farmName" name="farmName" type="text" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.farmName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Size (acre)</label>
                <input id="farmSize" name="farmSize" type="number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.farmSize} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="farmType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Type</label>
                <select id="farmType" name="farmType" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.farmType} onChange={handleChange}>
                  <option value="conventional">Conventional</option>
                  <option value="organic">Organic</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label htmlFor="establishedYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Established Year</label>
                <input id="establishedYear" name="establishedYear" type="number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.establishedYear} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="crops" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crops (comma separated)</label>
              <input id="crops" name="crops" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.crops} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="certification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certifications (comma separated)</label>
              <input id="certification" name="certification" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.certification} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number</label>
                <input id="gstNumber" name="gstNumber" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.gstNumber} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PAN Number</label>
                <input id="panNumber" name="panNumber" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.panNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Account Number</label>
                <input id="bankAccountNumber" name="bankAccountNumber" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankAccountNumber} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="bankIfscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IFSC Code</label>
                <input id="bankIfscCode" name="bankIfscCode" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankIfscCode} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                <input id="bankName" name="bankName" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="bankAccountHolderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Holder Name</label>
                <input id="bankAccountHolderName" name="bankAccountHolderName" type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={formData.bankAccountHolderName} onChange={handleChange} />
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Farmer Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/farmer-login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                Sign in as Farmer
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegister;
