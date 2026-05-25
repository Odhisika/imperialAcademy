import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface NewsCardProps {
    imageSrc: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    link: string;
}

export default function NewsCard({ imageSrc, category, date, title, excerpt, link }: NewsCardProps) {
    return (
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 border border-zinc-100 flex flex-col h-full overflow-hidden hover:-translate-y-2 group">
            
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content Container */}
            <div className="p-8 flex flex-col flex-grow">
                <p className="text-[#a47b38] font-bold tracking-wider uppercase text-xs mb-4">
                    {category} • {date}
                </p>
                
                <h3 className="text-xl md:text-2xl font-bold text-[#00236F] leading-tight mb-4 line-clamp-2">
                    {title}
                </h3>
                
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-8 flex-grow line-clamp-3">
                    {excerpt}
                </p>
                
                <Link href={link} className="inline-flex items-center gap-1 text-[#00236F] font-bold text-sm md:text-base hover:text-[#FEA619] transition-colors w-fit mt-auto group/link">
                    Read More 
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
            
        </div>
    );
}
