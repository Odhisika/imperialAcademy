import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Music2,
  Phone,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getSiteSettings, telHref } from "@/lib/siteSettings";

export default async function SchoolFooter() {
  const settings = await getSiteSettings();
  const socials = [
    { label: "Facebook", href: settings.facebookUrl, Icon: Facebook },
    { label: "Instagram", href: settings.instagramUrl, Icon: Instagram },
    { label: "X (Twitter)", href: settings.twitterUrl, Icon: Twitter },
    { label: "LinkedIn", href: settings.linkedinUrl, Icon: Linkedin },
    { label: "YouTube", href: settings.youtubeUrl, Icon: Youtube },
    { label: "TikTok", href: settings.tiktokUrl, Icon: Music2 },
  ].filter((item) => item.href);

  return (
    <footer className="bg-[#00174f] text-zinc-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-6 group cursor-pointer">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-[#FEA619] shadow-md group-hover:scale-110 transition-transform duration-300 bg-white">
              <Image 
                src="/images/logo.jpeg" 
                alt="Imperial Academy Logo" 
                fill 
                className="object-contain p-1"
              />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              Imperial Academy
            </span>
          </div>
          <p className="mb-6 leading-relaxed text-zinc-300">
            Building strong foundations for the future. Empowering students to excel academically, socially, and personally since 2017.
          </p>
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
          <h4 className="text-white font-bold text-lg mb-6">Portal</h4>
          <ul className="space-y-3">
            <li>
              <a 
                href="https://ssm.imperialacademy.edu.gh/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#FEA619] transition-colors"
              >
                SSM Portal
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-[#FEA619] mt-1 shrink-0" size={20} />
              <span>
                {settings.addressLine1}
                {settings.digitalAddress && (
                  <>
                    <br />Digital Address: {settings.digitalAddress}
                  </>
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="text-[#FEA619] shrink-0" size={20} />
              <span className="flex flex-wrap gap-x-2">
                {[settings.phone1, settings.phone2].filter(Boolean).map((phone, index) => (
                  <span key={phone}>
                    {index > 0 && <span className="text-zinc-500">/</span>}{" "}
                    <a href={telHref(phone)} className="hover:text-[#FEA619] transition-colors">{phone}</a>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-[#FEA619] shrink-0" size={20} />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-[#FEA619] transition-colors">
                {settings.email}
              </a>
            </li>
          </ul>

          {socials.length > 0 && (
            <div className="mt-8">
              <p className="text-white font-bold mb-3">Follow Us</p>
              <div className="flex flex-wrap items-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FEA619] hover:text-[#00174f] transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-zinc-900 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Imperial Academy. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-[#FEA619] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#FEA619] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
