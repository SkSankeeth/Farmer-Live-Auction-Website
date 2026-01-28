import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          About OnlyFarmers
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We're on a mission to revolutionize agriculture by connecting farmers directly with consumers and businesses, creating sustainable and profitable farming communities.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At OnlyFarmers, we believe that farming is the backbone of our society. Our platform empowers farmers by providing them with direct access to markets, fair pricing, and the tools they need to succeed in today's competitive agricultural landscape.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            We're committed to sustainable farming practices, supporting local communities, and ensuring that fresh, quality produce reaches consumers while farmers receive fair compensation for their hard work.
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Passion for Agriculture
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Driven by our love for farming and commitment to supporting agricultural communities worldwide.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Continuously improving farming practices through technology and innovative solutions.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sustainability
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Promoting eco-friendly farming methods that protect our environment for future generations.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Building strong relationships between farmers, consumers, and local communities.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Our Story
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
          Founded by a team of agricultural enthusiasts and technology experts, OnlyFarmers was born from the vision of creating a more connected and sustainable farming ecosystem. We saw the challenges that farmers face in reaching markets and decided to build a platform that bridges the gap between farm and table.
        </p>
        <div className="text-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Join Our Community
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;

