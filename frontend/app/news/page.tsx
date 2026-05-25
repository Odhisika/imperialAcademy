import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import FeaturedNews from "@/components/FeaturedNews";
import NewsGrid from "@/components/NewsGrid";

export const metadata: Metadata = {
    title: "News & Updates",
    description: "Stay informed with the latest school events, achievements, and updates from Imperial Academy.",
};

export default async function NewsPage() {
    let news = [];
    let featuredNews = null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, { next: { revalidate: 3600 } });
        if (res.ok) {
            news = await res.json();
            featuredNews = news.find((item: any) => item.isFeatured) || news[0];
        }
    } catch (error) {
        console.error("Failed to fetch news:", error);
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-hidden relative">
            {/* Top Navbar Gradient Background to make white text readable */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00236F]/80 to-transparent z-0 pointer-events-none opacity-90" />

            <SchoolNavbar />

            <main>
                {/* NEWS HERO SECTION */}
                <section className="relative pt-24 pb-9 lg:pt-28 lg:pb-9 px-4 max-w-7xl mx-auto flex items-center">
                    <div className="flex flex-col items-center text-center w-full">


                        <div className="max-w-3xl z-10">
                            <ScrollReveal>
                                <p className="text-[#a47b38] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
                                    STAY INFORMED
                                </p>
                                <h1 className="text-4xl md:text-5xl lg:text-[3rem] font-bold leading-[1.1] mb-4 tracking-tight">
                                    <span className="text-[#00236F]">School Events &</span><br />
                                    <span className="text-[#FEA619]">Updates</span>
                                </h1>
                                <p className="text-zinc-600 text-md md:text-lg max-w-lg leading-relaxed font-medium mb-10">
                                    Explore the latest happenings, academic breakthroughs, and campus events from the heart of our learning community.
                                </p>
                            </ScrollReveal>
                        </div>

                    </div>
                </section>

                {/* FEATURED NEWS SECTION */}
                {featuredNews && <FeaturedNews news={featuredNews} />}

                {/* NEWS GRID SECTION */}
                <NewsGrid news={news} />
            </main>

            <SchoolFooter />
        </div>
    );
}