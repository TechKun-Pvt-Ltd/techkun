'use client';
import Image, { StaticImageData } from 'next/image'
import { RxExternalLink } from "react-icons/rx";
import Link from 'next/link';
import Banner from './components/Banner';
import AboutUs from './components/AboutUs';

import imageMobileApp1 from '@/public/Images/landing-page-images/Health Tech.jpeg';
import imageMobileApp2 from '@/public/Images/landing-page-images/Ed-tech.jpeg';
import imageMobileApp3 from '@/public/Images/landing-page-images/Food-tech.jpeg';
import imageMobileApp4 from '@/public/Images/landing-page-images/Logistics.jpeg';
import aiimg from '@/public/Images/service-landing-page/ai2.webp';
import mobimg from '@/public/Images/service-landing-page/App Development.jpeg';
import imLogo from "@/public/Images/logos/im-logo.webp";
import productivitiLogo from "@/public/Images/logos/productiviti-logo.png";
import hiretalenttLogo from "@/public/Images/logos/hiretalentt-logo.png";
import productivitiImage from "@/public/Images/productiviti-images/productiviti.webp";
import hiretalenttImage from "@/public/Images/hiretalentt-images/hiretalentt.png";
import WhyChooseUs from './components/WhyChooseUs';


export default function Home() {
    const services: {
        title: string;
        description: string;
        image: StaticImageData;
    }[] = [
        {
            title: 'AI & Machine Learning Solutions',
            description:
                'Leverage the power of artificial intelligence to transform your business operations. Our AI and machine learning solutions help you uncover insights, automate processes, and improve decision-making.',
            image: aiimg,
        },
        {
            title: 'Mobile Application Development',
            description:
                "We deliver mobile applications that provide exceptional user experiences and meet the demands of today's digital landscape. From concept to launch, we guide you through the entire mobile app development process.",
            image: mobimg,
        },
    ];

    const cardItems: {
        title: string,
        discription: string,
        image: StaticImageData,
        imageAltText: string
    }[] = [{
        title: "Health Tech",
        discription: "Empowering healthcare with advanced digital solutions. From telemedicine to patient management systems, we develop software that streamlines medical workflows.",
        image: imageMobileApp1,
        imageAltText: "kkr"
    }, {
        title: "Ed-Tech",
        discription: "Transforming education through technology. Our software solutions are designed to create engaging learning experiences, offering tools for online education and personalized learning paths.",
        image: imageMobileApp2,
        imageAltText: "hi"
    }, {
        title: "Food Tech",
        discription: "Redefining the food industry with smart tech. We build solutions for food delivery, inventory management, and customer engagement, making it easier for businesses to serve and satisfy customers efficiently.",
        image: imageMobileApp3,
        imageAltText: "kadak"
    }, {
        title: "Logistics",
        discription: "Optimizing logistics with intelligent software. Our solutions improve supply chain management, automate processes, and enhance real-time tracking for streamlined operations and better delivery outcomes.",
        image: imageMobileApp4,
        imageAltText: "hhahahah"
    },


    ];

    return (
        <div>

            <Banner />
            <AboutUs />

            <div className="case-responsive-container py-16 bg-white">
                <h2 className="mb-1 section-heading text-primary-700 text-center">Our Products</h2>
                <p className="mb-16 section-subtext text-gray-700 text-center">Discover Innovation. Experience Excellence.</p>
                <div className="flex flex-col gap-y-36">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-5/12 item-subtitle text-gray-600">
                            <p className='mb-4'>In collaboration with <Link href={"https://www.infomover.io"}><Image src={imLogo} alt='infomover-logo' className='w-24 inline' /></Link></p>
                            <h3 className="mb-4 item-title text-blue-600"><Link href={"https://www.productiviti.io"}>Productiviti <RxExternalLink size={22} className='mb-1 inline' /></Link></h3>
                            <p className="mb-4">
                                Productiviti is an employee-monitoring software that provides real-time insights into employee productivity, activity logging, and productivity analytics.
                            </p>
                            <ul className="mb-10 list-disc pl-5 flex flex-col space-y-2">
                                <li><strong>Dynamic Real-Time Tracking:</strong> Monitor remote teams with automated timekeeping and activity logging, ensuring compliance and proactive issue identification.</li>
                                <li><strong>In-Depth Data Analytics:</strong> Utilize advanced analytics to derive actionable insights into employee performance, optimizing workflows and resource allocation.</li>
                                <li><strong>Centralized Workforce Management:</strong> Manage diverse enterprise workforces from a unified platform with role-based access controls for secure oversight.</li>
                                <li><strong>Automated Attendance and Resource Tracking:</strong> Streamline attendance management and asset tracking, providing a holistic view of employee availability and resource utilization.</li>
                                <li><strong>Customizable Reporting and Compliance Framework:</strong> Access interactive reporting tools with customizable dashboards to ensure adherence to industry standards and enhance transparency.</li>
                            </ul>
                            <Link href={"https://www.productiviti.io"}>
                                <Image src={productivitiLogo} alt='productiviti-logo' className='w-36' />
                            </Link>
                        </div>
                        <div className="md:w-7/12 flex justify-center">
                            <Image
                                src={productivitiImage}
                                alt="Productiviti"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                        <div className="md:w-5/12 md:pr-12 item-subtitle text-gray-600">
                            <p className='mb-4'>In collaboration with <Link href={"https://www.infomover.io"}><Image src={imLogo} alt='infomover-logo' className='w-24 inline' /></Link></p>
                            <h3 className="item-title text-blue-600 mb-4"><Link href={"https://www.hiretalentt.com"}>HireTalentt <RxExternalLink size={22} className='mb-1 inline' /></Link></h3>
                            <p className="mb-4">
                                Discover HireTalentt, the cutting-edge platform designed to transform your hiring experience. Our mission is to connect businesses with exceptional talent efficiently and effectively.
                            </p>
                            <ul className="mb-10 list-disc pl-5 flex flex-col space-y-2">
                                <li><strong>Extensive Talent Pool:</strong> Access a diverse and continuously updated database of qualified candidates across various industries to find the perfect fit for your team.</li>
                                <li><strong>Advanced Search Filters:</strong> Utilize sophisticated filters to pinpoint candidates based on specific criteria, streamlining your selection process for optimal results.</li>
                                <li><strong>Integrated Applicant Tracking System (ATS):</strong> Manage applications and track candidate progress seamlessly, enhancing collaboration among hiring teams.</li>
                                <li><strong>AI-Powered Candidate Matching:</strong> Leverage artificial intelligence to match candidates to job openings, improving the quality and relevance of your hires.</li>
                                <li><strong>Comprehensive Analytics Dashboard:</strong> Gain valuable insights into your recruitment efforts with data-driven analytics, allowing for informed decision-making and strategy optimization.</li>
                            </ul>
                            <Link href={"https://www.hiretalentt.com"}>
                                <Image src={hiretalenttLogo} alt='hiretalentt-logo' className='w-36' />
                            </Link>
                        </div>
                        <div className="md:w-7/12 flex justify-center">
                            <Image
                                src={hiretalenttImage}
                                alt="HireTalentt"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-primary-50'>
                <div className="case-responsive-container text-center py-16">
                    <h2 className="mb-1 section-heading text-primary-700">Our Services</h2>
                    <p className="mb-16 section-subtext text-gray-700">Your Vision, Our Expertise</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                            >
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-8 text-center">
                                    <h3 className="mb-2 item-title text-gray-700">{service.title}</h3>
                                    <p className="item-subtitle text-gray-700">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='case-responsive-container justify-center items-center text-center py-24'>
                <div className='mb-16 mx-auto w-full md:w-2/3'>
                    <h2 className='mb-1 section-heading text-primary-700'>What We Can Do For You?</h2>
                    <p className='section-subtext text-gray-700'>We can provided you services which can help to grow your business. We are open to take new ideas and also worked in a wide range of domains which encompasses...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cardItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:bg-primary-50 hover:scale-[1.05] hover:shadow-2xl"
                        >
                            <div>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-56 transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <div className="p-6 text-left">
                                <h3 className="mb-2 item-title text-gray-700">
                                    {item.title}
                                </h3>
                                <p className="item-subtitle text-gray-700">{item.discription}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <WhyChooseUs />

            <div className="bg-gradient-to-r from-primary-500 to-indigo-600 text-white py-20 text-center">
                <div className='case-responsive-container'>
                    <h2 className="mb-2 section-heading">
                        Transform Your Business with Cutting-Edge Digital Solutions
                    </h2>
                    <p className="mb-8 mx-auto w-10/12 section-subtext">
                        Our innovative IT solutions are designed to streamline your operations, enhance productivity, and drive growth.
                        Partner with us to
                        unlock your business&apos;s full potential.
                    </p>
                    <div className="flex justify-center">
                        <button className="bg-white text-primary-700 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-600 hover:text-white transition duration-300 transform hover:scale-105 font-semibold">
                            <Link href="/contact-us">
                                Contact Us Today
                            </Link>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(3deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(3deg);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.4s ease-out;
                }

                .toast-float {
                    animation: float 3s ease-in-out infinite;
                }

                .toast-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .toast-delay {
                    animation-delay: 300ms;
                }
            `}</style>
        </div>
    );
};
