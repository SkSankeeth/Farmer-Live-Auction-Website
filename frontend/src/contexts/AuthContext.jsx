import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Initialize token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Initializing token from localStorage:', storedToken);
    if (storedToken && storedToken.trim() !== '' && storedToken !== 'null' && storedToken !== 'undefined' && storedToken.split('.').length === 3) {
      setToken(storedToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setLoading(false); // Set loading to false if no token
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Auth check starting, token:', token);
      // Basic JWT format check (should have 3 parts separated by dots)
      const isValidTokenFormat = token && token.trim() !== '' && token !== 'null' && token !== 'undefined' && token.split('.').length === 3;
      
      if (isValidTokenFormat) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Auth successful, user:', data.user);
            setUser(data.user);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        // No token or invalid token format, user is not authenticated
        console.log('No valid token, user not authenticated');
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Run authentication check on mount
  useEffect(() => {
    const checkAuthOnMount = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken.trim() !== '' && storedToken !== 'null' && storedToken !== 'undefined' && storedToken.split('.').length === 3) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Mount auth successful, user:', data.user);
            setUser(data.user);
            setToken(storedToken);
          } else {
            console.log('Mount auth failed, clearing token');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Mount auth error:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthOnMount();
  }, []);

  // Login function
  const login = async (email, password, userType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, userType })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful, setting user:', data.user);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Registration functions
  const registerFarmer = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/farmer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Farmer registration error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const registerBuyer = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/buyer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Buyer registration error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const registerFarmerAdmin = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/farmer-admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Farmer Admin registration error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const registerSuperAdmin = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/super-admin/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Super Admin registration error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user state
        setUser(prevUser => ({ ...prevUser, ...profileData }));
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data refreshed:', data.user);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        console.error('Failed to refresh user data');
        return { success: false };
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return { success: false };
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
  };

  // Check if user is specific type
  const isUserType = (userType) => {
    if (!user) return false;
    return user.userType === userType;
  };

  const value = {
    user,
    token,
    loading,
    login,
    registerFarmer,
    registerBuyer,
    registerFarmerAdmin,
    registerSuperAdmin,
    logout,
    updateProfile,
    changePassword,
    refreshUserData,
    hasRole,
    isUserType,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
