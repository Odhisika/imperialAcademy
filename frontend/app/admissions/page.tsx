import Image from "next/image";
import { ArrowRight, CheckCircle2, Download, FileText } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import AdmissionForm from "@/components/AdmissionForm";
import Link from "next/link";

export const metadata = {
    title: "Admissions | Imperial Academy",
    description: "Join our community. Apply for the upcoming academic session.",
};

export default async function AdmissionsPage() {
    let headerImage = "/images/library-student.png";
    let prospectus = null;
    let policy = null;

    try {
        const [headerRes, docRes, policyRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/headers/admissions`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/prospectus`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/admission-policy`, { cache: 'no-store' })
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

        if (policyRes.ok) {
            policy = await policyRes.json();
        }
    } catch (error) {
        console.error("Failed to fetch page data:", error);
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-hidden relative">
            {/* Top Navbar Gradient Background to make white text readable */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00236F]/80 to-transparent z-0 pointer-events-none opacity-90" />

            <SchoolNavbar />

            <main>
                {/* ADMISSIONS HERO SECTION */}
                <section className="relative pt-16 pb-20 lg:pt-16 lg:pb-32 px-4 max-w-7xl mx-auto flex items-center overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">

                        {/* Left Content */}
                        <ScrollReveal direction="left" className="w-full lg:w-1/2 flex flex-col items-start z-10 ">
                            <div>
                                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-5 mt-4">
                                    Join Our Community
                                </p>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#00236F] leading-[1.1] mb-6 tracking-tight">
                                    Start Your Child's<br />
                                    <span className="text-[#FEA619]">Legacy</span> Today.
                                </h1>
                                <p className="text-zinc-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium mb-10">
                                    We invite families who value academic excellence and holistic character development to apply for the upcoming academic session.
                                </p>

                                <div className="flex flex-wrap gap-4 mb-10">
                                    <a href="#application-form" className="inline-flex bg-[#00236F] hover:bg-[#00174f] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 items-center gap-3 w-fit">
                                        <span>Begin Application</span>
                                        <ArrowRight size={20} />
                                    </a>

                                    {prospectus && (
                                        <a 
                                            href={prospectus.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex border-2 border-[#00236F] text-[#00236F] hover:bg-[#00236F] hover:text-white font-bold px-8 py-4 rounded-xl transition-all items-center gap-3 w-fit"
                                        >
                                            <FileText size={20} />
                                            <span>Download Prospectus</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Right Image Content */}
                        <ScrollReveal direction="right" className="w-full lg:w-1/2 relative mt-14 lg:mt-10">
                            <div className="relative">
                                {/* Decorative gold blob behind the image */}
                                <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-[#FEA619] rounded-[2rem] -rotate-6 z-0" />

                                {/* Image Container */}
                                <div className="relative w-full aspect-square max-w-lg mx-auto lg:ml-auto rounded-[2rem] overflow-hidden shadow-2xl z-10 border border-zinc-100">
                                    <Image
                                        src={headerImage}
                                        alt="Students studying in library"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </section>

                {/* ADMISSION PROCESS SECTION */}
                <section className="py-24 bg-[#f8f9fc] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">

                        <div className="text-center mb-16">
                            <ScrollReveal direction="up">
                                <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3">
                                    The Journey
                                </p>
                                <h2 className="text-4xl md:text-5xl font-bold text-[#00236F]">
                                    Admission Process
                                </h2>
                            </ScrollReveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Step 1 */}
                            <ScrollReveal direction="up" delay={0}>
                                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all border border-zinc-100 flex flex-col h-full hover:-translate-y-2 duration-300">
                                    <div className="w-12 h-12 rounded-full bg-[#DCE1FF] flex items-center justify-center mb-6">
                                        <span className="text-[#00236F] font-bold text-xl">1</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00236F] mb-4">Apply Online</h3>
                                    <p className="text-zinc-600 text-sm leading-relaxed">
                                        Fill out our digital expression of interest form to receive our official prospectus and event invites.
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Step 2 */}
                            <ScrollReveal direction="up" delay={150}>
                                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all border border-zinc-100 flex flex-col h-full hover:-translate-y-2 duration-300">
                                    <div className="w-12 h-12 rounded-full bg-[#FFDDB8] flex items-center justify-center mb-6">
                                        <span className="text-[#855300] font-bold text-xl">2</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00236F] mb-4">Campus Visit</h3>
                                    <p className="text-zinc-600 text-sm leading-relaxed">
                                        Schedule a personalized tour or attend an Open Day to experience our vibrant learning environment.
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Step 3 */}
                            <ScrollReveal direction="up" delay={300}>
                                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all border border-zinc-100 flex flex-col h-full hover:-translate-y-2 duration-300">
                                    <div className="w-12 h-12 rounded-full bg-[#DCE1FF] flex items-center justify-center mb-6">
                                        <span className="text-[#00236F] font-bold text-xl">3</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00236F] mb-4">Assessment</h3>
                                    <p className="text-zinc-600 text-sm leading-relaxed">
                                        Students participate in an age-appropriate interaction or academic aptitude assessment.
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Step 4 */}
                            <ScrollReveal direction="up" delay={450}>
                                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all border border-zinc-100 flex flex-col h-full hover:-translate-y-2 duration-300">
                                    <div className="w-12 h-12 rounded-full bg-[#FFDDB8] flex items-center justify-center mb-6">
                                        <span className="text-[#855300] font-bold text-xl">4</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00236F] mb-4">Enrollment</h3>
                                    <p className="text-zinc-600 text-sm leading-relaxed">
                                        Upon offer, complete the registration by submitting documents and the admission fee.
                                    </p>
                                </div>
                            </ScrollReveal>

                        </div>
                    </div>
                </section>

                {/* PREPARATION & POLICY SECTION */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                            {/* Left: Document Checklist */}
                            <ScrollReveal direction="left" className="w-full lg:w-1/2">
                                <div className="bg-[#00174f] text-white rounded-[2rem] p-10 lg:p-12 shadow-xl h-full flex flex-col">
                                    <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
                                        Preparation
                                    </p>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-10">
                                        Document Checklist
                                    </h2>

                                    <ul className="space-y-6 mb-12 flex-grow">
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="text-[#FEA619] shrink-0 mt-0.5" size={24} />
                                            <span className="text-blue-100 text-lg leading-snug">Original Birth Certificate & Photocopy</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="text-[#FEA619] shrink-0 mt-0.5" size={24} />
                                            <span className="text-blue-100 text-lg leading-snug">Previous 2 years' Academic Progress Reports</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="text-[#FEA619] shrink-0 mt-0.5" size={24} />
                                            <span className="text-blue-100 text-lg leading-snug">4 Passport-sized Photographs of the student</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="text-[#FEA619] shrink-0 mt-0.5" size={24} />
                                            <span className="text-blue-100 text-lg leading-snug">Transfer Certificate from Previous school</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="text-[#FEA619] shrink-0 mt-0.5" size={24} />
                                            <span className="text-blue-100 text-lg leading-snug">Immunization Record & Health History</span>
                                        </li>
                                    </ul>

                                    <Link
                                        href="/admissions/policy"
                                        className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10 flex items-center justify-center gap-2"
                                    >
                                        <FileText size={20} />
                                        Read General Admission Policy
                                    </Link>
                                </div>
                            </ScrollReveal>

                            {/* Right: School Fee Policy */}
                            <ScrollReveal direction="right" className="w-full lg:w-1/2 flex flex-col pt-4">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#00236F] mb-6">
                                        School Fee Policy
                                    </h2>
                                    <hr className="border-zinc-200 mb-8" />

                                    <div className="flex-grow">
                                        <p className="text-zinc-600 text-lg leading-relaxed mb-6">
                                            Our fee structure is designed to be transparent and comprehensive, covering tuition, learning materials, and most extracurricular activities. We offer flexible payment plans (annually, termly, or monthly) to support our families.
                                        </p>
                                    </div>

                                    {/* Scholarship Box */}
                                    <div className="mt-8 bg-[#f4f5f7] rounded-2xl p-8 border border-zinc-100">
                                        <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                                            We offer merit-based scholarships up to 40% of the tuition fee for exceptional students in academics, sports, and performing arts.
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>

                        </div>
                    </div>
                </section>

                {/* ADMISSION FORM SECTION */}
                <section className="py-24 bg-[#f8f9fc]" id="application-form">
                    <div className="max-w-4xl mx-auto px-4">
                        <ScrollReveal direction="up">
                            <AdmissionForm />
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            <SchoolFooter />
        </div>
    );
}
