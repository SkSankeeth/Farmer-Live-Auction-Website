import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

