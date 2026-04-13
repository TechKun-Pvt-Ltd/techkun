'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetUsAtBengaluruTechSummit() {
    const [showToast, setShowToast] = useState(true);

    return (
        <AnimatePresence>
            {showToast && (
                <motion.div
                    className="fixed top-4 right-4 z-[100] max-w-4xl w-11/12 md:w-auto"
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 80, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                >
                    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowToast(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors z-10 bg-white rounded-full p-1"
                            aria-label="Close notification"
                        >
                            <X />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            {/* Left Side - Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Meet Us at Bengaluru Tech Summit!
                                </h2>
                                <p className="text-gray-600 mb-8 text-sm md:text-base">
                                    We'll be attending <b>Bengaluru Tech Summit</b> on 18, 19, 20 November!
                                    If you're into tech, innovation, or startups, let's connect and share ideas.
                                    Don't miss this chance to meet in person — it's going to be an amazing experience!
                                </p>
                                <Link href="/contact-us" onClick={() => setShowToast(false)}>
                                    <button className="text-primary-700 w-full py-3 px-6 rounded-lg bg-primary-700 text-white transition duration-300 transform hover:scale-105 font-semibold">
                                        Contact Us
                                    </button>
                                </Link>
                            </div>

                            {/* Right Side - Image */}
                            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12 flex items-center justify-center">
                                <div className="relative w-full max-w-sm">
                                    <div className="relative toast-float">
                                        <div className="bg-white rounded-2xl shadow-xl p-8 transform rotate-3">
                                            <div className="flex items-center justify-center mb-4">
                                                <Image src="/logo-BTS-25-N.png" alt="Bengaluru Tech Summit 2025" width={100} height={100} className="h-full w-full" />
                                            </div>
                                        </div>
                                        {/* Decorative stars */}
                                        <div className="absolute -top-4 -right-4 text-4xl toast-pulse">✨</div>
                                        <div className="absolute -bottom-4 -left-4 text-3xl toast-pulse toast-delay">✨</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};