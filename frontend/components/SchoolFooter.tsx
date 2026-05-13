import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function SchoolFooter() {
  return (
    <footer className="bg-[#00174f] text-zinc-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#FEA619] rounded-lg flex items-center justify-center font-bold text-[#00236F] text-xl">
              IA
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Imperial Academy
            </span>
          </div>
          <p className="mb-6 leading-relaxed text-zinc-300">
            Building strong foundations for the future. Empowering students to excel academically, socially, and personally since 2017.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#FEA619] hover:text-[#00236F] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#FEA619] hover:text-[#00236F] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#FEA619] hover:text-[#00236F] transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-[#FEA619] transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#FEA619] transition-colors">About Us</Link></li>
            <li><Link href="/academics" className="hover:text-[#FEA619] transition-colors">Academics</Link></li>
            <li><Link href="/admissions" className="hover:text-[#FEA619] transition-colors">Admissions</Link></li>
            <li><Link href="/news" className="hover:text-[#FEA619] transition-colors">News & Events</Link></li>
            <li><Link href="/gallery" className="hover:text-[#FEA619] transition-colors">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-[#FEA619] transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Programs</h4>
          <ul className="space-y-3">
            <li><Link href="/academics" className="hover:text-[#FEA619] transition-colors">Nursery School</Link></li>
            <li><Link href="/academics" className="hover:text-[#FEA619] transition-colors">Primary School</Link></li>
            <li><Link href="/academics" className="hover:text-[#FEA619] transition-colors">Junior High School</Link></li>
            <li><Link href="/academics" className="hover:text-[#FEA619] transition-colors">Holistic Education</Link></li>
            <li><Link href="/academics" className="hover:text-[#FEA619] transition-colors">Extracurriculars</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-[#FEA619] mt-1 shrink-0" size={20} />
              <span>TQ 63, New Tafo Akim.<br />Digital Address: EE-1049-7190</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-[#FEA619] shrink-0" size={20} />
              <span>0201188847 / 0543974931</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-[#FEA619] shrink-0" size={20} />
              <span className="break-all">imperailacademy68@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-zinc-900 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Imperial Academy. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-[#FEA619] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#FEA619] transition-colors">Terms of Service</Link>
          <Link href="/admin/login" className="hover:text-[#FEA619] transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
