import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Rocket, Eye, Heart, FileText, Download } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Imperial Academy's history, mission, vision, and core values. We are committed to nurturing the next generation of leaders.",
};

export default async function AboutPage() {
  let headerImage = "/images/library-student.png";
  let prospectus = null;

  try {
    const [headerRes, docRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/headers/about`, { next: { revalidate: 3600 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/prospectus`, { next: { revalidate: 3600 } })
    ]);

    if (headerRes.ok) {
      const data = await headerRes.json();
      if (Array.isArray(data) && data.length > 0) {
        headerImage = data[0].imageUrl;
      }
    }

    if (docRes.ok) {
      prospectus = await docRes.json();
    }
  } catch (error) {
    console.error("Failed to fetch page data:", error);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <SchoolNavbar />

      <main>
        {/* HERO SECTION */}
        <section
          className="relative h-[50vh] min-h-[300px] flex items-center overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={headerImage}
              alt="Imperial Academy Campus"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Navy blue overlay gradient matching the design (dark on left, fading to right) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00236F]/95 via-[#00236F]/70 to-transparent" />
          </div>

          <div className="relative z-10 px-8 md:px-12 lg:px-15 max-w-4xl mt-15">
            <ScrollReveal direction="up">
              <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
                Our Legacy
              </p>
              <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                About Our School
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-light leading-relaxed drop-shadow-sm">
                Nurturing the minds of tomorrow through a tradition of excellence and a future-forward approach to holistic education.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* HISTORY SECTION */}
        <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Image */}
            <ScrollReveal direction="left" className="w-full lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/images/library-student.png"
                  alt="Students in a classroom"
                  fill
                  className="object-cover object-center sepia-[.3]"
                />
              </div>
            </ScrollReveal>

            {/* Right Content */}
            <ScrollReveal direction="right" className="w-full lg:w-1/2 space-y-6">
              <div>
                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs mb-3">
                  Since 2017
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#00236F] leading-tight mb-6">
                  A Legacy of Academic Innovation
                </h2>

                <div className="space-y-4 text-zinc-600 text-lg leading-relaxed">
                  <p>
                    Imperial Academy is a private educational institution located in New Tafo Akyem. Established in 2017 with only four classes and a small number of students, the school has steadily grown through dedication, discipline, and a strong commitment to quality education. Today, the institution provides education from the lower levels up to Junior High School.
                  </p>
                  <p>
                    Since its establishment, Imperial Academy has remained committed to academic excellence, moral discipline, and the overall development of its students. To support both learning and character building, the school has expanded its facilities to include boarding accommodation, offering students a safe and well-supervised environment.
                  </p>
                </div>

                {prospectus && (
                    <div className="pt-6">
                        <a 
                            href={prospectus.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex bg-[#00236F] hover:bg-[#00174f] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 items-center gap-3 w-fit"
                        >
                            <FileText size={20} />
                            <span>Download School Prospectus</span>
                            <Download size={18} />
                        </a>
                    </div>
                )}

                {/* Stats Row */}
                <div className="pt-5 flex flex-wrap gap-8 items-center border-t border-zinc-100 mt-8">
                  <div className="flex flex-col">
                    <CountUp end={15} suffix="+" className="text-3xl font-bold text-[#00236F]" />
                    <span className="text-xs tracking-widest text-zinc-500 uppercase font-semibold mt-1">Years</span>
                  </div>
                  <div className="w-[4px] h-12 bg-[#FEA619]/30 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <CountUp end={5} suffix="k" className="text-3xl font-bold text-[#00236F]" />
                    <span className="text-xs tracking-widest text-zinc-500 uppercase font-semibold mt-1">Alumni</span>
                  </div>
                  <div className="w-[4px] h-12 bg-[#FEA619]/30 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <CountUp end={1000} suffix="+" className="text-3xl font-bold text-[#00236F]" />
                    <span className="text-xs tracking-widest text-zinc-500 uppercase font-semibold mt-1">Enrollments</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* PURPOSE & PRINCIPLES SECTION */}
        <section className="py-24 bg-[#f9fafb] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs mb-4">
                  Guiding Lights
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#00236F]">
                  Our Purpose & Principles
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission Card */}
              <ScrollReveal direction="up" delay={0}>
                <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-shadow h-full border border-zinc-100">
                  <div className="w-14 h-14 bg-[#FEA619]/10 text-[#FEA619] rounded-2xl flex items-center justify-center mb-8">
                    <Rocket size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00236F] mb-4">Our Mission</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    The mission of imperial academy is to provide a safe, positive learning environment that promotes critical thinking to empower all pupils to thrive and grow intellectually, physically, emotionally and socially.
                  </p>
                </div>
              </ScrollReveal>

              {/* Vision Card */}
              <ScrollReveal direction="up" delay={200}>
                <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-shadow h-full border border-zinc-100">
                  <div className="w-14 h-14 bg-[#FEA619]/10 text-[#FEA619] rounded-2xl flex items-center justify-center mb-8">
                    <Eye size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00236F] mb-4">Our Vision</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    The vision of imperial academy is to challenge all pupils to earn excellent grades at the basic level to ensure admission to first class senior high schools to enable them become productive and committed citizens.
                  </p>
                </div>
              </ScrollReveal>

              {/* Core Values Card */}
              <ScrollReveal direction="up" delay={400}>
                <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-shadow h-full border border-zinc-100">
                  <div className="w-14 h-14 bg-[#FEA619]/10 text-[#FEA619] rounded-2xl flex items-center justify-center mb-8">
                    <Heart size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#00236F] mb-4">Core Values</h3>
                  <ul className="space-y-3">
                    {["Intellectual Rigor", "Cultural Empathy", "Bold Innovation", "Ethical Leadership"].map((value, i) => (
                      <li key={i} className="flex items-center text-zinc-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FEA619] mr-3"></div>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* PRINCIPAL's MESSAGE SECTION */}
        <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Content */}
            <ScrollReveal direction="left" className="w-full lg:w-3/5 order-2 lg:order-1">
              <div>
                <h2 className="text-4xl font-extrabold text-[#00236F] mb-8">
                  Principal&apos;s Message
                </h2>

                <div className="space-y-6 text-zinc-600 text-lg leading-relaxed">
                  <p>
                    At the heart of our institution is a commitment to excellence in both academic achievement and character development. We believe education goes beyond the classroom—it is about nurturing confident, responsible, and innovative individuals who are prepared to contribute meaningfully to society.
                  </p>
                  <p>
                    Our dedicated team of educators works collaboratively to create a supportive and engaging learning environment where every student is encouraged to discover their strengths and reach their full potential. We emphasize discipline, integrity, creativity, and critical thinking as core values that guide our students throughout their educational journey.
                  </p>
                  <p>
                    We also recognize the importance of strong partnerships with parents and the wider community. Together, we create a foundation that supports holistic growth and lifelong learning.
                  </p>
                  <p>
                    As you explore our website, I invite you to learn more about our programs, values, and the opportunities we provide for every learner to succeed.
                  </p>
                  <p className="font-bold text-[#00236F] pt-2">
                    Thank you for being part of our journey.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Profile */}
            <ScrollReveal direction="right" className="w-full lg:w-2/5 order-1 lg:order-2 lg:pt-16">
              <div className="bg-zinc-50 rounded-[2.5rem] p-6 pb-8 border border-zinc-100 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 shadow-inner bg-[#e2e8f0]">
                  <Image
                    src="/images/avatar_placeholder.png"
                    alt="Lorem Ipsum"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#00236F] mb-1">
                  Lorem Ipsum
                </h3>
                <p className="text-[#FEA619] font-bold mb-3">
                  Lorem Ipsum
                </p>
                <p className="text-sm text-zinc-500 px-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SchoolFooter />
    </div>
  );
}
