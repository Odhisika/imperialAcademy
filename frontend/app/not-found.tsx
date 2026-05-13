"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Search, GraduationCap } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SchoolNavbar />
      
      <main className="flex-1 flex items-center justify-center relative overflow-hidden py-20 px-4">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00236F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#FEA619]/5 rounded-full blur-2xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10 max-w-2xl w-full text-center">
          {/* Animated 404 Graphic */}
          <div className="relative mb-12 inline-block">
             <div className="text-[12rem] md:text-[16rem] font-black text-[#00236F]/10 select-none">
               404
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500 border border-zinc-100">
                   <GraduationCap size={80} className="text-[#FEA619] md:w-32 md:h-32" />
                </div>
             </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00236F] mb-6">
            Class is Out of Session
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
            It seems the page you are looking for has graduated or moved to a new campus. Let&apos;s get you back on the right academic path.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="w-full sm:w-auto px-8 py-4 bg-[#00236F] hover:bg-[#00174f] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>Back to Homepage</span>
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-16 pt-8 border-t border-zinc-100">
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Explore Our Campus</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link href="/about" className="text-[#00236F] hover:text-[#FEA619] font-semibold transition-colors">About Us</Link>
              <Link href="/academics" className="text-[#00236F] hover:text-[#FEA619] font-semibold transition-colors">Academics</Link>
              <Link href="/admissions" className="text-[#00236F] hover:text-[#FEA619] font-semibold transition-colors">Admissions</Link>
              <Link href="/news" className="text-[#00236F] hover:text-[#FEA619] font-semibold transition-colors">News & Events</Link>
            </div>
          </div>
        </div>
      </main>

      <SchoolFooter />
    </div>
  );
}
