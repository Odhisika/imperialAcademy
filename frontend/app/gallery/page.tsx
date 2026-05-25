import { Metadata } from "next";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Explore our vibrant campus life through our official photo gallery. See our students in action at Imperial Academy.",
};

export default async function GalleryPage() {
    let galleryItems = [];

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, { next: { revalidate: 3600 } });
        if (res.ok) {
            galleryItems = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch gallery:", error);
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-hidden relative">
            {/* Top Navbar Gradient Background to make white text readable */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00236F]/80 to-transparent z-0 pointer-events-none opacity-90" />

            <SchoolNavbar />

            <main>
                {/* GALLERY HERO SECTION */}
                <section className="relative pt-24 pb-9 lg:pt-28 lg:pb-9 px-4 max-w-7xl mx-auto flex items-center">
                    <div className="flex flex-col items-center text-center w-full">

                        <div className="max-w-3xl z-10">
                            <ScrollReveal>
                                <p className="text-[#a47b38] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
                                    VIRTUAL TOUR
                                </p>
                                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-4 tracking-tight">
                                    <span className="text-[#00236F]">Life at</span><br />
                                    <span className="text-[#FEA619]">Imperial Academy</span>
                                </h1>
                                <p className="text-zinc-600 text-md md:text-lg leading-relaxed font-medium">
                                    Discover the moments that define our community—from academic breakthroughs and artistic expressions to sporting triumphs and campus celebrations.
                                </p>
                            </ScrollReveal>
                        </div>

                    </div>

                    {/* Background Decoration */}
                    <div className="hidden lg:block absolute top-0 right-0 w-[45%] h-full bg-[#f8f9fc] rounded-bl-[8rem] -z-10" />
                </section>

                {/* GALLERY GRID */}
                <GalleryGrid initialItems={galleryItems} />
            </main>

            <SchoolFooter />
        </div>
    );
}
