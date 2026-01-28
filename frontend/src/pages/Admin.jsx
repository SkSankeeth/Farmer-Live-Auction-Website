import React from 'react';

const Admin = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Portal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Access administrative tools and manage farm operations, staff, and business performance. 
          Optimize your agricultural business with our comprehensive admin dashboard.
        </p>
      </section>

      {/* Placeholder Content */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Admin Dashboard Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We're building a powerful admin portal with tools for managing farm operations, tracking performance, and optimizing your agricultural business.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
          Access Admin Portal
        </button>
      </section>
    </div>
  );
};

export default Admin;

