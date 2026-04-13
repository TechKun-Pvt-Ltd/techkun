'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import TechKunLogoSvg from './TechKunLogoSvg';

// Constants for animation
const ANIMATION_CONFIG = {
    duration: '0.8s',
    easing: 'ease-out',
    visibilityThreshold: 0.8,
    initialTransform: 'translateY(50px)',
    finalTransform: 'translateY(0)',
};

function AboutUs() {
    const [logoSize, setLogoSize] = useState<number>(1);
    const componentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Memoized size calculation
    const calculateLogoSize = useCallback(() => {
        const width = window.innerWidth;
        setLogoSize((width >= 1024 ? 1024 : width) * (400 / 1024));
    }, []);

    // Memoized scroll handler
    const handleScroll = useCallback(() => {
        if (componentRef.current) {
            const rect = componentRef.current.getBoundingClientRect();
            setIsVisible(rect.top <= window.innerHeight * ANIMATION_CONFIG.visibilityThreshold);
        }
    }, []);

    useEffect(() => {
        calculateLogoSize();
        
        const handleResize = () => {
            calculateLogoSize();
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [calculateLogoSize, handleScroll]);

    return (
        <div 
            ref={componentRef}
            className='bg-primary-50 py-4 md:py-12'
            role="region"
            aria-label="About Us Logo Section"
        >
            <div 
                className='case-responsive-container'
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? ANIMATION_CONFIG.finalTransform : ANIMATION_CONFIG.initialTransform,
                    transition: `opacity ${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing}, transform ${ANIMATION_CONFIG.duration} ${ANIMATION_CONFIG.easing}`
                }}
            >
                <TechKunLogoSvg size={logoSize} length={1175} />
            </div>
        </div>
    );
}

export default AboutUs;