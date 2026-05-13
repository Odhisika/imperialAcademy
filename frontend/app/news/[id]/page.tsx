import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

interface NewsArticle {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    imageUrl?: string;
    author?: string;
    publishedAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getArticle(id: string): Promise<NewsArticle | null> {
    try {
        const res = await fetch(`${API_BASE}/api/news/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const article = await getArticle(id);
    
    if (!article) return { title: 'Article Not Found | Imperial Academy' };

    return {
        title: article.title,
        description: article.excerpt || article.content.substring(0, 160),
        openGraph: {
            title: article.title,
            description: article.excerpt || article.content.substring(0, 160),
            images: article.imageUrl ? [article.imageUrl] : [],
            type: 'article',
            publishedTime: article.publishedAt,
            authors: article.author ? [article.author] : ['Imperial Academy'],
        },
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) notFound();

    const publishDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <main className="min-h-screen bg-white">
            <SchoolNavbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-[#00236F] flex items-center justify-center overflow-hidden">
                <Image
                    src={article.imageUrl || "/images/primary.jpg"}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00236F] via-[#00236F]/40 to-transparent"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <ScrollReveal>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-[#FEA619] text-[#00236F] rounded-full text-xs font-bold uppercase tracking-widest">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-200 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#FEA619]" />
                                {publishDate}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-[#FEA619]" />
                                {article.author || "Imperial Academy"}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-16">
                        
                        {/* Article Body */}
                        <div className="lg:col-span-8">
                            <Link 
                                href="/news" 
                                className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#00236F] transition-colors mb-12 font-bold group"
                            >
                                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                Back to All News
                            </Link>

                            <ScrollReveal>
                                <div className="prose prose-lg prose-zinc max-w-none dark:prose-invert 
                                    prose-headings:text-[#00236F] prose-headings:font-black 
                                    prose-p:text-zinc-600 prose-p:leading-relaxed
                                    prose-strong:text-[#00236F] prose-strong:font-bold
                                    prose-img:rounded-3xl prose-img:shadow-2xl">
                                    <ReactMarkdown>{article.content}</ReactMarkdown>
                                </div>
                            </ScrollReveal>

                            {/* Tags/Footer */}
                            <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-zinc-400" />
                                    <span className="text-zinc-500 font-medium">Categorized in:</span>
                                    <span className="text-[#00236F] font-bold">{article.category}</span>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-500 font-bold">Share:</span>
                                    <button className="p-2.5 rounded-full bg-zinc-50 text-zinc-400 hover:bg-[#1877F2] hover:text-white transition-all">
                                        <Facebook className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 rounded-full bg-zinc-50 text-zinc-400 hover:bg-[#1DA1F2] hover:text-white transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 rounded-full bg-zinc-50 text-zinc-400 hover:bg-[#FEA619] hover:text-white transition-all">
                                        <LinkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-12">
                            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 sticky top-24">
                                <h4 className="text-xl font-black text-[#00236F] mb-6">Imperial Academy</h4>
                                <p className="text-zinc-600 text-sm leading-relaxed mb-8">
                                    Stay connected with the latest updates from our campus. We are committed to sharing our journey of excellence and growth with our community.
                                </p>
                                <div className="space-y-4">
                                    <Link href="/contact" className="block w-full text-center py-4 bg-[#00236F] text-white font-bold rounded-2xl hover:bg-[#001a54] transition-colors shadow-lg shadow-[#00236F]/20">
                                        Contact Us
                                    </Link>
                                    <Link href="/admissions" className="block w-full text-center py-4 bg-[#FEA619] text-[#00236F] font-bold rounded-2xl hover:bg-[#e59516] transition-colors">
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>

            <SchoolFooter />
        </main>
    );
}
