'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DarkPatternBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  height?: string; // Allows customizing the height
  children?: React.ReactNode;
}

const DarkPatternBanner: React.FC<DarkPatternBannerProps> = ({
  title,
  subtitle,
  description,
  height = 'h-[50vh] min-h-[400px]',
  children
}) => {
  return (
    <div className={`relative w-full ${height} flex flex-col justify-center items-center overflow-hidden`}>
      {/* Dark background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 z-10"></div>
      
      {/* SVG Pattern Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full opacity-40" 
          style={{
            backgroundImage: `url('/Images/blog-pattern.svg')`,
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {title}
            {subtitle && <span className="block mt-2 text-blue-300">{subtitle}</span>}
          </h1>
          {description && (
            <p className="text-xl text-gray-200 mb-8">
              {description}
            </p>
          )}
          {children}
        </motion.div>
      </div>
      
      {/* Bottom fade effect for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
    </div>
  );
};

export default DarkPatternBanner;