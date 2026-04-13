// 'use client';

// // Remove unused Image import if not being used
// // import Image from 'next/image';
// import { useEffect} from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// export default function WhatWeDo() {

//   useEffect(() => {
//     AOS.init({
//       duration: 600,
//       easing: 'ease-out-cubic',
//       once: true,
//       offset: 50,
//     });
//   }, []);

//   const cardItems = [
//     {
//       title: 'Health Tech',
//       description:
//         'Empowering healthcare with advanced digital solutions that streamline patient care, optimize clinical workflows, and leverage data analytics for improved medical outcomes.',
//       icon: 'M13.5 6H12V3c0-.265-.105-.52-.293-.707C11.52 2.105 11.265 2 11 2H9c-.265 0-.52.105-.707.293C8.105 2.48 8 2.735 8 3v3H6.5c-.962 0-1.885.383-2.566 1.064C3.254 7.745 2.87 8.668 2.87 9.63c0 .318.085.634.246.91.16.277.39.51.67.677l4.436 2.648c.317.19.67.317 1.038.375.368.058.744.023 1.095-.101.351-.125.669-.341.93-.632.261-.29.452-.645.556-1.033l.179-.654c.035-.128.152-.22.285-.22h1.642c.829 0 1.623-.33 2.21-.916.585-.586.915-1.38.915-2.209 0-.828-.33-1.623-.916-2.209-.586-.585-1.38-.915-2.21-.915H13.5z',
//       color: 'bg-blue-500',
//       delay: 0,
//     },
//     {
//       title: 'Ed-Tech',
//       description:
//         'Transforming education through technology. Our software solutions create engaging learning experiences, offering tools for online education and personalized learning paths.',
//       icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
//       color: 'bg-green-500',
//       delay: 50,
//     },
//     {
//       title: 'Food Tech',
//       description:
//         'Redefining the food industry with smart tech. We build solutions for food delivery, inventory management, and customer engagement, for businesses to serve customers efficiently.',
//       icon: 'M12 2a8 8 0 00-8 8c0 1.151.24 2.245.672 3.242.143.334.335.657.576.963L12 21l6.752-6.795c.241-.306.433-.63.576-.963A7.98 7.98 0 0020 10a8 8 0 00-8-8zm3 10H9a1 1 0 010-2h6a1 1 0 010 2z',
//       color: 'bg-orange-500',
//       delay: 100,
//     },
//     {
//       title: 'Logistics',
//       description:
//         'Optimizing logistics with intelligent software. Our solutions improve supply chain management, automate processes, and enhance real-time tracking for streamlined operations.',
//       icon: 'M8.75 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H6.75M19.5 14.25l-2.25 3.75m0 0l-2.25 3.75M17.25 18L15 14.25M17.25 18l2.25-3.75M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z',
//       color: 'bg-purple-500',
//       delay: 150,
//     },
//     {
//       title: 'FinTech',
//       description:
//         'Revolutionizing finance with secure, scalable solutions. We develop platforms for digital payments, blockchain integration, and financial analytics to drive efficiency.',
//       icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
//       color: 'bg-red-500',
//       delay: 200,
//     },
//     {
//       title: 'Retail Tech',
//       description:
//         'Enhancing retail with innovative tools. Our solutions power e-commerce platforms, customer analytics, and inventory systems to boost sales and customer satisfaction.',
//       icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
//       color: 'bg-teal-500',
//       delay: 250,
//     },
//     {
//       title: 'AI Solutions',
//       description:
//         'Harnessing AI to drive innovation. We build intelligent systems for automation, predictive analytics, and personalized user experiences across industries.',
//       icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
//       color: 'bg-indigo-500',
//       delay: 300,
//     },
//   ];

//   return (
//     <>
//       <div className="bg-gray-50 py-12 sm:py-16">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
//           <div className="text-center mb-10 sm:mb-12">
//             <h2 className="text-sm font-semibold tracking-wide text-primary-600 uppercase">
//               Our Services
//             </h2>
//             <h3 className="mt-2 text-2xl leading-8 font-bold tracking-tight text-gray-900 sm:text-3xl">
//               What We Can Do For You
//             </h3>
//             <p className="mt-3 max-w-2xl text-lg text-gray-500 mx-auto">
//               We provide innovative solutions to help grow your business. Our expertise spans across multiple domains, delivering tailored services that meet your unique needs.
//             </p>
//           </div>

//           <Swiper
//             modules={[Autoplay, Navigation, Pagination]}
//             spaceBetween={24}
//             slidesPerView={1}
//             breakpoints={{
//               640: { slidesPerView: 2, spaceBetween: 24 },
//               1024: { slidesPerView: 3, spaceBetween: 32 },
//               1280: { slidesPerView: 3, spaceBetween: 40 },
//             }}
//             autoplay={{ delay: 4000, disableOnInteraction: false }}
//             navigation
//             pagination={{ clickable: true }}
//             className="mySwiper pb-[50px] mx-[-8px] pl-2 pr-2"
//           >
//             {cardItems.map((item, index) => (
//               <SwiperSlide key={index}>
//                 <div
//                   className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] h-[320px]"
//                   data-aos="fade-up"
//                   data-aos-delay={item.delay}
//                 >
//                   <div className={`h-2 ${item.color} w-full`}></div>
//                   <div className="p-6 flex flex-col h-full">
//                     <div className="flex items-center mb-4">
//                       <div className={`${item.color} p-3 rounded-xl`}>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-6 w-6 text-white"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
//                         </svg>
//                       </div>
//                       <h3 className="ml-4 text-xl font-semibold text-gray-900">{item.title}</h3>
//                     </div>
//                     <p className="text-base text-gray-600 mb-4 flex-grow line-clamp-4">{item.description}</p>
//                     {/* 'Learn more' button removed as requested */}
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>

//       <style jsx global>{`
//         .swiper-button-next,
//         .swiper-button-prev {
//           color: #2563eb !important;
//           background: rgba(255, 255, 255, 0.95) !important;
//           border-radius: 50% !important;
//           width: 44px !important;
//           height: 44px !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
//           transition: all 0.3s ease !important;
//         }

//         .swiper-button-next:hover,
//         .swiper-button-prev:hover {
//           background: #ffffff !important;
//           transform: scale(1.1) !important;
//           box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
//         }

//         .swiper-button-next:after,
//         .swiper-button-prev:after {
//           font-size: 18px !important;
//           font-weight: bold !important;
//         }

//         .swiper-pagination {
//           position: relative !important;
//           bottom: 0 !important;
//           margin-top: 20px !important;
//         }

//         .swiper-pagination-bullet {
//           background: #d1d5db !important;
//           opacity: 1 !important;
//           width: 10px !important;
//           height: 10px !important;
//           transition: all 0.3s ease !important;
//         }

//         .swiper-pagination-bullet-active {
//           background: #2563eb !important;
//           transform: scale(1.2) !important;
//         }
//       `}</style>
//     </>
//   );
// }