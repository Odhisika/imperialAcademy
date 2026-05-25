"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Academics", href: "/academics" },
  { name: "Admissions", href: "/admissions" },
  { name: "News & Events", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function SchoolNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-[#FEA619] shadow-md group-hover:scale-110 transition-transform duration-300 bg-white">
            <Image 
              src="/images/logo.jpeg" 
              alt="Imperial Academy Logo" 
              fill 
              className="object-contain p-1"
            />
          </div>
          <span className={`font-bold text-xl tracking-tight ${isScrolled ? "text-[#00236F]" : "text-white drop-shadow-md"}`}>
            Imperial Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className={`hidden md:flex items-center gap-8 font-medium ${isScrolled ? "text-zinc-600" : "text-white/90 drop-shadow-sm"}`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link key={link.name} href={link.href} className={`relative group transition-colors ${isActive ? 'text-[#FEA619]' : 'hover:text-[#FEA619]'}`}>
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#FEA619] transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/admissions" className="bg-[#00236F] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#00174f] transition-colors shadow-md">
            Apply Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 rounded-md ${isScrolled ? "text-[#00236F]" : "text-white drop-shadow-md"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-zinc-100 flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium text-lg ${isActive ? 'text-[#FEA619]' : 'text-zinc-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/admissions"
            className="bg-[#00236F] text-white font-bold px-5 py-3 rounded-xl text-center mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Apply Now
          </Link>
        </div>
      )}
    </nav>
  );
} 
