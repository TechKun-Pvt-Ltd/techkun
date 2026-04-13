"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import linkedIn from "@/public/Images/Footer-icons/icons8-linkedin 2.svg";
import Xtwitter from "@/public/Images/Footer-icons/icons8-x.svg";
import techkunLogo from '@/app/icon.ico';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentYear = new Date().getFullYear();
  
  // Check if footer is in viewport for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const footer = document.getElementById("premium-footer");
    if (footer) observer.observe(footer);
    
    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <footer 
      id="premium-footer"
      className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white pt-12 pb-6 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-600 rounded-full opacity-5 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Brand Column */}
          <motion.div className="md:col-span-3" variants={fadeInLeft}>
            <motion.div 
              className="flex items-center mb-4 group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="relative w-10 h-10 flex items-center justify-center mr-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm overflow-hidden group-hover:bg-opacity-20 transition duration-300">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image 
                    src={techkunLogo} 
                    alt="TechKun Logo" 
                    className="w-6 h-6" 
                    width={24}
                    height={24}
                  />
                </motion.div>
              </Link>
              <motion.h1 
                className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                TechKun
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 text-xs leading-relaxed max-w-xs mb-4"
              variants={itemVariants}
            >
              Pioneering digital solutions that transform businesses.
            </motion.p>
            
            {/* Social Media Icons with hover animations */}
            <motion.div className="flex space-x-3" variants={itemVariants}>
              <motion.a 
                href="https://www.linkedin.com/company/techkunex/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-blue-600 transition-all duration-300"
                whileHover={{ y: -3 }}
                aria-label="LinkedIn"
              >
                <Image src={linkedIn} alt="LinkedIn" width={16} height={16} />
              </motion.a>
              <motion.a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-gray-700 transition-all duration-300"
                whileHover={{ y: -3 }}
                aria-label="X (Twitter)"
              >
                <Image src={Xtwitter} alt="X (Twitter)" width={16} height={16} />
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Links Columns with staggered animations */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.h3 
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
              whileHover={{ color: "#ffffff" }}
            >
              Company
            </motion.h3>
            <ul className="space-y-2">
              {["About", "Careers", "Blog"].map((item, index) => (
                <motion.li key={item}
                  custom={index}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: i => ({
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.1 }
                    })
                  }}
                >
                  <Link href={`/${item.toLowerCase()}`} className="group flex items-center text-gray-300 hover:text-white transition-colors duration-200 text-xs">
                    <motion.span 
                      className="w-0 h-px bg-blue-400 mr-0 opacity-0 group-hover:w-2 group-hover:mr-1 group-hover:opacity-100 transition-all duration-300"
                    ></motion.span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.h3 
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
              whileHover={{ color: "#ffffff" }}
            >
              Services
            </motion.h3>
            <ul className="space-y-2">
              {[
                { title: "Web Development", path: "/services/web-development" },
                { title: "App Development", path: "/services/app-development" },
                { title: "Cloud Solutions", path: "/services/cloud-solutions" },
                { title: "AI Integration", path: "/services/ai-integration" }
              ].map((item, index) => (
                <motion.li key={item.title}
                  custom={index}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: i => ({
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.1 }
                    })
                  }}
                >
                  <Link href={item.path} className="group flex items-center text-gray-300 hover:text-white transition-colors duration-200 text-xs">
                    <motion.span 
                      className="w-0 h-px bg-blue-400 mr-0 opacity-0 group-hover:w-2 group-hover:mr-1 group-hover:opacity-100 transition-all duration-300"
                    ></motion.span>
                    {item.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Our Offices - Simplified with just flags */}
          <motion.div className="md:col-span-2" variants={fadeInRight}>
            <motion.h3 
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
              whileHover={{ color: "#ffffff" }}
            >
              Our Offices
            </motion.h3>
             
            <div className="flex space-x-4">
              {/* Turkey Flag - Larger version */}
              <motion.div 
                className="p-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-lg hover:bg-opacity-10 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -3 }}
                title="Istanbul, Turkey"
              >
                <div className="w-14 h-8 rounded overflow-hidden relative">
                  {/* Red background - Official Turkish flag red */}
                  <div className="absolute inset-0" style={{ backgroundColor: '#E30A17' }}></div>
                  <div className="absolute inset-0 flex items-center">
                    {/* Crescent and star container - positioned according to official specs */}
                    <div className="relative ml-[45%]">
                      {/* Outer white circle of crescent */}
                      <div 
                        className="absolute bg-white rounded-full" 
                        style={{ width: '2rem', height: '2rem', transform: 'translate(-50%, -50%)' }}
                      ></div>
                      {/* Inner red circle of crescent */}
                      <div 
                        className="absolute rounded-full" 
                        style={{ 
                          width: '1.75rem', 
                          height: '1.75rem', 
                          backgroundColor: '#E30A17',
                          transform: 'translate(-35%, -50%)'
                        }}
                      ></div>
                      {/* Five-pointed star */}
                      <div 
                        className="absolute bg-white" 
                        style={{
                          width: '1rem',
                          height: '1rem',
                          transform: 'translate(15%, -50%) rotate(25deg)',
                          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* India Flag - Larger version */}
              <motion.div 
                className="p-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-lg hover:bg-opacity-10 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -3 }}
                title="Gurgaon, India"
              >
                <div className="w-14 h-8 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 bg-orange-500"></div>
                    <div className="flex-1 bg-white"></div>
                    <div className="flex-1 bg-green-600"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* <Link href="/contact">
              <motion.button
                className="text-xs flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group mt-2"
                variants={itemVariants}
                whileHover={{ x: 3 }}
              >
                <span>View all locations</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </Link> */}
          </motion.div>
          
          {/* Newsletter - Moved to the right column */}
          <motion.div className="md:col-span-3" variants={fadeInRight}>
            <motion.h3 
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
              whileHover={{ color: "#ffffff" }}
            >
              Stay Connected
            </motion.h3>
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="mb-2"
              variants={itemVariants}
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div 
                    key="input"
                    className={`relative overflow-hidden rounded-lg transition-all duration-300 ${isEmailFocused ? 'ring-1 ring-blue-500/50' : 'ring-1 ring-white/20'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      className="w-full bg-white bg-opacity-10 backdrop-blur-sm py-2 pl-3 pr-10 text-xs text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                    <motion.button
                      type="submit"
                      className="absolute right-0 top-0 h-full px-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                      whileHover={{ backgroundColor: "rgba(37, 99, 235, 1)" }}
                    >
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        initial={{ x: 0 }}
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg p-2 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-green-400 mr-2"
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </motion.svg>
                    <span className="text-xs text-green-400">Thank you for subscribing!</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.p 
                className="text-xs text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                We respect your privacy.
              </motion.p>
            </motion.form>
          </motion.div>
        </motion.div>
        
        {/* Bottom bar with reveal animation */}
        <motion.div 
          className="mt-8 pt-4 border-t border-white border-opacity-10 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.p 
            className="text-xs text-gray-400 mb-2 md:mb-0"
            whileHover={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            © {currentYear} TechKun. All rights reserved.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center space-x-4 text-xs text-gray-400"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {["Terms", "Privacy", "Cookies"].map((item, i) => (
              <motion.div key={item} custom={i} variants={itemVariants}>
                <Link 
                  href={`/${item.toLowerCase()}`} 
                  className="hover:text-white transition-colors duration-200 text-xs"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}