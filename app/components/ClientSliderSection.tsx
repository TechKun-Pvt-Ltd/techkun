'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const ClientSliderSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const animationRef = useRef<number | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const lastTimeRef = useRef(0);

  // Add the missing handleClientClick function
  const handleClientClick = (clientName: string) => {
    console.log(`Clicked on client: ${clientName}`);
    // Add your click handling logic here
  };

  // Client data
  const clients = [
    { name: 'Seismic', logo: '/Images/Logo/Seismic_id8l_4d2M-_1.png' },
    { name: 'Akeneo', logo: '/Images/Logo/Akeneo_idwhtOJT_w_1.png' },
    { name: '1', logo: '/Images/Logo/idx_vBAoYh_1745577090705.jpeg' },
    { name: 'Innovaccer', logo: '/Images/Logo/Innovaccer_id6-tvzgdK_1.png' },
    { name: 'Prowly', logo: '/Images/Logo/Prowly_idQNl-mIbF_1.png' },
    { name: '2', logo: '/Images/Logo/Symbol.png' },
    { name: 'MobileAction', logo: '/Images/Logo/idObx92Zq7_1745577734176.jpeg' },
  ];

  // B2B trust badges data
  const trustBadges = [
    { 
      name: 'Clutch', 
      logo: '/Images/Logo/Clutch.png', 
      url: 'https://clutch.co/profile/techkun'
    },
    { 
      name: 'GoodFirms', 
      logo: '/Images/Logo/GoodFirms.jpeg', 
      url: 'https://www.goodfirms.co/company/techkun'
    },
    { 
      name: 'Bhethmos', 
      logo: '/Images/Logo/Bhethmos.png', 
      url: 'https://techbehemoths.com/techkun'
    },
    { 
      name: 'DesignRush', 
      logo: '/Images/Logo/DesignRush_idP3ab4Xlb_0.png', 
      url: 'https://www.designrush.com/techkun'
    },
  ];

  // Duplicate clients for infinite scroll appearance
  const allClients = [...clients, ...clients, ...clients];
  
  // Animation speed in pixels per second
  // Optimized animation speed based on viewport
  // Change the speed from a callback to a memoized value
  const speed = useCallback(() => {
    return window.innerWidth < 768 ? 60 : 85;
  }, []);

  const animate = useCallback((timestamp: number) => {
      if (!lastTimeRef.current) {
          lastTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      if (!isPaused && sliderContainerRef.current) {
          const containerWidth = sliderContainerRef.current.offsetWidth;
          const clientGroupWidth = containerWidth / 3;
          
          let newPosition = sliderPosition - (speed() * deltaTime / 1000);
          
          if (Math.abs(newPosition) >= clientGroupWidth) {
              newPosition = 0;
          }
          
          setSliderPosition(newPosition);
      }
      
      animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, sliderPosition, speed]);
  
  // Add animate to dependencies
  useEffect(() => {
      animationRef.current = requestAnimationFrame(animate);
      return () => {
          if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
          }
      };
  }, [animate]);

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center py-16 bg-gradient-to-r from-gray-50 to-blue-50 snap-start">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-24 text-gray-800">
          Trusted by Leading Clients
        </h2>
        
        {/* Client Logo Slider - Fixed version */}
        <div 
          className="relative w-full overflow-hidden mb-20" 
          style={{ height: '120px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={sliderContainerRef}
            className="absolute flex items-center"
            style={{ transform: `translateX(${sliderPosition}px)`, width: 'max-content' }}
          >
            {allClients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="h-20 w-40 mx-10 flex items-center justify-center transition-transform duration-300 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
                onClick={() => handleClientClick(client.name)}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Replace img tags with Image component */}
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={150}
                    height={50}
                    className="max-h-12 w-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust Badges Section */}
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium text-center mb-6 text-gray-600">
              As Featured On
            </h3>
            
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {trustBadges.map((badge) => (
                <a 
                  key={badge.name}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className={`h-12 w-24 md:h-14 md:w-32 relative transition-all duration-300 grayscale hover:grayscale-0 ${badge.name === 'DesignRush' ? 'bg-gray-900 p-2 rounded-lg' : ''}`}>
                    <Image
                      src={badge.logo}
                      alt={`${badge.name} badge`}
                      width={150}
                      height={50}
                      className={`object-contain w-full h-full ${badge.name === 'DesignRush' ? 'brightness-200' : ''}`}
                    />
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-md"></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientSliderSection;