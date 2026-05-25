import { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Shield, Laptop, Award, ShieldCheck, Users, Trophy } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import HeroCarousel from "@/components/HeroCarousel";

export const metadata: Metadata = {
  title: 'Imperial Academy | Home',
  description: 'Welcome to Imperial Academy. We provide high-quality education and build strong foundations for future leaders.',
};

export default async function Home() {
  let carouselImages: string[] = ["/images/imperial.jpeg", "/images/library-student.png"];
  let latestNews = [];

  try {
    // Fetch data in parallel for better performance
    const [headersRes, newsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/headers/home`, { next: { revalidate: 3600 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, { next: { revalidate: 3600 } })
    ]);

    if (headersRes.ok) {
      const data = await headersRes.json();
      if (Array.isArray(data) && data.length > 0) {
        carouselImages = data.map((item: any) => item.imageUrl);
      }
    }

    if (newsRes.ok) {
      const newsData = await newsRes.json();
      latestNews = newsData.slice(0, 3); // Just the top 3
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  // Deduplicate images just in case
  carouselImages = Array.from(new Set(carouselImages));

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00236F]/80 to-transparent z-0 pointer-events-none opacity-90" />
      <SchoolNavbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative h-[60vh] flex items-center overflow-hidden">
          <HeroCarousel images={carouselImages} />

          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-3xl mt-16">
            <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
              Excellence In Education
            </p>
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Building Strong Foundations for the Future
            </h1>
            <div className="flex flex-row items-center gap-4 mt-2">
              <Link href="/admissions" className="px-7 py-3 bg-[#00236F] hover:bg-blue-900 hover:scale-105 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                Apply Now
              </Link>
              <Link href="/about" className="px-7 py-3 bg-white/20 hover:bg-white/30 hover:scale-105 backdrop-blur-md text-white font-semibold rounded-xl border border-white/40 transition-all shadow-lg hover:shadow-xl">
                Visit School
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image with gold corner accent */}
            <ScrollReveal direction="left" className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-gold rounded-lg"></div>
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                  <Image
                    src="/images/student-upclose.png"
                    alt="Broken Image"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Text content */}
            <ScrollReveal direction="right" className="w-full lg:w-1/2 space-y-5">
              <div>
                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs mb-4">Our Legacy</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#00236F] leading-tight">
                  Empowering Minds Since 2017
                </h2>
                <p className="text-zinc-600 leading-relaxed">
                  Imperial Academy offers a dynamic and inclusive environment where every child is encouraged to explore their potential. Our holistic approach combines rigorous academics with emotional intelligence and creative freedom.
                </p>
                <Link href="/about" className="inline-flex items-center text-[#00236F] font-bold hover:text-[#FEA619] transition-colors mt-2 group">
                  Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ACADEMICS SECTION */}
        <section className="py-24 bg-zinc-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h3 className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Academic Journey</h3>
              <h2 className="text-3xl md:text-5xl font-bold text-[#00236F]">
                Nurturing Every Stage
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Nursery */}
              <ScrollReveal direction="up" delay={0}>
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-zinc-100 group h-full">
                  <div className="w-16 h-16 bg-purple-100 text-[#00236F] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00236F] mb-4">Nursery</h3>
                  <p className="text-zinc-600 mb-6 line-clamp-3">
                    A play-based curriculum focused on sensory, physical, and social development for our youngest learners.
                  </p>
                  <div className="w-12 h-1 bg-[#FEA619] rounded-full transition-all group-hover:w-full duration-500"></div>
                </div>
              </ScrollReveal>

              {/* Primary */}
              <ScrollReveal direction="up" delay={200}>
                <div className="bg-[#00236F] text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow group transform md:-translate-y-4 h-full">
                  <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Laptop size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Primary</h3>
                  <p className="text-zinc-200 mb-6 line-clamp-3">
                    Building strong academic foundations in literacy, numeracy, and critical thinking through interactive and engaging learning.
                  </p>
                  <div className="w-12 h-1 bg-[#FEA619] rounded-full transition-all group-hover:w-full duration-500"></div>
                </div>
              </ScrollReveal>

              {/* Junior High */}
              <ScrollReveal direction="up" delay={400}>
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-zinc-100 group h-full">
                  <div className="w-16 h-16 bg-purple-100 text-[#00236F] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Award size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00236F] mb-4">Junior High</h3>
                  <p className="text-zinc-600 mb-6 line-clamp-3">
                    Preparing students for the future with specialized subjects, leadership opportunities, and personal development.
                  </p>
                  <div className="w-12 h-1 bg-[#FEA619] rounded-full transition-all group-hover:w-full duration-500"></div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <ScrollReveal>
          <section className="py-14 bg-[#f4f5f7]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    title: "Qualified Teachers",
                    desc: "Expert educators dedicated to personal student growth.",
                    accent: "#00236F"
                  },
                  {
                    icon: ShieldCheck,
                    title: "Safe Environment",
                    desc: "24/7 security and a nurturing community atmosphere.",
                    accent: "#FEA619"
                  },
                  {
                    icon: Laptop,
                    title: "Modern Learning",
                    desc: "Digital-first classrooms with the latest tech tools.",
                    accent: "#00236F"
                  },
                  {
                    icon: Trophy,
                    title: "Extracurriculars",
                    desc: "Diverse clubs from sports to robotics and arts.",
                    accent: "#FEA619"
                  }
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group"
                    style={{ borderBottom: `3px solid ${feature.accent}` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ color: feature.accent }}
                    >
                      <feature.icon size={24} />
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* NEWS & EVENTS */}
        <ScrollReveal>
          <section className="py-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h3 className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Stay Updated</h3>
                <h2 className="text-2xl md:text-4xl font-bold text-[#00236F]">
                  Latest News & Events
                </h2>
              </div>
              <a href="/news" className="hidden md:inline-flex items-center text-brand-navy font-semibold hover:text-brand-gold transition-colors">
                View All News <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.length === 0 ? (
                <div className="col-span-full py-10 text-center text-zinc-500">
                  Stay tuned for upcoming news and events!
                </div>
              ) : (
                latestNews.map((item: any, i: number) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col border border-zinc-100">
                    <div className="relative h-48 overflow-hidden bg-zinc-200">
                      <Image
                        src={item.imageUrl || "/images/news_science_1776684667408.png"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#00236F] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-sm text-zinc-500 mb-3">
                        {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h4 className="text-xl font-bold text-brand-navy mb-3 line-clamp-2">{item.title}</h4>
                      <p className="text-zinc-600 line-clamp-3 mb-4 flex-grow">{item.content}</p>
                      <Link href={`/news/${item.id}`} className="text-[#FEA619] font-bold hover:underline text-sm inline-flex items-center">
                        Read Story <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* TESTIMONIALS */}
        <ScrollReveal>
          <section className="py-24 bg-brand-navy text-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h3 className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Community Voices</h3>
                <h2 className="text-3xl md:text-5xl font-bold">
                  What Parents Are Saying
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                  <div className="text-[#FEA619] text-4xl mb-4 font-serif">"</div>
                  <p className="text-lg text-zinc-200 mb-8 italic">
                    "Enrolling our daughter in Imperial Academy was the best decision we've made. The teachers are incredibly dedicated, and the curriculum is challenging yet supportive. We've seen her confidence soar."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-[#FEA619] bg-zinc-800 flex items-center justify-center text-xl font-bold text-white">
                      MO
                    </div>
                    <div>
                      <div className="font-bold">Mrs.Owusu</div>
                      <div className="text-sm text-zinc-400">Parent of a Primary Student</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                  <div className="text-brand-gold text-4xl mb-4 font-serif">"</div>
                  <p className="text-lg text-zinc-200 mb-8 italic">
                    "The facilities are state-of-the-art, and the focus on holistic development is remarkable. My son is not only excelling academically but also growing into a well-rounded individual."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-[#FEA619] bg-zinc-800 flex items-center justify-center text-xl font-bold text-white">
                      DA
                    </div>
                    <div>
                      <div className="font-bold">Mr.David Asante</div>
                      <div className="text-sm text-zinc-400">Parent of a Junior High Student</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA BANNER */}
        <ScrollReveal>
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative bg-[#00236F]">
              {/* Diagonal stripe accent on right */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-100" style={{ background: "linear-gradient(to bottom-left, #00174f 0%, transparent 60%)" }}></div>
                <div className="absolute right-[30%] top-0 bottom-0 w-[2px] bg-white/5 skew-x-[-15deg]"></div>
                <div className="absolute right-[25%] top-0 bottom-0 w-[60px] bg-white/[0.04] skew-x-[-15deg]"></div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-12">
                {/* Left: text */}
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                    Enroll Your Child<br />Today
                  </h2>
                  <p className="text-blue-200 text-sm md:text-base max-w-sm">
                    Join a community where every child&apos;s potential is recognized and nurtured for a brighter tomorrow.
                  </p>
                </div>

                {/* Right: button */}
                <div className="shrink-0">
                  <a href="/admissions"
                    className="inline-flex items-center px-10 py-4 bg-[#FEA619] hover:bg-[#e89512] text-white font-bold rounded-full text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SchoolFooter />
    </div>
  );
}
