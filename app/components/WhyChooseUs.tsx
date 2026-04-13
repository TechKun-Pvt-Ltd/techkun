"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, UseInViewOptions } from "framer-motion";
import { 
  Users, 
  Scale, 
  HeartHandshake, 
  Shield, 
  Rocket, 
  Sparkles,
  LucideIcon
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Feature {
  id: number;
  title: string;
  description: string;
  Icon: LucideIcon;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const useViewAnimation = (options: UseInViewOptions = { once: true, amount: 0.3 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, options);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return { ref, controls, inView };
};

const features: Feature[] = [
  {
    id: 1,
    title: "Expert Team",
    description: "Our team of seasoned developers and designers bring decades of combined experience to every project.",
    Icon: Users
  },
  {
    id: 2,
    title: "Scalable Solutions",
    description: "Build systems that grow with your business, from startup phase to enterprise-level operations.",
    Icon: Scale
  },
  {
    id: 3,
    title: "Customer-Centric Approach",
    description: "We prioritize your needs and feedback throughout the entire development journey.",
    Icon: HeartHandshake
  },
  {
    id: 4,
    title: "Enterprise Security",
    description: "Industry-leading security protocols and practices to keep your data and users protected.",
    Icon: Shield
  },
  {
    id: 5,
    title: "Rapid Deployment",
    description: "Streamlined processes that get your solutions to market faster without sacrificing quality.",
    Icon: Rocket
  },
  {
    id: 6,
    title: "Innovative Technology",
    description: "Stay ahead with cutting-edge tech stacks and forward-thinking implementation strategies.",
    Icon: Sparkles
  }
];

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = "" }) => {
  const { ref, inView } = useViewAnimation();

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const { ref, inView } = useViewAnimation({ once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ 
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className="feature-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="p-4 sm:p-5 flex-grow">
        <motion.div 
          className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3"
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            backgroundColor: "rgb(147, 197, 253)",
            transition: { duration: 0.3 }
          }}
          aria-label={feature.title}
        >
          <feature.Icon size={20} strokeWidth={2} aria-hidden="true" />
        </motion.div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {feature.description}
        </p>
      </div>
      <motion.div 
        className="h-1 bg-blue-600 w-full mt-auto"
        initial={{ width: "0%" }}
        animate={inView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
        aria-hidden="true"
      />
    </motion.div>
  );
};

const WhyChooseUs = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.1,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const handleContactNavigation = () => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Navigate to the contact page
    router.push('/contact-us');
    
    // Reset scroll behavior after navigation
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    }, 1000);
  };

  return (
    <section 
      ref={ref}
      className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-gray-100"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <motion.span 
            className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3"
            variants={badgeVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            aria-label="Why Choose Us section"
          >
            WHY CHOOSE US
          </motion.span>
          
          <motion.h2 
            id="why-choose-us-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Technology That Transforms Your Business
          </motion.h2>
          
          <motion.div 
  className="text-base text-gray-600"
  variants={subtitleVariants}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
>
  <p>We&apos;re committed to excellence</p>
</motion.div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={`feature-${feature.id}`} feature={feature} index={index} />
          ))}
        </div>

        <AnimatedSection className="mt-8 flex justify-center py-4">
          <motion.button 
            type="button"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgb(37, 99, 235)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            aria-label="Schedule a Consultation"
            onClick={handleContactNavigation}
          >
            Schedule a Consultation
          </motion.button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyChooseUs;