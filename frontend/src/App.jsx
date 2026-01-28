import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import MobileOptimized from './components/MobileOptimized';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import Farmers from './pages/Farmers';
import Buyers from './pages/Buyers';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import SuperAdmin from './pages/SuperAdmin';
import FarmerLogin from './pages/FarmerLogin';
import BuyerLogin from './pages/BuyerLogin';
import FarmerAdminLogin from './pages/FarmerAdminLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import FarmerRegister from './pages/FarmerRegister';
import BuyerRegister from './pages/BuyerRegister';
import FarmerAdminRegister from './pages/FarmerAdminRegister';
import SuperAdminRegister from './pages/SuperAdminRegister';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import FarmerAdminDashboard from './pages/FarmerAdminDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import TransporterLogin from './pages/TransporterLogin';
import TransporterRegister from './pages/TransporterRegister';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MobileOptimized>
            <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auctions" element={<Auctions />} />
                <Route path="farmers" element={<Farmers />} />
                <Route path="buyers" element={<Buyers />} />
                <Route path="admin" element={<Admin />} />
                <Route path="contact" element={<Contact />} />
                <Route path="super-admin" element={<SuperAdmin />} />
              </Route>
            
            {/* Authentication routes (without layout) */}
            <Route path="/farmer-login" element={<FarmerLogin />} />
            <Route path="/buyer-login" element={<BuyerLogin />} />
            <Route path="/farmer-admin-login" element={<FarmerAdminLogin />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            <Route path="/transporter-login" element={<TransporterLogin />} />
            
            {/* Registration routes */}
            <Route path="/farmer-register" element={<FarmerRegister />} />
            <Route path="/buyer-register" element={<BuyerRegister />} />
            <Route path="/farmer-admin-register" element={<FarmerAdminRegister />} />
            <Route path="/super-admin-register" element={<SuperAdminRegister />} />
            <Route path="/transporter-register" element={<TransporterRegister />} />
                   
                   {/* Dashboard routes */}
                   <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/farmer-admin-dashboard" element={<FarmerAdminDashboard />} />
        <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
                 </Routes>
            </Router>
          </MobileOptimized>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
