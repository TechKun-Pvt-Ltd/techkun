'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Poppins, Roboto } from 'next/font/google';

const _poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'] 
});

const _roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'] 
});

const Banner = () => {
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll position
  const headingOpacity = Math.max(0, Math.min(1, 1 - scrollY / 300));
  const subTextOpacity = Math.max(0, Math.min(1, 1 - scrollY / 350));
  const buttonOpacity = Math.max(0, Math.min(1, 1 - scrollY / 400));

  // Calculate transform for parallax effect
  const headingTransform = `translateY(${scrollY * 0.1}px)`;
  const subTextTransform = `translateY(${scrollY * 0.15}px)`;
  const buttonTransform = `translateY(${scrollY * 0.2}px)`;

  const bannerImg = {
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/Images/landing-page-banner/landing-banner3.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className="relative w-full flex flex-col justify-center items-start min-h-screen"
      style={{
        ...bannerImg,
        boxSizing: 'border-box',
        height: '100vh', // Ensure full viewport height
      }}
    >
      <div className="case-responsive-container px-4 py-16 text-white w-full max-w-7xl mx-auto">
        <div className="w-full md:w-7/12">
          <h1
            className="mb-4 banner-heading"
            style={{
              overflowWrap: 'normal',
              opacity: headingOpacity,
              transform: headingTransform,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          >
            <span className="text-primary-700">EMPOWERING INNOVATIONS,</span>
            <br />
            DELIVERING EXCELLENCE
          </h1>
          <p
            className="mb-6 banner-subtext text-white"
            style={{
              opacity: subTextOpacity,
              transform: subTextTransform,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          >
            Partnering with medium to large enterprises, we specialize in catalyzing digital business transformations,
            delivering agile and innovative solutions for competitive growth.
          </p>
        </div>
        <Link href="/contact-us">
          <button
            className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-primary-500 hover:text-white"
            style={{
              opacity: buttonOpacity,
              transform: buttonTransform,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          >
            Connect with us
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;