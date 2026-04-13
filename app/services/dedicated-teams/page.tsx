'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DedicatedTeams() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-emerald-700 opacity-90">
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
                Your Dream Team <span className="text-green-300">Delivered</span>
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Custom-built, cross-functional teams tailored to your project needs with end-to-end delivery capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/contact-us" 
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                >
                  Build Your Team
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white text-white font-medium rounded-lg transition-all duration-300 text-center"
                >
                  See How It Works
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
                  src="/Images/Model/Team.jpeg" 
                  alt="Dedicated Teams" 
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Dedicated Teams Matter</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Building and managing a high-performing product development team is complex and resource-intensive. Many companies struggle with recruitment, retention, and maintaining consistent delivery quality.
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
                  Difficulty assembling teams with the right mix of skills
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  High overhead costs of managing development teams
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Inconsistent delivery quality and missed deadlines
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
                  Custom-built teams with the perfect skill mix for your project
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  End-to-end delivery capabilities with built-in project management
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dedicated focus on your goals with transparent communication
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
              We follow a proven methodology to build and deploy dedicated teams that deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery & Planning',
                description: 'We analyze your project requirements, technical stack, and business goals to define the optimal team structure.'
              },
              {
                step: '02',
                title: 'Team Assembly',
                description: 'We select the perfect combination of developers, designers, QA engineers, and project managers from our talent pool.'
              },
              {
                step: '03',
                title: 'Onboarding & Alignment',
                description: 'Your dedicated team is immersed in your company culture, processes, and project specifics to ensure alignment.'
              },
              {
                step: '04',
                title: 'Execution & Delivery',
                description: 'The team works exclusively on your project with regular sprints, demos, and transparent reporting on progress.'
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Benefits of Dedicated Teams</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our dedicated team model offers significant advantages over traditional development approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Deep Focus',
                description: 'Teams work exclusively on your project, ensuring maximum productivity and alignment.'
              },
              {
                icon: '🔄',
                title: 'Agile Adaptability',
                description: 'Teams can quickly pivot and adapt to changing requirements and priorities.'
              },
              {
                icon: '💼',
                title: 'Full-Cycle Delivery',
                description: 'End-to-end capabilities from ideation and design to development and deployment.'
              },
              {
                icon: '📈',
                title: 'Predictable Delivery',
                description: 'Consistent velocity and quality with transparent progress tracking.'
              },
              {
                icon: '💰',
                title: 'Cost Efficiency',
                description: 'Reduced overhead and management costs compared to in-house teams.'
              },
              {
                icon: '🔐',
                title: 'Knowledge Retention',
                description: 'Teams build deep domain expertise that compounds over time.'
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
              <svg className="w-16 h-16 text-green-100 dark:text-gray-800 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-green-50 dark:border-gray-700">
                  <Image 
                    src="/profile-placeholder.jpg" 
                    alt="Client" 
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Michael Chen</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Product Director, FinTech Solutions</p>
              </div>
              
              <blockquote className="text-xl text-center text-gray-600 dark:text-gray-300 italic mb-8">
                "Working with Tech-Kun's dedicated team has been transformative for our product development. They assembled a perfect cross-functional team that quickly understood our vision and executed flawlessly. The team's focus and commitment to our project exceeded our expectations."
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Dream Team?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Let us assemble a dedicated team that's perfectly aligned with your project goals and technical requirements.
          </p>
          <Link 
            href="/contact-us" 
            className="px-8 py-4 bg-white text-green-600 hover:bg-green-50 font-medium rounded-lg transition-all duration-300 inline-block"
          >
            Schedule a Team Planning Session
          </Link>
        </div>
      </section>
    </div>
  );
}