"use client";

import { useState } from "react";
import NewsCard from "./NewsCard";
import ScrollReveal from "./ScrollReveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    publishedAt: string;
    category: string;
}

interface NewsGridProps {
    news: NewsItem[];
}

const ITEMS_PER_PAGE = 6;

export default function NewsGrid({ news }: NewsGridProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: document.getElementById('news-grid')?.offsetTop || 0 - 100, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: document.getElementById('news-grid')?.offsetTop || 0 - 100, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-[#f8f9fc]" id="news-grid">
            <div className="max-w-7xl mx-auto px-4">

                <div className="mb-12">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#00236F]">
                            Latest News
                        </h2>
                    </ScrollReveal>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentNews.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-zinc-500">
                            No news found.
                        </div>
                    ) : (
                        currentNews.map((item) => (
                            <ScrollReveal key={item.id}>
                                <NewsCard
                                    imageSrc={item.imageUrl || "/images/child_reading_1776684613141.png"}
                                    category={item.category}
                                    date={new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    title={item.title}
                                    excerpt={item.content.substring(0, 150) + "..."}
                                    link={`/news/${item.id}`}
                                />
                            </ScrollReveal>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentPage === 1
                                ? 'border-zinc-200 text-zinc-400 cursor-not-allowed'
                                : 'border-[#00236F] text-[#00236F] hover:bg-[#00236F] hover:text-white'
                                }`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => {
                                            setCurrentPage(pageNumber);
                                            window.scrollTo({ top: document.getElementById('news-grid')?.offsetTop || 0 - 100, behavior: 'smooth' });
                                        }}
                                        className={`w-12 h-12 rounded-full font-bold transition-all ${currentPage === pageNumber
                                            ? 'bg-[#00236F] text-white'
                                            : 'text-zinc-600 hover:bg-zinc-200'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentPage === totalPages
                                ? 'border-zinc-200 text-zinc-400 cursor-not-allowed'
                                : 'border-[#00236F] text-[#00236F] hover:bg-[#00236F] hover:text-white'
                                }`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}
