"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { StaticImageData } from 'next/image';

// Note: Image imports would remain the same in your actual implementation
// This is just a reference to what was in the original code
import imageMobileApp from '@/public/Images/services-images/services-layout.jpg';
import imageCustomDev from '@/public/Images/services-images/services-layout3.jpg';
import imageServices from '@/public/Images/services-images/services-layout6.png';
import imageServices1 from '@/public/Images/services-images/services-layout4.jpg';
import imageAiML from '@/public/Images/services-images/services-layout7.jpg';

export default function ServicesBody() {
    const [expandedService, setExpandedService] = useState<number | null>(null);

    const toggleService = (index: number): void => {
        setExpandedService(expandedService === index ? null : index);
    };

    const serviceItems = [
        {
            title: "AI & Machine Learning Solutions",
            description: "Leverage the power of artificial intelligence to transform your business operations. Our AI and machine learning solutions help you uncover insights, automate processes, and improve decision-making.",
            subItems: ["Data Science & Analytics", "Predictive Analytics", "Natural Language Processing (NLP)", "Computer Vision"],
            image: imageAiML,
            imageAltText: "AI and Machine Learning illustration",
            icon: "✨",
            color: "from-indigo-600 to-purple-600",
        },
        {
            title: "Mobile Application Development",
            description: "We deliver mobile applications that provide exceptional user experiences and meet the demands of today's digital landscape. From concept to launch, we guide you through the entire mobile app development process.",
            subItems: ["Native App Development", "Hybrid App Development", "UI/UX Design", "App Store Deployment & Support"],
            image: imageMobileApp,
            imageAltText: "Mobile application development illustration",
            icon: "📱",
            color: "from-blue-600 to-cyan-500",
        },
        {
            title: "Custom Software Development",
            description: "We design and build bespoke software solutions tailored to your specific business needs. Whether you're looking to develop a new product or enhance existing systems, our custom software development services ensure that your solution is fully aligned with your goals.",
            subItems: ["Performance Optimization", "Cross-Platform Development", "API Development & Integration", "Full-Stack Development"],
            image: imageCustomDev,
            imageAltText: "Custom software development illustration",
            icon: "💻",
            color: "from-teal-600 to-green-500",
        },
        {
            title: "Cloud Development & Migration",
            description: "Harness the power of the cloud with our cloud development and migration services, designed to optimize your infrastructure and reduce costs while ensuring scalability and security.",
            subItems: ["Cloud-Native Development", "Cloud Migration", "Serverless Architectures", "Cloud Security"],
            image: imageServices1,
            imageAltText: "Cloud development illustration",
            icon: "☁️",
            color: "from-sky-600 to-blue-500",
        },
        {
            title: "Enterprise Software Solutions",
            description: "Our enterprise-grade software development services focus on building robust, scalable systems that streamline operations and enhance business efficiency.",
            subItems: ["ERP Systems", "CRM Solutions", "Workflow Automation", "Data Management Systems"],
            image: imageServices,
            imageAltText: "Enterprise software solutions illustration",
            icon: "🏢",
            color: "from-orange-600 to-red-500",
        },
    ];

    interface ServiceItem {
        title: string;
        description: string;
        subItems: string[];
        image: StaticImageData;
        imageAltText: string;
        icon: string;
        color: string;
    }

    interface ServiceCardProps {
        item: ServiceItem;
        index: number;
    }

    const ServiceCard = ({ item, index }: ServiceCardProps) => {
        const isExpanded = expandedService === index;
        const isEven = index % 2 === 0;

        return (
            <div 
                className={`group py-16 md:py-24 transition-colors duration-500 ${isEven ? "bg-white" : "bg-gray-50"}`}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}>
                        {/* Image Section with Hover Effect */}
                        <div className="w-full md:w-1/2">
                            <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                                <Image
                                    className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                                    src={item.image}
                                    alt={item.imageAltText}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    {/* Remove the problematic span and keep only the correct one */}
                                    <span className={`inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br shadow-md ${item.color} text-white text-2xl`}>
                                        {item.icon}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{item.title}</h3>
                                </div>
                                
                                <p className="text-lg text-gray-600 leading-relaxed">{item.description}</p>
                                
                                <div 
                                    className="cursor-pointer flex items-center gap-2 font-medium text-primary-700 hover:text-primary-900 transition-colors duration-300"
                                    onClick={() => toggleService(index)}
                                >
                                    <span>View capabilities</span>
                                    {isExpanded ? 
                                        <ChevronDown className="h-5 w-5" /> : 
                                        <ChevronRight className="h-5 w-5" />
                                    }
                                </div>
                                
                                <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                            {item.subItems.map((subItem, idx) => (
                                                <li key={idx} className="flex items-center gap-2 py-2">
                                                    <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${item.color}`}></span>
                                                    <span className="text-gray-700">{subItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
            
            {/* Header Section */}
            <div className="relative py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-block mb-4 px-6 py-2 bg-primary-50 rounded-full text-primary-700 font-medium">
                        Our Expertise
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        <span className="text-primary-700">Our Area of Expertise </span>
                        <span className="text-gray-800">Encompasses...</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        Discover our comprehensive range of technology solutions designed to transform your business and drive innovation.
                    </p>
                </div>
            </div>

            {/* Services Cards Section */}
            <div className="relative">
                {serviceItems.map((item, index) => (
                    <ServiceCard key={index} item={item} index={index} />
                ))}
            </div>
        </div>
    );
}