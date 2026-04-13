'use client';
import Image from 'next/image';
import Link from 'next/link';
import { RxExternalLink } from 'react-icons/rx';
import { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import imLogo from '@/public/Images/logos/im-logo.webp';
import productivitiLogo from '@/public/Images/logos/productiviti-logo.png';
import hiretalenttLogo from '@/public/Images/logos/hiretalentt-logo.png';
import productivitiImage from '@/public/Images/productiviti-images/productiviti.webp';
import hiretalenttImage from '@/public/Images/hiretalentt-images/hiretalentt.png';

export default function OurProducts() {
  // Changed to use _mounted prefix since it's only used in useEffect
  const [_mounted, setMounted] = useState(false);
  
  // Ref for observing animation elements
  const animatedElementsRef = useRef<NodeListOf<Element> | null>(null);
  
  useEffect(() => {
    // Configure AOS with optimized settings
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      offset: 120,
      delay: 0,
      throttleDelay: 99,
      anchorPlacement: 'top-bottom',
    });

    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });

    setMounted(true);

    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);

  useEffect(() => {
    if (!_mounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              AOS.refresh();
            }, 50);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
  
    // Target all elements with data-aos attributes
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElementsRef.current = animatedElements;
    
    animatedElements.forEach((el) => observer.observe(el));
  
    return () => {
      if (animatedElementsRef.current) {
        animatedElementsRef.current.forEach((el) => observer.unobserve(el));
      }
    };
  }, [_mounted]); // Fixed: Changed 'mounted' to '_mounted'

  // Force AOS refresh after images load to prevent animation timing issues
  const handleImageLoad = () => {
    AOS.refresh();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 bg-white">
      {/* Sticky header - No animation on this to keep it clean */}
      <div className="sticky top-0 z-10 bg-white pt-4 pb-2">
        <h2 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700 text-center">
          Our Products
        </h2>
        <p className="mb-6 text-sm sm:text-base lg:text-lg text-gray-700 text-center">
          Discover Innovation. Experience Excellence.
        </p>
      </div>
      <div className="flex flex-col gap-y-12 sm:gap-y-16">
        {/* First product section */}
        <div className="flex flex-col md:flex-row items-center gap-6 min-h-[50vh] sm:min-h-[60vh] py-4">
          {/* Text content with its own animation */}
          <div 
            className="md:w-5/12 text-gray-600 text-sm sm:text-base"
            data-aos="fade-right"
            data-aos-duration="700"
            data-aos-anchor-placement="center-bottom"
          >
            <p className="mb-3">
              In collaboration with{' '}
              <Link href={'https://www.infomover.io'}>
                <Image
                  src={imLogo}
                  alt="infomover-logo"
                  className="w-16 sm:w-20 inline"
                  onLoad={handleImageLoad}
                />
              </Link>
            </p>
            <h3 className="mb-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-600">
              <Link href={'https://www.productiviti.io'}>
                Productiviti <RxExternalLink size={18} className="mb-1 inline" />
              </Link>
            </h3>
            <p className="mb-3">
              Productiviti is an employee-monitoring software that provides
              real-time insights into employee productivity, activity logging,
              and productivity analytics.
            </p>
            <ul className="mb-6 sm:mb-8 list-disc pl-5 flex flex-col space-y-1.5">
              <li>
                <strong>Dynamic Real-Time Tracking:</strong> Monitor remote teams
                with automated timekeeping and activity logging, ensuring
                compliance and proactive issue identification.
              </li>
              <li>
                <strong>In-Depth Data Analytics:</strong> Utilize advanced
                analytics to derive actionable insights into employee performance,
                optimizing workflows and resource allocation.
              </li>
              <li>
                <strong>Centralized Workforce Management:</strong> Manage diverse
                enterprise workforces from a unified platform with role-based
                access controls for secure oversight.
              </li>
              <li>
                <strong>Automated Attendance and Resource Tracking:</strong>{' '}
                Streamline attendance management and asset tracking, providing a
                holistic view of employee availability and resource utilization.
              </li>
              <li>
                <strong>Customizable Reporting and Compliance Framework:</strong>{' '}
                Access interactive reporting tools with customizable dashboards to
                ensure adherence to industry standards and enhance transparency.
              </li>
            </ul>
            <Link href={'https://www.productiviti.io'}>
              <Image
                src={productivitiLogo}
                alt="productiviti-logo"
                className="w-24 sm:w-32"
                onLoad={handleImageLoad}
              />
            </Link>
          </div>
          {/* Image with its own animation */}
          <div 
            className="md:w-7/12 flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] mt-4 md:mt-0"
            data-aos="fade-left"
            data-aos-duration="700"
            data-aos-delay="100"
            data-aos-anchor-placement="center-bottom"
          >
            <Image
              src={productivitiImage}
              alt="Productiviti"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              priority
              onLoad={handleImageLoad}
            />
          </div>
        </div>
        
        {/* Second product section */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6 min-h-[50vh] sm:min-h-[60vh] py-4">
          {/* Text content with its own animation */}
          <div 
            className="md:w-5/12 md:pr-6 lg:pr-10 text-gray-600 text-sm sm:text-base"
            data-aos="fade-left"
            data-aos-duration="700"
            data-aos-anchor-placement="center-bottom"
          >
            <p className="mb-3">
              In collaboration with{' '}
              <Link href={'https://www.infomover.io'}>
                <Image
                  src={imLogo}
                  alt="infomover-logo"
                  className="w-16 sm:w-20 inline"
                  onLoad={handleImageLoad}
                />
              </Link>
            </p>
            <h3 className="mb-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-600">
              <Link href={'https://www.hiretalentt.com'}>
                HireTalentt <RxExternalLink size={18} className="mb-1 inline" />
              </Link>
            </h3>
            <p className="mb-3">
              Discover HireTalentt, the cutting-edge platform designed to
              transform your hiring experience. Our mission is to connect
              businesses with exceptional talent efficiently and effectively.
            </p>
            <ul className="mb-6 sm:mb-8 list-disc pl-5 flex flex-col space-y-1.5">
              <li>
                <strong>Extensive Talent Pool:</strong> Access a diverse and
                continuously updated database of qualified candidates across
                various industries to find the perfect fit for your team.
              </li>
              <li>
                <strong>Advanced Search Filters:</strong> Utilize sophisticated
                filters to pinpoint candidates based on specific criteria,
                streamlining your selection process for optimal results.
              </li>
              <li>
                <strong>Integrated Applicant Tracking System (ATS):</strong>{' '}
                Manage applications and track candidate progress seamlessly,
                enhancing collaboration among hiring teams.
              </li>
              <li>
                <strong>AI-Powered Candidate Matching:</strong> Leverage
                artificial intelligence to match candidates to job openings,
                improving the quality and relevance of your hires.
              </li>
              <li>
                <strong>Comprehensive Analytics Dashboard:</strong> Gain valuable
                insights into your recruitment efforts with data-driven analytics,
                allowing for informed decision-making and strategy optimization.
              </li>
            </ul>
            <Link href={'https://www.hiretalentt.com'}>
              <Image
                src={hiretalenttLogo}
                alt="hiretalentt-logo"
                className="w-24 sm:w-32"
                onLoad={handleImageLoad}
              />
            </Link>
          </div>
          {/* Image with its own animation */}
          <div 
            className="md:w-7/12 flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] mt-4 md:mt-0"
            data-aos="fade-right"
            data-aos-duration="700"
            data-aos-delay="100"
            data-aos-anchor-placement="center-bottom"
          >
            <Image
              src={hiretalenttImage}
              alt="HireTalentt"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              priority
              onLoad={handleImageLoad}
            />
          </div>
        </div>
      </div>
    </div>
  );
}