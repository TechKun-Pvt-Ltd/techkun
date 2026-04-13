'use client';
import { useEffect } from 'react';

import Link from 'next/link';
import { X } from 'lucide-react';
import Image from 'next/image';
interface NewsletterDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewsletterDialog({ isOpen, onClose }: NewsletterDialogProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);



    if (!isOpen) return null;

    return (
        <div className="fixed  inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl  w-11/12 md:w-full m-4 overflow-hidden animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors z-10"
                    aria-label="Close dialog"
                >
                    <X />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Me at GITEX Global Dubai!
                        </h2>
                        <p className="text-gray-600 mb-8 text-sm md:text-base">
                            We’ll be attending <b>GITEX Global Dubai</b> this year!
                            If you’re into tech, innovation, or startups, let’s connect and share ideas.
                            Don’t miss this chance to meet in person — it’s going to be an amazing experience!
                        </p>
                        <button className=" text-primary-700 w-full py-3 px-6 rounded-lg bg-primary-700 text-white transition duration-300 transform hover:scale-105 font-semibold">
                            <Link href="/contact-us">
                                Contact Us
                            </Link>
                        </button>

                    </div>


                    <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12 flex items-center justify-center">
                        <div className="relative w-full max-w-sm">
                            {/* You can replace this with an actual image */}
                            <div className="relative animate-float">
                                <div className="bg-white rounded-2xl shadow-xl p-8 transform rotate-3">
                                    <div className="flex items-center justify-center mb-4">

                                        <Image src="/GITEX_GLOBAL_2025.png" alt="" />

                                    </div>
                                </div>

                                {/* Decorative stars */}
                                <div className="absolute -top-4 -right-4 text-4xl animate-pulse">✨</div>
                                <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse delay-300">✨</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(3deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
        </div>
    );
}