'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2, Trophy } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface Activity {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export default function ActivitiesCarousel() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/activities`);
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data);
                }
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const nextSlide = () => {
        if (activities.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % activities.length);
    };

    const prevSlide = () => {
        if (activities.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setVisibleItems(4);
            else if (window.innerWidth >= 640) setVisibleItems(2);
            else setVisibleItems(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-blue-200">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p>Loading activities...</p>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-blue-200">No activities scheduled at the moment.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full group">
            <div 
                ref={scrollContainerRef}
                className="overflow-hidden"
            >
                <div 
                    className="flex transition-transform duration-500 ease-out gap-6"
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                    }}
                >
                    {activities.map((activity, i) => (
                        <div 
                            key={activity.id}
                            className="shrink-0"
                            style={{ width: `calc(${100 / visibleItems}% - ${(visibleItems - 1) * 24 / visibleItems}px)` }}
                        >
                            <ScrollReveal direction="up" delay={i * 50}>
                                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group/card cursor-pointer shadow-xl border border-white/10">
                                    <Image
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        fill
                                        className="object-cover object-center grayscale group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white font-bold text-xl mb-2 drop-shadow-md">
                                            {activity.title}
                                        </h3>
                                        <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 line-clamp-2">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            {activities.length > visibleItems && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#FEA619] text-[#00236F] shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#FEA619] text-[#00236F] shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        disabled={currentIndex >= activities.length - visibleItems}
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Progress Bar */}
                    <div className="mt-12 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#FEA619] transition-all duration-500"
                            style={{ width: `${((currentIndex + visibleItems) / activities.length) * 100}%` }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
