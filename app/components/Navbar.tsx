'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import techkunLogo from "@/public/Images/icon.png";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";
import { FaGlobe, FaCloud, FaMobile, FaRobot, FaBlog, FaBriefcase } from 'react-icons/fa';
import { Poppins } from 'next/font/google';

// Load Poppins font
const poppins = Poppins({
    weight: ['500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});


const services = [
    {
        title: 'Web App Development',
        description: 'Custom web applications built with modern technologies',
        href: '/services/web-development',
        icon: FaGlobe
    },
    {
        title: 'Cloud AI Solutions',
        description: 'Intelligent cloud-based solutions for your business',
        href: '/services/cloud-solutions',
        icon: FaCloud
    },
    {
        title: 'Mobile Development',
        description: 'Native and cross-platform mobile applications',
        href: '/services/app-development',
        icon: FaMobile
    },
    {
        title: 'AI Integration',
        description: 'Integrate AI capabilities into your existing systems',
        href: '/services/ai-integration',
        icon: FaRobot
    }
];

// New About Us links with icons
const aboutUsLinks = [
    {
        title: 'Blog',
        description: 'Insights, tutorials, and tech news from our team',
        href: '/blog',
        icon: FaBlog
    },
    {
        title: 'Careers',
        description: 'Join our team and build the future of technology',
        href: '/careers',
        icon: FaBriefcase
    }
];

const testimonial = {
    text: "TechKun transformed our business with their innovative solutions. The team's expertise and dedication were exceptional.",
    author: "John Smith",
    role: "CTO, Tech Innovations"
};

const toggleScrollLock = (lock: boolean) => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = lock ? 'hidden' : '';
    }
};

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
    const [isAboutUsMenuOpen, setIsAboutUsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (href: string) => {
        setIsMenuOpen(false);
        setIsServiceMenuOpen(false);
        setIsAboutUsMenuOpen(false);
        toggleScrollLock(false);
        router.push(href);
    };

    // Toggle menu and handle scroll lock
    const toggleMenu = () => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);
        if (!newState) {
            setIsServiceMenuOpen(false); // Close service menu when closing main menu
            setIsAboutUsMenuOpen(false); // Close about us menu when closing main menu
        }
        toggleScrollLock(newState);
    };

    // Toggle service submenu
    const toggleServiceMenu = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
        e.preventDefault();
        e.stopPropagation();
        setIsServiceMenuOpen(!isServiceMenuOpen);
        if (isAboutUsMenuOpen) setIsAboutUsMenuOpen(false); // Close about us menu when opening service menu
    };

    // Toggle about us submenu
    const toggleAboutUsMenu = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAboutUsMenuOpen(!isAboutUsMenuOpen);
        if (isServiceMenuOpen) setIsServiceMenuOpen(false); // Close service menu when opening about us menu
    };

    // Cleanup scroll lock on unmount
    useEffect(() => {
        return () => toggleScrollLock(false);
    }, []);

    return (
        <nav 
            className={`
                fixed top-0 w-full z-50 transition-all duration-300
                ${isScrolled ? 'bg-white shadow-md py-1' : 'bg-transparent py-3'}
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" onClick={() => {
                            setIsMenuOpen(false);
                            toggleScrollLock(false);
                        }} className="flex items-center space-x-3"> {/* Removed mt-2 pt-3 */}
                            <Image 
                                src={techkunLogo} 
                                alt="Logo" 
                                className="h-10 w-auto md:h-12"
                                width={48}
                                height={48}
                            />
                            <span className={`
                                ${poppins.className} 
                                text-xl font-poppins md:text-2xl 
                                transition-colors duration-300
                                ${isScrolled ? 'text-[#1E3A8A]' : 'text-white'}
                            `}>
                                TechKun
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {/* Services Dropdown */}
                        <div className="relative group">
                            <div className="flex items-center space-x-1">
                                {/* Services text link */}
                                <Link
                                    href="/services"
                                    className={`
                                        text-base font-medium transition-colors
                                        ${pathname === '/services'
                                            ? 'text-blue-600'
                                            : (isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200')}
                                    `}
                                >
                                    Services
                                </Link>
                                
                                {/* Dropdown toggle button - always visible */}
                                <button 
                                    className={`inline-flex items-center p-1 focus:outline-none transition-colors
                                        ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
                                    aria-label="Toggle services dropdown"
                                >
                                    <svg 
                                        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            {/* Mega Menu Dropdown */}
                            <div className="
                                absolute left-1/2 -translate-x-1/2 mt-2 w-[700px] opacity-0 invisible
                                group-hover:opacity-100 group-hover:visible transition-all duration-300
                                bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8 grid grid-cols-3 gap-8
                                border border-white/20
                            ">
                                {/* Services Grid */}
                                <div className="col-span-2 grid grid-cols-2 gap-8">
                                    {services.map((service) => {
                                        const Icon = service.icon;
                                        return (
                                            <Link
                                                key={service.href}
                                                href={service.href}
                                                className="group/item p-4 rounded-lg hover:bg-blue-50 transition-all duration-300
                                                    transform hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Icon className="h-5 w-5 text-blue-600 group-hover/item:text-blue-700 transition-colors" />
                                                    <h3 className="text-gray-900 font-semibold text-base group-hover/item:text-blue-600">
                                                        {service.title}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                            </Link>
                                        );
                                    })}
                                </div>
                                {/* Testimonial Card */}
                                <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6
                                    transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="mb-4">
                                        <svg className="h-8 w-8 text-blue-500 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                                            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                        </svg>
                                    </div>
                                    <blockquote className="text-gray-700 text-sm italic leading-relaxed mb-4">"{testimonial.text}"</blockquote>
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Us Dropdown */}
                        <div className="relative group">
                            <div className="flex items-center space-x-1">
                                {/* About Us text link */}
                                <Link
                                    href="/about-us"
                                    className={`
                                        text-base font-medium transition-colors
                                        ${pathname === '/about-us'
                                            ? 'text-blue-600'
                                            : (isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200')}
                                    `}
                                >
                                    About Us
                                </Link>
                                
                                {/* Dropdown toggle button - always visible */}
                                <button 
                                    className={`inline-flex items-center p-1 focus:outline-none transition-colors
                                        ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
                                    aria-label="Toggle about us dropdown"
                                >
                                    <svg 
                                        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            {/* About Us Dropdown Menu */}
                            <div className="
                                absolute left-1/2 -translate-x-1/2 mt-2 w-[500px] opacity-0 invisible
                                group-hover:opacity-100 group-hover:visible transition-all duration-300
                                bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8
                                border border-white/20
                            ">
                                <div className="grid grid-cols-1 gap-4">
                                    {aboutUsLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="group/item p-4 rounded-lg hover:bg-blue-50 transition-all duration-300
                                                    transform hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Icon className="h-5 w-5 text-blue-600 group-hover/item:text-blue-700 transition-colors" />
                                                    <h3 className="text-gray-900 font-semibold text-base group-hover/item:text-blue-600">
                                                        {link.title}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{link.description}</p>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Contact Us Button */}
                        <button 
                            onClick={() => handleNavigation('/contact-us')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Contact Us
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-md inline-flex items-center justify-center 
                                ${isScrolled ? 'text-gray-700' : 'text-white'}`} 
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle menu"
                        >
                            <span className="sr-only">
                                {isMenuOpen ? 'Close menu' : 'Open menu'}
                            </span>
                            {isMenuOpen ? (
                                <RiCloseFill className="h-6 w-6" />
                            ) : (
                                <RiMenu3Fill className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu - Full screen dark overlay */}
            <div
                className={`
                    md:hidden fixed inset-0 bg-gray-900 z-40
                    transition-all duration-300 ease-in-out flex flex-col items-center justify-center
                    ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                `}
            >
                {/* Close button positioned at the top right */}
                <button
                    onClick={toggleMenu}
                    className="absolute top-4 right-4 p-2 text-gray-100 hover:text-white"
                    aria-label="Close menu"
                >
                    <RiCloseFill className="h-8 w-8" />
                </button>
                
                {/* Navigation Links */}
                <div className="flex flex-col items-center space-y-6 w-full px-8 py-8">
                    {/* Services Link with Dropdown */}
                    <div className="w-full max-w-xs flex flex-col items-center ">
                        <div className="flex items-center justify-center w-full pl-4">
                            {/* Services link - clickable text */}
                            <a
                                href="/services"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation('/services');
                                }}
                                className="text-2xl font-medium text-gray-100 hover:text-white 
                                    transition-all duration-300 tracking-wide mr-2"
                            >
                                Services
                            </a>
                            
                            {/* Dropdown toggle button - separate from the link */}
                            <button
                                onClick={toggleServiceMenu}
                                className="p-1 text-gray-300 hover:text-white transition-colors duration-200"
                                aria-label="Toggle services menu"
                            >
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-300 ${isServiceMenuOpen ? 'rotate-180' : ''}`} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Services Submenu */}
                        <div 
                            className={`
                                w-full mt-4 flex flex-col items-center justify-center space-y-4 overflow-hidden transition-all duration-300 ease-in-out
                                ${isServiceMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="w-full bg-gray-800 rounded-lg p-4 shadow-lg">
                                {services.map((service) => {
                                    const Icon = service.icon;
                                    return (
                                        <a
                                            key={service.href}
                                            href={service.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigation(service.href);
                                            }}
                                            className="flex items-center space-x-3 p-3 text-gray-200 hover:text-white hover:bg-gray-700 
                                                rounded-md transition-all duration-300 mb-2 last:mb-0 group"
                                        >
                                            <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                                            <div>
                                                <p className="text-base font-medium">{service.title}</p>
                                                <p className="text-xs text-gray-400 group-hover:text-gray-300">{service.description}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* About Us Link with Dropdown */}
                    <div className="w-full max-w-xs flex flex-col items-center ">
                        <div className="flex items-center justify-center w-full pl-4">
                            {/* About Us link - clickable text */}
                            <a
                                href="/about-us"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation('/about-us');
                                }}
                                className="text-2xl font-medium text-gray-100 hover:text-white 
                                    transition-all duration-300 tracking-wide mr-2"
                            >
                                About Us
                            </a>
                            
                            {/* Dropdown toggle button - separate from the link */}
                            <button
                                onClick={toggleAboutUsMenu}
                                className="p-1 text-gray-300 hover:text-white transition-colors duration-200"
                                aria-label="Toggle about us menu"
                            >
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-300 ${isAboutUsMenuOpen ? 'rotate-180' : ''}`} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* About Us Submenu */}
                        <div 
                            className={`
                                w-full mt-4 flex flex-col items-center justify-center space-y-4 overflow-hidden transition-all duration-300 ease-in-out
                                ${isAboutUsMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="w-full bg-gray-800 rounded-lg p-4 shadow-lg">
                                {aboutUsLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigation(link.href);
                                            }}
                                            className="flex items-center space-x-3 p-3 text-gray-200 hover:text-white hover:bg-gray-700 
                                                rounded-md transition-all duration-300 mb-2 last:mb-0 group"
                                        >
                                            <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                                            <div>
                                                <p className="text-base font-medium">{link.title}</p>
                                                <p className="text-xs text-gray-400 group-hover:text-gray-300">{link.description}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Button */}
                    <button
                        onClick={() => handleNavigation('/contact-us')}
                        className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg 
                            hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
