'use client';

import { memo, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, ReactNode } from "react";

export interface OverlayRef {
    show(): void,
    hide(): void,
    toggle(): void
};

export interface OverlayProps {
    children: ReactNode,
    isOpen: boolean,
    onToggle(value: boolean): void
};

const Overlay = memo(forwardRef<OverlayRef, OverlayProps>(({ children, isOpen, onToggle }, ref) => {
    const [isMounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    // Track scroll position for animation effects
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const show = useCallback(() => {
        setMounted(true);
        onToggle(true);
        document.body.style.overflow = 'hidden';
    }, [onToggle]);

    const hide = useCallback(() => {
        onToggle(false);
        document.body.style.overflow = '';
        // Add a small delay to allow animation to complete
        setTimeout(() => setMounted(false), 300);
    }, [onToggle]);

    const toggle = useCallback(() => {
        if (isOpen) {
            hide();
        } else {
            show();
        }
    }, [isOpen, hide, show]);

    useImperativeHandle(ref, () => ({
        show,
        hide,
        toggle,
    }), [show, hide, toggle]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && 
                contentRef.current && 
                !contentRef.current.contains(event.target as Node) && 
                event.target === overlayRef.current) {
                hide();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, hide]);

    // Calculate backdrop blur based on scroll position
    const backdropBlur = Math.min(8, scrollY / 100);

    return isMounted ? (
        <div 
            ref={overlayRef}
            className={`fixed inset-0 z-50 flex flex-col items-center transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            style={{
                backdropFilter: `blur(${backdropBlur}px)`,
                backgroundColor: `rgba(0, 0, 0, ${Math.min(0.3, scrollY / 1000)})`,
                pointerEvents: isOpen ? 'auto' : 'none'
            }}
        >
            <div 
                ref={contentRef} 
                className={`w-full h-full transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    ) : null;
}));

export default Overlay;