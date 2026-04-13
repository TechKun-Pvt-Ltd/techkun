'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const ServiceBanner = () => {
    const pathname = usePathname();
    
    // Determine which service page we're on to customize content
    const getServiceInfo = () => {
        if (pathname.includes('web-development')) {
            return {
                title: "Web Development",
                subtitle: "That Delivers Results",
                description: "Create powerful, scalable, and beautiful web applications",
                pattern: "web-pattern.svg",
                color: "from-blue-900/80 to-indigo-900/80"
            };
        } else if (pathname.includes('app-development')) {
            return {
                title: "Mobile App Development",
                subtitle: "For Modern Businesses",
                description: "Transform your ideas into powerful mobile applications",
                pattern: "app-pattern.svg",
                color: "from-indigo-900/80 to-purple-900/80"
            };
        } else if (pathname.includes('cloud-solutions')) {
            return {
                title: "Cloud Solutions",
                subtitle: "For The Digital Age",
                description: "Scale your business with secure, reliable infrastructure",
                pattern: "cloud-pattern.svg",
                color: "from-blue-900/80 to-cyan-900/80"
            };
        } else if (pathname.includes('ai-integration')) {
            return {
                title: "AI Integration",
                subtitle: "Powering Smart Solutions",
                description: "Transform your business with cutting-edge AI solutions",
                pattern: "ai-pattern.svg",
                color: "from-purple-900/80 to-indigo-900/80"
            };
        } else {
            return {
                title: "Our Services",
                subtitle: "Tailored Solutions",
                description: "Custom software solutions to elevate your business",
                pattern: "services-pattern.svg",
                color: "from-gray-900/80 to-blue-900/80"
            };
        }
    };

    const serviceInfo = getServiceInfo();
    
    return (
        <div className="relative w-full h-[80vh] min-h-[700px] flex flex-col justify-center items-center overflow-hidden">
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${serviceInfo.color} z-10`}></div>
            
            {/* SVG Pattern Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div 
                    className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" 
                    style={{
                        backgroundImage: `url('/Images/Services/${serviceInfo.pattern}')`,
                        backgroundSize: '600px 600px',
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
                    <h1 className="text-5xl sm:text-6xl font-bold mb-4">
                        {serviceInfo.title}
                        <span className="block mt-2 text-blue-300">{serviceInfo.subtitle}</span>
                    </h1>
                    <p className="text-xl text-gray-200 mb-8">
                        {serviceInfo.description}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white text-gray-900 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                    >
                        <Link href="/contact-us">Start Your Project</Link>
                    </motion.button>
                </motion.div>
            </div>
            
            {/* Decorative elements - Extended gradient fade for smoother transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
        </div>
    );
};

export default ServiceBanner;