// "use client";
// import React, { useEffect, useRef } from 'react';

// const CyberpunkBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
//   const particlesSvgRef = useRef<SVGSVGElement>(null);
  
//   useEffect(() => {
//     if (!particlesSvgRef.current) return;
    
//     const particlesSvg = particlesSvgRef.current;
    
//     const createParticle = () => {
//       const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//       particle.setAttribute("class", "particle");
      
//       // Random starting position near edges
//       let startX, startY;
//       const side = Math.floor(Math.random() * 4);
      
//       switch(side) {
//         case 0: // Top
//           startX = Math.random() * 1080;
//           startY = Math.random() * 200;
//           break;
//         case 1: // Right
//           startX = 880 + Math.random() * 200;
//           startY = Math.random() * 1080;
//           break;
//         case 2: // Bottom
//           startX = Math.random() * 1080;
//           startY = 880 + Math.random() * 200;
//           break;
//         case 3: // Left
//           startX = Math.random() * 200;
//           startY = Math.random() * 1080;
//           break;
//         default:
//           startX = Math.random() * 1080;
//           startY = Math.random() * 200;
//       }
      
//       // Random target position (diagonal across)
//       const tx = 1080 - startX + (Math.random() * 200 - 100);
//       const ty = 1080 - startY + (Math.random() * 200 - 100);
      
//       particle.setAttribute("cx", startX.toString());
//       particle.setAttribute("cy", startY.toString());
//       particle.setAttribute("r", (0.5 + Math.random() * 1.5).toString());
//       particle.style.setProperty('--tx', `${tx}px`);
//       particle.style.setProperty('--ty', `${ty}px`);
//       particle.style.animationDuration = `${8 + Math.random() * 12}s`;
//       particle.style.animationDelay = `${Math.random() * 10}s`;
      
//       const colors = ['#00FFFF', '#0088FF', '#00AAFF', '#0066CC'];
//       particle.style.fill = colors[Math.floor(Math.random() * colors.length)];
      
//       particlesSvg.appendChild(particle);
      
//       // Remove particle after animation completes
//       setTimeout(() => {
//         if (particle.parentNode === particlesSvg) {
//           particlesSvg.removeChild(particle);
//         }
//       }, parseFloat(particle.style.animationDuration) * 1000 + parseFloat(particle.style.animationDelay) * 1000);
//     };
    
//     // Create particles periodically
//     const intervalId = setInterval(createParticle, 500);
    
//     // Initial particles
//     for (let i = 0; i < 20; i++) {
//       setTimeout(createParticle, i * 200);
//     }
    
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);
  
//   return (
//     <div className="relative w-full h-full overflow-hidden bg-black flex justify-center items-center">
//       {/* Background Gradient and Hex Grid */}
//       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1080">
//         <defs>
//           <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
//             <stop offset="0%" stopColor="#000D1A" />
//             <stop offset="70%" stopColor="#000911" />
//             <stop offset="100%" stopColor="#000000" />
//           </radialGradient>
          
//           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//             <feGaussianBlur stdDeviation="10" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>
          
//           <pattern id="hexGrid" patternUnits="userSpaceOnUse" width="100" height="173.2" patternTransform="scale(0.5)">
//             <polygon fill="none" stroke="#0066CC" strokeWidth="1" points="50,0 100,28.6 100,85.8 50,114.4 0,85.8 0,28.6" opacity="0.2" />
//           </pattern>
//         </defs>
        
//         {/* Background */}
//         <rect width="1080" height="1080" fill="url(#bgGradient)" />
        
//         {/* Hex Grid Background */}
//         <rect className="animate-hexgrid" width="1080" height="1080" fill="url(#hexGrid)" />
        
//         {/* Central Glow */}
//         <circle cx="540" cy="540" r="300" fill="#0C3256" opacity="0.15" className="animate-pulse-slow" />
        
