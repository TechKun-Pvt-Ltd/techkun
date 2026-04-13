'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ITStaffAugmentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Scale Your Team <span className="text-blue-300">On Demand</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Access top-tier tech talent to augment your team and accelerate delivery without the overhead of hiring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/contact-us" 
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                >
                  Schedule a Consultation
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white text-white font-medium rounded-lg transition-all duration-300 text-center"
                >
                  Learn How It Works
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src="/Images/Model/IT Staff.jpeg" 
                  alt="IT Staff Augmentation" 
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why IT Staff Augmentation Matters</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              In today's fast-paced tech landscape, finding and retaining qualified developers is challenging and time-consuming. Traditional hiring can take months, while project deadlines loom closer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Challenge</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Long recruitment cycles delaying critical projects
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  High costs of full-time employees for temporary needs
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Skill gaps in your existing team slowing down delivery
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Solution</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pre-vetted developers ready to join your team within days
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Flexible engagement models to scale up or down as needed
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Specialized expertise without long-term commitments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Process</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We've streamlined our staff augmentation process to get you the talent you need with minimal friction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Requirements Analysis',
                description: 'We work with you to understand your technical needs, team dynamics, and project goals to identify the perfect talent match.'
              },
              {
                step: '02',
                title: 'Talent Matching',
                description: 'Our AI-powered matching system and human recruiters identify the ideal candidates from our pre-vetted talent pool.'
              },
              {
                step: '03',
                title: 'Seamless Integration',
                description: 'Selected developers join your team, adapting to your workflows and tools while our success managers ensure smooth collaboration.'
              },
              {
                step: '04',
                title: 'Ongoing Support',
                description: 'We provide continuous performance monitoring, regular check-ins, and handle all administrative aspects so you can focus on delivery.'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="text-6xl font-bold text-gray-100 dark:text-gray-800 absolute -top-2 -left-2">{item.step}</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Benefits of IT Staff Augmentation</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our staff augmentation service delivers tangible advantages for your business and development process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Rapid Scaling',
                description: 'Add skilled developers to your team within days, not months.'
              },
              {
                icon: '💰',
                title: 'Cost Efficiency',
                description: 'Reduce hiring costs, overhead, and long-term commitments.'
              },
              {
                icon: '🔍',
                title: 'Specialized Expertise',
                description: 'Access niche skills and technologies as needed for specific projects.'
              },
              {
                icon: '⚖️',
                title: 'Flexibility',
                description: 'Scale your team up or down based on project demands and timelines.'
              },
              {
                icon: '🚀',
                title: 'Accelerated Delivery',
                description: 'Meet tight deadlines and accelerate time-to-market with additional resources.'
              },
              {
                icon: '🔄',
                title: 'Risk Mitigation',
                description: 'Reduce the risks associated with permanent hiring and employee turnover.'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 relative">
              <svg className="w-16 h-16 text-blue-100 dark:text-gray-800 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-50 dark:border-gray-700">
                  <Image 
                    src="/profile-placeholder.jpg" 
                    alt="Client" 
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sarah Johnson</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">CTO, TechInnovate Inc.</p>
              </div>
              
              <blockquote className="text-xl text-center text-gray-600 dark:text-gray-300 italic mb-8">
                "Tech-Kun's IT staff augmentation service transformed our development process. We were able to quickly scale our team with skilled developers who integrated seamlessly with our existing workflow. The quality of talent and level of support exceeded our expectations."
              </blockquote>
              
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Scale Your Team?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get access to our pool of pre-vetted developers and start accelerating your development today.
          </p>
          <Link 
            href="/contact-us" 
            className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-300 inline-block"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}