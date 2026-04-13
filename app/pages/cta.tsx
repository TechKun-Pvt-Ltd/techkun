'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CTA() {
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
    });
  }, []);

  const benefits = [
    "Increase operational efficiency",
    "Reduce IT costs",
    "Enhance data security"
  ];

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-900 via-primary-800 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-300 blur-3xl"></div>
      </div>
      
      <div className="container relative mx-auto px-4">
        <div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-10 max-w-4xl mx-auto"
          data-aos="fade-up"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Transform Your Business with Cutting-Edge Digital Solutions
            </h2>
            <div className="h-1 w-24 bg-indigo-400 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-indigo-100 mx-auto max-w-2xl">
              Our innovative IT solutions are designed to streamline your operations,
              enhance productivity, and drive growth. Partner with us to unlock your
              business's full potential.
            </p>
          </div>
          
          {/* Benefits Section */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10"
                data-aos="zoom-in"
                data-aos-delay={300 + (index * 100)}
              >
                <CheckCircle className="text-indigo-300 mr-3 flex-shrink-0" size={20} />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="400">
            <Link href="/contact-us">
              <button
                className="group relative inline-flex items-center justify-center overflow-hidden px-8 py-4 font-medium text-lg transition-all duration-300 ease-out rounded-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Button Background */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-primary-500"></span>
                
                {/* Hover Effect */}
                <span className={`absolute inset-0 bg-gradient-to-r from-primary-400 to-indigo-400 transition-all duration-300 ease-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}></span>
                
                {/* Button Text */}
                <span className="relative flex items-center text-white font-semibold">
                  Contact Us Today
                  <ArrowRight className={`ml-2 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} size={18} />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
