import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface FeaturedNewsProps {
    news: {
        id: number;
        title: string;
        content: string;
        imageUrl?: string;
        publishedAt: string;
        category: string;
    }
}

export default function FeaturedNews({ news }: FeaturedNewsProps) {
    const formattedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <section className="py-10 md:py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <ScrollReveal>
                    <div className="bg-[#f8f9fc] rounded-[2rem] p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 border border-zinc-100">

                        {/* Left Image */}
                        <div className="w-full lg:w-1/2 relative aspect-[3/2] rounded-3xl overflow-hidden shadow-md">
                            <Image
                                src={news.imageUrl || "/images/child_reading_1776684613141.png"}
                                alt={news.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
                        </div>

                        {/* Right Content */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center">
                            <p className="text-[#a47b38] font-bold tracking-wider uppercase text-xs md:text-sm mb-4">
                                {formattedDate} • FEATURED
                            </p>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00236F] leading-tight mb-6">
                                {news.title}
                            </h2>
                            <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8 line-clamp-3">
                                {news.content}
                            </p>

                            <Link href={`/news/${news.id}`} className="inline-flex items-center gap-2 text-[#00236F] font-bold text-lg hover:text-[#FEA619] transition-colors w-fit group">
                                Read Full Story
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
