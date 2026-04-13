'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Code, Stethoscope, GraduationCap, Utensils, Truck, ArrowRight, Quote, Star } from 'lucide-react';

const TechKunAboutPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const verticals = [
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "HealthTech",
      description: "Revolutionizing healthcare with AI-driven diagnostics and patient care solutions",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "EdTech",
      description: "Transforming education through interactive learning platforms and smart analytics",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "FoodTech",
      description: "Optimizing food delivery, restaurant management, and culinary experiences",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Logistics",
      description: "Streamlining supply chains with intelligent tracking and automation systems",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const timeline = [
    { year: "2020", title: "Founded", description: "TechKun was born with a vision to innovate across industries" },
    { year: "2021", title: "First Product", description: "Launched our flagship HealthTech solution" },
    { year: "2022", title: "Expansion", description: "Extended into EdTech and FoodTech markets" },
    { year: "2023", title: "Recognition", description: "Won 'Best Startup Innovation Award'" },
    { year: "2024", title: "Global Reach", description: "Expanded operations to 15+ countries" }
  ];

  const team = [
    {
      name: "Khizar Shakir",
      role: "Chief Executive Officer",
      funFact: "Coffee enthusiast & marathon runner",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Uzair Mirza",
      role: "Managing Director",
      funFact: "Hackathon champion 3 years running",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Naved M. Usmani",
      role: "Chief Technology Officer",
      funFact: "AI researcher & open-source contributor",
      image: "/api/placeholder/300/300"
    }
  ];

  const testimonials = [
    {
      quote: "TechKun transformed our healthcare operations completely. Their AI solutions reduced our diagnostic time by 60%.",
      author: "Dr. Sarah Chen",
      company: "MedCenter Plus",
      rating: 5
    },
    {
      quote: "The EdTech platform they built for us increased student engagement by 300%. Absolutely phenomenal work!",
      author: "Michael Rodriguez",
      company: "EduFuture Academy",
      rating: 5
    },
    {
      quote: "Our logistics efficiency improved dramatically. TechKun's solutions are game-changing.",
      author: "Emily Johnson",
      company: "SwiftLogistics",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen transition-all duration-500 bg-white text-gray-900">
      {/* Hero Section - Futuristic Dark Theme */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dark background with deep gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950">
          {/* Digital grid pattern overlay */}
          <div
            className="absolute inset-0 w-full h-full opacity-20"
            style={{
              backgroundImage: `url('/Images/blog-pattern.svg')`,
              backgroundSize: '500px 500px',
              backgroundRepeat: 'repeat',
            }}
          ></div>

          {/* Animated glowing elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '3.5s' }}></div>

          {/* Tech circuit lines */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.1"></path>
              <path d="M0,50 L100,50" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5"></path>
              <path d="M50,0 L50,100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.1" strokeDasharray="0.5,0.5"></path>
              <path d="M25,0 L25,100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.05" strokeDasharray="0.2,0.8"></path>
              <path d="M75,0 L75,100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.05" strokeDasharray="0.2,0.8"></path>
              <path d="M0,25 L100,25" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.05" strokeDasharray="0.2,0.8"></path>
              <path d="M0,75 L100,75" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.05" strokeDasharray="0.2,0.8"></path>
            </svg>
          </div>

          {/* Data stream animation */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute h-[300%] w-[300%] -top-[100%] -left-[100%]">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-blue-400 h-0.5 w-16 rounded-full opacity-50"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `dataStream ${5 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div
            id="hero-content"
            data-animate
            className={`transition-all duration-1000 ${isVisible['hero-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
              Driving Innovation
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Across Industries
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-300">
              We're building the future of technology, one breakthrough at a time.
              <br />From healthcare to education, we make the impossible possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20">
                  See What We Do
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </Link>
              {/* <Link href="/contact-us">
                <button className="border-2 border-blue-400/30 text-gray-200 hover:bg-blue-900/20 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300">
                  Get in Touch
                </button>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Bottom fade for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div
            id="who-we-are"
            data-animate
            className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible['who-we-are'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Who We Are
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-gray-600">
                TechKun is more than a tech company—we're digital architects crafting tomorrow's solutions today.
                Founded by visionaries who believe technology should enhance human potential, we specialize in
                creating intelligent systems that solve real-world problems across multiple industries.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Our passion lies in the intersection of innovation and impact, where cutting-edge technology
                meets genuine human needs. We don't just build software—we build futures.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-96 rounded-2xl overflow-hidden bg-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-24 h-24 mx-auto mb-4 text-blue-600" />
                    <p className="text-xl font-semibold text-gray-800">Innovation in Motion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div
            id="timeline-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['timeline-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Every milestone tells a story of innovation and growth
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500"></div>
            {timeline.map((item, index) => (
              <div
                key={index}
                id={`timeline-${index}`}
                data-animate
                className={`flex items-center mb-16 transition-all duration-1000 ${isVisible[`timeline-${index}`] ? 'opacity-100 translate-x-0' : `opacity-0 ${index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'}`
                  } ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                  <div className="p-6 rounded-xl bg-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-sm font-semibold mb-2 text-blue-600">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white z-10 flex-shrink-0 shadow-lg"></div>
                <div className="w-full md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Verticals */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div
            id="verticals-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['verticals-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What We Do
            </h2>
            <p className="text-xl text-gray-600">
              Transforming industries through innovative technology solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {verticals.map((vertical, index) => (
              <div
                key={index}
                id={`vertical-${index}`}
                data-animate
                className={`group cursor-pointer transition-all duration-1000 ${isVisible[`vertical-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="p-8 rounded-2xl h-full transition-all duration-300 group-hover:scale-105 bg-white hover:shadow-xl shadow-lg">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${vertical.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {vertical.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {vertical.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {vertical.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div
            id="team-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['team-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The brilliant minds behind TechKun's innovations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                id={`team-${index}`}
                data-animate
                className={`group transition-all duration-1000 ${isVisible[`team-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-center p-8 rounded-2xl transition-all duration-300 group-hover:scale-105 bg-gray-50 hover:bg-white hover:shadow-xl">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-blue-600 font-semibold">
                    {member.role}
                  </p>
                  {/* <div className="flex items-center justify-center text-sm">
                    <Coffee className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">
                      {member.funFact}
                    </span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div
            id="testimonials-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from the companies we've helped transform
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl bg-white shadow-xl">
              <Quote className="w-12 h-12 mb-6 text-blue-600" />
              <p className="text-xl md:text-2xl leading-relaxed mb-8 text-gray-700">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {testimonials[activeTestimonial].author}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[activeTestimonial].company}
                  </p>
                </div>
                <div className="flex">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            id="cta"
            data-animate
            className={`transition-all duration-1000 ${isVisible['cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Let's Build the
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Future Together
              </span>
            </h2>
            <p className="text-xl mb-8 leading-relaxed text-gray-600">
              Ready to transform your industry? Let's discuss how TechKun can help you
              achieve breakthrough innovations and sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20">
                  Get in Touch
                </button>
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechKunAboutPage;