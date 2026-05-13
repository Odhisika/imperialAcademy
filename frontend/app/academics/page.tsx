import Image from "next/image";
import Link from "next/link";
import SchoolNavbar from "@/components/SchoolNavbar";
import ScrollReveal from "@/components/ScrollReveal";
import SchoolFooter from "@/components/SchoolFooter";
import ActivitiesCarousel from "@/components/ActivitiesCarousel";
import { BookOpen, BrainCircuit, CheckCircle2, ArrowRight, Download, Calendar } from "lucide-react";

export const metadata = {
    title: "Academics | Imperial Academy",
    description: "Our holistic curriculum balances rigorous intellectual inquiry with creative exploration.",
};

export default async function AcademicsPage() {
    let headerImage = "/images/library-student.png";
    let calendar = null;
    let prospectus = null;

    try {
        const [headerRes, docRes, prospectusRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/headers/academics`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/academic-calendar`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/prospectus`, { cache: 'no-store' })
        ]);

        if (headerRes.ok) {
            const data = await headerRes.json();
            if (Array.isArray(data) && data.length > 0) {
                headerImage = data[0].imageUrl;
            }
        }

        if (docRes.ok) {
            calendar = await docRes.json();
        }

        if (prospectusRes.ok) {
            prospectus = await prospectusRes.json();
        }
    } catch (error) {
        console.error("Failed to fetch page data:", error);
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-hidden relative">
            {/* Top Navbar Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00236F]/80 to-transparent z-0 pointer-events-none opacity-90" />

            <SchoolNavbar />

            <main>
                {/* ACADEMICS HERO SECTION */}
                <section className="relative pt-14 pb-20 lg:pt-14 lg:pb-32 px-4 max-w-7xl mx-auto flex items-center overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">

                        {/* Left Content */}
                        <ScrollReveal direction="left" className="w-full lg:w-1/2 flex flex-col items-start z-10">
                            <div>
                                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-5 mt-5">
                                    Academic Excellence
                                </p>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00236F] leading-[1.1] mb-5 tracking-tight">
                                    Cultivating Minds,<br />
                                    <span className="text-[#FEA619]">Inspiring</span> Futures.
                                </h1>
                                <p className="text-zinc-600 text-lg md:text-lg max-w-lg leading-relaxed font-medium mb-8">
                                    Our holistic curriculum balances rigorous intellectual inquiry with creative exploration, ensuring every student discovers their unique potential in a supportive, modern environment.
                                </p>

                                {calendar && (
                                    <a 
                                        href={calendar.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex bg-[#00236F] hover:bg-[#00174f] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 items-center gap-3 w-fit"
                                    >
                                        <Calendar size={20} />
                                        <span>Download Academic Calendar</span>
                                    </a>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Right Image Content */}
                        <ScrollReveal direction="right" className="w-full lg:w-1/2 relative mt-10 lg:mt-10">
                            <div className="relative">
                                {/* Image Container with a slight rotation */}
                                <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:ml-auto transform rotate-3 rounded-[2rem] overflow-hidden shadow-2xl transition-transform hover:rotate-0 duration-500">
                                    <Image
                                        src={headerImage}
                                        alt="Student studying"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />
                                </div>

                                {/* Overlapping Quote Card */}
                                <div className="absolute -bottom-8 -left-4 md:-left-12 bg-white rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-xs border border-zinc-50 z-20 transform -rotate-2">
                                    <p className="text-[#00236F] font-semibold text-[15px] leading-relaxed">
                                        "Education is not the filling of a pail, but the lighting of a fire."
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </section>

                {/* TEACHING PHILOSOPHY SECTION */}
                <section className="py-24 bg-[#f4f5f7] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8">

                            {/* Left Side: Text and List */}
                            <ScrollReveal direction="left" className="w-full lg:w-1/3 flex flex-col items-start pt-4">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#00236F] mb-6">
                                        Our Teaching Philosophy
                                    </h2>
                                    <p className="text-zinc-600 leading-relaxed mb-10">
                                        We believe in a student-centered approach where inquiry-based learning meets global standards.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#2d4b9e] text-white flex items-center justify-center shadow-md shrink-0">
                                                <BookOpen size={20} />
                                            </div>
                                            <span className="font-bold text-[#00236F]">Inquiry-Based Learning</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#2d4b9e] text-white flex items-center justify-center shadow-md shrink-0">
                                                <BrainCircuit size={20} />
                                            </div>
                                            <span className="font-bold text-[#00236F]">Critical Thinking focus</span>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Right Side: Staggered Cards */}
                            <div className="w-full lg:w-2/3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                                    {/* Column 1 */}
                                    <div className="space-y-6 lg:space-y-8">
                                        <ScrollReveal direction="up" delay={0}>
                                            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-zinc-100">
                                                <h3 className="text-xl font-bold text-[#00236F] mb-4">Core Subjects</h3>
                                                <p className="text-zinc-600 text-sm leading-relaxed">
                                                    Mathematics, Sciences, Language Arts, and Humanities form the bedrock of our intellectual pursuit, delivered through collaborative projects.
                                                </p>
                                            </div>
                                        </ScrollReveal>

                                        <ScrollReveal direction="up" delay={200}>
                                            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-zinc-100">
                                                <h3 className="text-xl font-bold text-[#00236F] mb-4">Digital Literacy</h3>
                                                <p className="text-zinc-600 text-sm leading-relaxed">
                                                    Technology is woven into the curriculum, not as a separate subject but as a tool for research, creation, and problem-solving.
                                                </p>
                                            </div>
                                        </ScrollReveal>
                                    </div>

                                    {/* Column 2 (Staggered downwards on larger screens) */}
                                    <div className="space-y-6 lg:space-y-8 md:mt-12">
                                        <ScrollReveal direction="up" delay={100}>
                                            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-zinc-100">
                                                <h3 className="text-xl font-bold text-[#00236F] mb-4">Global Perspectives</h3>
                                                <p className="text-zinc-600 text-sm leading-relaxed">
                                                    Students engage with international issues, developing empathy and understanding of diverse cultures through our integrated world studies.
                                                </p>
                                            </div>
                                        </ScrollReveal>

                                        <ScrollReveal direction="up" delay={300}>
                                            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-zinc-100">
                                                <h3 className="text-xl font-bold text-[#00236F] mb-4">Character Dev</h3>
                                                <p className="text-zinc-600 text-sm leading-relaxed">
                                                    Our 'Horizon Values' program integrates ethics and social-emotional learning into daily academic life.
                                                </p>
                                            </div>
                                        </ScrollReveal>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ACADEMIC PROGRAMS SECTION */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">

                        <div className="text-center mb-16">
                            <ScrollReveal direction="up">
                                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">
                                    Pathways
                                </p>
                                <h2 className="text-4xl md:text-5xl font-bold text-[#00236F]">
                                    Academic Programs
                                </h2>
                            </ScrollReveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">

                            {/* Nursery Card */}
                            <ScrollReveal direction="up" delay={0}>
                                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 border border-zinc-100 flex flex-col h-full">
                                    <div className="relative w-full aspect-[4/3]">
                                        <Image src="/images/nursery.jpg" alt="Nursery" fill className="object-cover object-center" />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold text-[#00236F]">Nursery</h3>
                                            <span className="bg-[#fcecdb] text-[#b46b25] text-[11px] tracking-wider font-bold px-3 py-1 rounded-full">AGES 3-5</span>
                                        </div>
                                        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                            At Imperial Academy, the Nursery section offers a safe and caring environment where children learn through play, creativity, and social interaction. Pupils develop confidence, communication skills, and basic knowledge of letters, numbers, shapes, and colors while building positive relationships with others.
                                        </p>
                                        <ul className="space-y-3 mb-8 flex-grow">
                                            <li className="flex items-start gap-2 text-zinc-600 text-sm">
                                                <CheckCircle2 size={18} className="text-[#FEA619] shrink-0 mt-0.5" />
                                                <span>Sensory Exploration</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-zinc-600 text-sm">
                                                <CheckCircle2 size={18} className="text-[#FEA619] shrink-0 mt-0.5" />
                                                <span>Early Literacy & Numeracy</span>
                                            </li>
                                        </ul>
                                        <button className="w-full py-3 rounded-xl border-2 border-[#00236F] text-[#00236F] font-bold hover:bg-[#00236F] hover:text-white transition-colors">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Primary Card (Emphasized) */}
                            <ScrollReveal direction="up" delay={200}>
                                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.12)] hover:shadow-[0_30px_60px_rgb(0,0,0,0.18)] hover:-translate-y-2 transition-all duration-300 border border-zinc-100 flex flex-col h-full transform lg:-translate-y-4">
                                    <div className="relative w-full aspect-[4/3]">
                                        <Image src="/images/primary.jpg" alt="Primary" fill className="object-cover object-center" />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold text-[#00236F]">Primary</h3>
                                            <span className="bg-[#fcecdb] text-[#b46b25] text-[11px] tracking-wider font-bold px-3 py-1 rounded-full">AGES 6-11</span>
                                        </div>
                                        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                        The Primary section builds strong foundations in reading, writing, mathematics, science, and other core subjects. Pupils are also guided to develop creativity, communication skills, discipline, teamwork, and good moral values through both academic and practical learning.
                                        </p>
                                        <ul className="space-y-3 mb-8 flex-grow">
                                            <li className="flex items-start gap-2 text-zinc-600 text-sm">
                                                <CheckCircle2 size={18} className="text-[#FEA619] shrink-0 mt-0.5" />
                                                <span>Core Mastery (STEM & Arts)</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-zinc-600 text-sm">
                                                <CheckCircle2 size={18} className="text-[#FEA619] shrink-0 mt-0.5" />
                                                <span>Project-Based Learning</span>
                                            </li>
                                        </ul>
                                        <button className="w-full py-3 rounded-xl bg-[#00236F] text-white font-bold shadow-md hover:bg-[#00236F]/90 transition-colors">
                                            View Curriculum
                                        </button>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Junior High Card */}
                            <ScrollReveal direction="up" delay={400}>
                                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 border border-zinc-100 flex flex-col h-full">
                                    <div className="relative w-full aspect-[4/3]">
                                        <Image src="/images/jhs.jpg" alt="Junior High" fill className="object-cover object-center" />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold text-[#00236F]">Junior High</h3>
                                            <span className="bg-[#fcecdb] text-[#b46b25] text-[11px] tracking-wider font-bold px-3 py-1 rounded-full">AGES 12-15</span>
                                        </div>
                                        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                                        The Junior High School section prepares students for higher education and future opportunities through structured, advanced learning. Learners are guided to develop independence, leadership, responsibility, and academic excellence while being prepared for the Basic Education Certificate Examination (BECE) and the next stage of their education.
                                        </p>
                                        <ul className="space-y-3 mb-8 flex-grow">
                                            <li className="flex items-start gap-2 text-zinc-600 text-sm">
                                                <CheckCircle2 size={18} className="text-[#FEA619] shrink-0 mt-0.5" />
                                                <span>Specialized Sciences</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-zinc-600 text-sm">
                                                <CheckCircle2 size={18} className="text-[#FEA619] shrink-0 mt-0.5" />
                                                <span>Leadership Workshops</span>
                                            </li>
                                        </ul>
                                        <button className="w-full py-3 rounded-xl border-2 border-[#00236F] text-[#00236F] font-bold hover:bg-[#00236F] hover:text-white transition-colors">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </ScrollReveal>

                        </div>
                    </div>
                </section>

                {/* EXTRACURRICULAR SECTION */}
                <section className="py-24 bg-[#00236F] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">

                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                            <div className="max-w-2xl">
                                <ScrollReveal direction="left">
                                    <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">
                                        Beyond The Classroom
                                    </p>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        Discover Extra Curricular Activities
                                    </h2>
                                    <p className="text-[#90A8FF] text-lg leading-relaxed font-light">
                                        We offer a diverse range of clubs and sports that allow students to explore their passions, develop new skills, and build lasting friendships outside the academic rigors.
                                    </p>
                                </ScrollReveal>
                            </div>
                        </div>

                        {/* Activities Carousel */}
                        <ActivitiesCarousel />

                    </div>
                </section>

                {/* PLAN YOUR JOURNEY CTA SECTION */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="max-w-5xl mx-auto px-4">
                        <ScrollReveal direction="up">
                            <div className="relative bg-white border border-zinc-100 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_60px_rgb(0,0,0,0.05)] overflow-hidden">

                                {/* Decorative Background Blob */}
                                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#fff6ed] rounded-full blur-3xl opacity-60 pointer-events-none" />

                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-5xl font-bold text-[#00236F] mb-6">
                                        Plan Your Journey
                                    </h2>
                                    <p className="text-zinc-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                                        Download our full academic calendar and curriculum guide to see how we structure excellence throughout the year.
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                        {prospectus && (
                                            <a 
                                                href={prospectus.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto bg-[#00236F] hover:bg-[#00236F]/90 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                                            >
                                                <Download size={20} />
                                                <span>Download Prospectus</span>
                                            </a>
                                        )}

                                        {calendar && (
                                            <a 
                                                href={calendar.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto bg-[#f4f5f7] hover:bg-[#e9ecef] text-[#00236F] font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3"
                                            >
                                                <Calendar size={20} />
                                                <span>Academic Calendar</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </ScrollReveal>
                    </div>
                </section>

            </main>
            <SchoolFooter />
        </div>
    );
}