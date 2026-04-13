'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RxExternalLink } from 'react-icons/rx';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Services() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 10,
      disable: window.innerWidth < 768 ? true : false,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  const services = [
    {
      title: 'AI & Machine Learning Solutions',
      description:
        'Leverage artificial intelligence to transform your business operations.',
      image: '/Images/landing-page-images/AI .jpeg',
      icon: RxExternalLink,
      path: '/services/ai-integration'
    },
    {
      title: 'Mobile Application Development',
      description:
        'Deliver mobile apps with exceptional user experiences.',
      image: '/Images/landing-page-images/App development.jpeg',                                   
      icon: RxExternalLink,
      path: '/services/app-development'
    },
    {
      title: 'Web Development',
      description:
        'Create responsive websites using modern technologies.',
      image: '/Images/landing-page-images/Web development.jpeg',
      icon: RxExternalLink,
      path: '/services/web-development'
    },
  ];

  // Function to handle navigation with smooth scroll
  const handleNavigation = (path: string) => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Navigate to the service page
    router.push(path);
    
    // Reset scroll behavior after navigation
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-x-hidden overflow-y-visible min-h-screen snap-y snap-mandatory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 snap-start">
        <div className="text-center mb-8 sm:mb-10" data-aos="fade-up">
          <span className="inline-block text-primary-600 font-medium mb-2 tracking-widest text-sm uppercase">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Comprehensive <span className="text-primary-600">Services</span>
          </h2>
          <div className="flex justify-center">
            <div className="w-16 h-1.5 bg-primary-500 rounded-full"></div>
            <div className="w-4 h-1.5 bg-primary-300 rounded-full mx-1.5"></div>
            <div className="w-1.5 h-1.5 bg-primary-200 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-[28rem] border border-gray-100 hover:border-primary-100"
              data-aos="fade-up"
              data-aos-delay={index * 50}
              data-aos-anchor-placement="top-bottom"
            >
              <div className="relative overflow-hidden h-[14rem]">
                <Image
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={400}
                  height={240}
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 bg-primary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-3 rounded-lg flex items-center justify-center group-hover:bg-primary-500">
                      <service.icon className="w-5 h-5 text-primary-600 group-hover:text-white" />
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => handleNavigation(service.path)}
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-800 transition-colors duration-300 group-hover:translate-x-1 group-hover:text-primary-700"
                  >
                    Discover more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-10" data-aos="zoom-in" data-aos-delay="150">
          <Link href="/services">
            <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 text-base">
              View All Services
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}