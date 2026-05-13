'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
    images: string[];
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance the carousel every 5 seconds
    useEffect(() => {
        if (!images || images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [images]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (!images || images.length === 0) {
        return (
            <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                <span className="text-zinc-500">No header image available</span>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-0 overflow-hidden group">
            {/* Images */}
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={image}
                        alt={`Hero image ${index + 1}`}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                    />
                </div>
            ))}

            {/* Left-heavy gradient overlay matching the reference */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00236F]/90 via-[#00236F]/60 to-transparent pointer-events-none z-10" />

            {/* Navigation Arrows (Visible on hover) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    index === currentIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