//         {/* Rotating Tech Ring */}
//         <g className="origin-center animate-rotate-slow">
//           <circle cx="540" cy="540" r="380" fill="none" stroke="#0088FF" strokeWidth="1" opacity="0.3" />
//           <circle cx="540" cy="540" r="385" fill="none" stroke="#00AAFF" strokeWidth="0.5" opacity="0.2" />
//           <circle cx="540" cy="540" r="390" fill="none" stroke="#0066CC" strokeWidth="1" opacity="0.1" />
//         </g>
        
//         {/* Circuit Lines */}
//         <g className="animate-dash" stroke="#00CCFF" strokeWidth="1" fill="none" opacity="0.4">
//           <path d="M 140,540 H 290 C 320,540 320,500 350,500 H 500" />
//           <path d="M 940,540 H 790 C 760,540 760,580 730,580 H 580" />
//           <path d="M 540,140 V 290 C 540,320 500,320 500,350 V 500" />
//           <path d="M 540,940 V 790 C 540,760 580,760 580,730 V 580" />
//         </g>
        
//         {/* Floating Hexagons */}
//         <g className="animate-float">
//           <polygon fill="#0088FF" points="200,200 230,217 230,251 200,268 170,251 170,217" opacity="0.2" />
//           <polygon fill="#00CCFF" points="800,300 830,317 830,351 800,368 770,351 770,317" opacity="0.1" />
//           <polygon fill="#0066CC" points="700,800 730,817 730,851 700,868 670,851 670,817" opacity="0.2" />
//           <polygon fill="#00AAFF" points="300,750 330,767 330,801 300,818 270,801 270,767" opacity="0.15" />
//         </g>
        
//         {/* Pulsing Circles */}
//         <g className="animate-pulse-slow">
//           <circle cx="200" cy="300" r="15" fill="#00CCFF" opacity="0.3" />
//           <circle cx="880" cy="400" r="10" fill="#0088FF" opacity="0.2" />
//           <circle cx="820" cy="780" r="12" fill="#00FFFF" opacity="0.15" />
//           <circle cx="350" cy="850" r="8" fill="#00AAFF" opacity="0.25" />
//         </g>
        
//         {/* Wave Effect */}
//         <g className="animate-wave" opacity="0.1">
//           <circle cx="540" cy="540" r="200" fill="none" stroke="#00FFFF" strokeWidth="1" />
//           <circle cx="540" cy="540" r="220" fill="none" stroke="#00CCFF" strokeWidth="0.8" />
//           <circle cx="540" cy="540" r="240" fill="none" stroke="#0088FF" strokeWidth="0.6" />
//           <circle cx="540" cy="540" r="260" fill="none" stroke="#0066CC" strokeWidth="0.4" />
//         </g>
//       </svg>
      
//       {/* Particles Layer */}
//       <svg 
//         ref={particlesSvgRef}
//         className="absolute inset-0 w-full h-full" 
//         viewBox="0 0 1080 1080"
//       >
//         <circle className="particle" cx="100" cy="100" r="2" style={{ ['--tx' as any]: '900px', ['--ty' as any]: '800px', animationDelay: '0s' }} />
//         <circle className="particle" cx="900" cy="200" r="2" style={{ ['--tx' as any]: '-800px', ['--ty' as any]: '700px', animationDelay: '1s' }} />
//         <circle className="particle" cx="300" cy="900" r="1.5" style={{ ['--tx' as any]: '600px', ['--ty' as any]: '-700px', animationDelay: '2s' }} />
//         <circle className="particle" cx="800" cy="800" r="1" style={{ ['--tx' as any]: '-600px', ['--ty' as any]: '-600px', animationDelay: '3s' }} />
//         <circle className="particle" cx="600" cy="100" r="2" style={{ ['--tx' as any]: '-400px', ['--ty' as any]: '800px', animationDelay: '4s' }} />
//         <circle className="particle" cx="200" cy="600" r="1.5" style={{ ['--tx' as any]: '700px', ['--ty' as any]: '-400px', animationDelay: '5s' }} />
//       </svg>
      
//       {/* Logo Space (Center) */}
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 flex justify-center items-center z-10">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default CyberpunkBackground;