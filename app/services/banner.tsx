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
                bgPattern: "url('/Images/Services/web-pattern.svg')",
                icon: "code"
            };
        } else if (pathname.includes('app-development')) {
            return {
                title: "Mobile App Development",
                subtitle: "For Modern Businesses",
                description: "Transform your ideas into powerful mobile applications",
                bgPattern: "url('/Images/Services/app-pattern.svg')",
                icon: "smartphone"
            };
        } else if (pathname.includes('cloud-solutions')) {
            return {
                title: "Cloud Solutions",
                subtitle: "For The Digital Age",
                description: "Scale your business with secure, reliable infrastructure",
                bgPattern: "url('/Images/Services/cloud-pattern.svg')",
                icon: "cloud"
            };
        } else if (pathname.includes('ai-integration')) {
            return {
                title: "AI Integration",
                subtitle: "Powering Smart Solutions",
                description: "Transform your business with cutting-edge AI solutions",
                bgPattern: "url('/Images/Services/ai-pattern.svg')",
                icon: "brain"
            };
        } else {
            return {
                title: "Our Services",
                subtitle: "Tailored Solutions",
                description: "Custom software solutions to elevate your business",
                bgPattern: "url('/Images/Services/services-pattern.svg')",
                icon: "settings"
            };
        }
    };

    const serviceInfo = getServiceInfo();

    // Icon components
    const renderIcon = () => {
        switch (serviceInfo.icon) {
            case "code":
                return (
                    <svg className="w-16 h-16 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                );
            case "smartphone":
                return (
                    <svg className="w-16 h-16 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case "cloud":
                return (
                    <svg className="w-16 h-16 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                );
            case "brain":
                return (
                    <svg className="w-16 h-16 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-16 h-16 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
            {/* Abstract tech background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/Images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            </div>

            {/* Digital circuit lines */}
            <div className="absolute inset-0">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="text-blue-500/5" fill="none" stroke="currentColor" strokeWidth="0.5" d="M0,50 Q25,30 50,50 T100,50" />
                    <path className="text-purple-500/5" fill="none" stroke="currentColor" strokeWidth="0.5" d="M0,30 Q35,50 70,30 T100,30" />
                    <path className="text-cyan-500/5" fill="none" stroke="currentColor" strokeWidth="0.5" d="M0,70 Q50,30 50,70 T100,70" />
                </svg>
            </div>

            {/* Glowing orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>

            {/* Service-specific icon */}
            <div className="absolute right-10 bottom-10 opacity-30 transform rotate-12">
                {renderIcon()}
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                        {serviceInfo.title}
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-1">
                            {serviceInfo.subtitle}
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
                        {serviceInfo.description}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
                    >
                        <Link href="/contact-us">Get Started</Link>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default ServiceBanner;
