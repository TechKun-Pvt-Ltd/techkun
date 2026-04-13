// import { useEffect, useRef, useState } from 'react';
// import { useAnimation } from 'framer-motion';

// interface ScrollAnimationOptions {
//   threshold?: number;
//   once?: boolean;
//   amount?: number;
//   rootMargin?: string;
//   reappear?: boolean;
// }

// export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
//   const {
//     threshold = 0,
//     once = false, // Changed to false to allow re-animation
//     amount = 0.1,
//     rootMargin = "-10%",
//     reappear = true
//   } = options;

//   const controls = useAnimation();
//   const ref = useRef<HTMLElement>(null);
//   const [hasAnimated, setHasAnimated] = useState(false);

//   useEffect(() => {
//     if (!ref.current) return;

//     const observerCallback: IntersectionObserverCallback = (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           controls.start("visible").catch(() => {});
//           setHasAnimated(true);
//         } else if (!once && reappear && hasAnimated) {
//           controls.start("hidden").catch(() => {});
//         }
//       });
//     };

//     const observer = new IntersectionObserver(observerCallback, {
//       threshold: [0, threshold, 1],
//       rootMargin,
//     });

//     observer.observe(ref.current);

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, [controls, threshold, rootMargin, once, reappear, hasAnimated]);

//   return { ref, controls, hasAnimated };
// };