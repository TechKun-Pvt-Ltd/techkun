import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12 sm:py-16">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </p>
        </header>
        
        <div className="space-y-10 sm:space-y-12">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              1. Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              TechKun is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              2. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  2.1 Information You Provide
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Contact information (name, email, phone number)</li>
                  <li>Business information (company name, role)</li>
                  <li>Project requirements and specifications</li>
                  <li>Payment information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Device information (IP address, browser type)</li>
                  <li>Usage data (pages visited, time spent)</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Continue with the same pattern for other sections */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Provide and improve our services</li>
              <li>Communicate about projects and updates</li>
              <li>Process payments and maintain accounts</li>
              <li>Analyze website performance and user behavior</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Add similar styling to remaining sections */}
          
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              10. Contact Us
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>For any privacy-related queries or to exercise your rights, contact us at:</p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="font-medium">Email: privacy@tech-kun.com</p>
                <p className="font-medium mt-2">Address: [Your Indian Office Address]</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Last updated: [Current Date]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}