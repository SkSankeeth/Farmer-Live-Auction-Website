import React from 'react';

const SuperAdmin = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Super Admin Portal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          System-wide administrative access for platform management, user oversight, and platform optimization. 
          Full control over the OnlyFarmers ecosystem.
        </p>
      </section>

      {/* Placeholder Content */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Super Admin Access Required
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This portal provides system-wide administrative access. Please ensure you have the proper credentials and permissions to access this area.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
          Access Super Admin Portal
        </button>
      </section>
    </div>
  );
};

export default SuperAdmin;

