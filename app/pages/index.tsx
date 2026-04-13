// 'use client';
// import Link from 'next/link';
// import Banner from '../components/Banner';
// import AboutUs from '../components/AboutUs';
// // import ClientSlider from '../components/ClientSlider';
// import WhyChooseUs from '../components/WhyChooseUs';
// import { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// export default function Home() {
//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       easing: 'ease-out-cubic',
//       once: true,
//       offset: 100,
//     });
//   }, []);

//   return (
//     <div>
//       <Banner />
//       <AboutUs />
//       {/* <ClientSlider /> */}
//       <WhyChooseUs />
//       <div className="py-16 text-center">
//         <h2 className="text-3xl font-bold mb-8">Explore More</h2>
//         <div className="flex flex-col space-y-4 max-w-md mx-auto">
//           <Link href="/our-products">
//             <a className="block text-xl text-blue-600 hover:underline">Our Products</a>
//           </Link>
//           <Link href="/services">
//             <a className="block text-xl text-blue-600 hover:underline">Services</a>
//           </Link>
//           <Link href="/what-we-do">
//             <a className="block text-xl text-blue-600 hover:underline">What We Do</a>
//           </Link>
//           <Link href="/cta">
//             <a className="block text-xl text-blue-600 hover:underline">Call to Action</a>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }