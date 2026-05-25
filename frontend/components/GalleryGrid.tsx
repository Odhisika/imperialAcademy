"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface GalleryItem {
    id: number;
    imageUrl: string;
    category: string;
    title?: string;
}

interface GalleryGridProps {
    initialItems: GalleryItem[];
}

const categories = ["All", "Campus", "Sports", "Arts", "Academics"];

export default function GalleryGrid({ initialItems }: GalleryGridProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImageIndex, setSelectedImageIndex] = useState<null | number>(null);

    const filteredImages = activeCategory === "All"
        ? initialItems
        : initialItems.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase());

    const openLightbox = (id: number) => {
        const index = initialItems.findIndex(img => img.id === id);
        setSelectedImageIndex(index);
    };

    const closeLightbox = () => setSelectedImageIndex(null);

    const nextImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % initialItems.length);
        }
    };

    const prevImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + initialItems.length) % initialItems.length);
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">

                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${activeCategory === cat
                                ? "bg-[#00236F] text-white shadow-lg"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredImages.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-zinc-500">
                            No images found in this category.
                        </div>
                    ) : (
                        filteredImages.map((img) => (
                            <ScrollReveal key={img.id}>
                                <div
                                    className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-md cursor-pointer border border-zinc-100"
                                    onClick={() => openLightbox(img.id)}
                                >
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.title || "Gallery Image"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-center text-white p-6">
                                            <Maximize2 className="mx-auto mb-3" size={32} />
                                            <p className="text-sm font-bold uppercase tracking-widest mb-1">{img.category}</p>
                                            <h3 className="text-xl font-bold">{img.title || "Imperial Academy"}</h3>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))
                    )}
                </div>

                {/* Lightbox */}
                {selectedImageIndex !== null && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                        <button
                            className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-[110]"
                            onClick={closeLightbox}
                        >
                            <X size={40} />
                        </button>

                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110]"
                            onClick={prevImage}
                        >
                            <ChevronLeft size={60} />
                        </button>

                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110]"
                            onClick={nextImage}
                        >
                            <ChevronRight size={60} />
                        </button>

                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <div className="relative w-full max-w-5xl aspect-video lg:aspect-[16/9] animate-in zoom-in-95 duration-300">
                                <Image
                                    src={initialItems[selectedImageIndex].imageUrl}
                                    alt={initialItems[selectedImageIndex].title || "Gallery Image"}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="mt-8 text-center text-white">
                                <p className="text-[#FEA619] font-bold tracking-widest uppercase text-sm mb-2">
                                    {initialItems[selectedImageIndex].category}
                                </p>
                                <h3 className="text-2xl md:text-3xl font-bold">
                                    {initialItems[selectedImageIndex].title || "Imperial Academy Gallery"}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
