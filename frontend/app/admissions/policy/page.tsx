import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import SchoolNavbar from '@/components/SchoolNavbar';
import SchoolFooter from '@/components/SchoolFooter';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
    title: "Admission Policy",
    description: "Read our comprehensive admission policy, criteria, and guidelines for the upcoming academic session at Imperial Academy.",
};

export default async function AdmissionPolicyPage() {
    let policy = null;
    let headerImage = "/images/library-student.png";

    try {
        const [policyRes, headerRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/admission-policy`, { next: { revalidate: 3600 } }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/headers/admissions`, { next: { revalidate: 3600 } })
        ]);

        if (policyRes.ok) {
            policy = await policyRes.json();
        }
        if (headerRes.ok) {
            const data = await headerRes.json();
            if (Array.isArray(data) && data.length > 0) {
                headerImage = data[0].imageUrl;
            }
        }
    } catch (error) {
        console.error("Failed to fetch policy data:", error);
    }

    return (
        <main className="min-h-screen bg-white">
            <SchoolNavbar />

            {/* Header */}
            <div className="relative h-[40vh] min-h-[300px] w-full bg-[#00236F] flex items-center justify-center overflow-hidden">
                <Image
                    src={headerImage}
                    alt="Admission Policy"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00236F] to-transparent"></div>
                <div className="relative z-10 text-center px-4">
                    <ScrollReveal>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                            Admission Policy
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            Guidelines and criteria for joining the Imperial Academy community.
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link 
                        href="/admissions" 
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#00236F] transition-colors mb-12 font-bold group"
                    >
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back to Admissions
                    </Link>

                    <ScrollReveal>
                        <div className="space-y-12 text-zinc-600 leading-relaxed text-lg">
                            
                            {/* Intro */}
                            <div className="bg-blue-50 border-l-4 border-[#00236F] p-8 rounded-r-3xl">
                                <h3 className="text-[#00236F] font-bold text-xl mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5" /> Introduction
                                </h3>
                                <p>
                                    Imperial Academy is committed to an open and transparent admission process. We seek students who are eager to learn and families who support our vision of holistic excellence. Admission is granted based on academic potential, character, and the availability of space in the respective grade level.
                                </p>
                            </div>

                            {/* Eligibility */}
                            <div>
                                <h2 className="text-3xl font-black text-[#00236F] mb-6">1. Eligibility Criteria</h2>
                                <p className="mb-6">
                                    To be eligible for admission, candidates must meet the age requirements for their respective levels as of September 1st of the entry year:
                                </p>
                                <ul className="grid md:grid-cols-2 gap-4">
                                    <li className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                        <CheckCircle2 className="text-[#FEA619] shrink-0" />
                                        <span><strong>Nursery:</strong> 3 - 5 years</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                        <CheckCircle2 className="text-[#FEA619] shrink-0" />
                                        <span><strong>Primary:</strong> 6 - 11 years</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                        <CheckCircle2 className="text-[#FEA619] shrink-0" />
                                        <span><strong>Junior High:</strong> 12 - 15 years</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Process */}
                            <div>
                                <h2 className="text-3xl font-black text-[#00236F] mb-6">2. The Admission Process</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#00236F] text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                                        <p><strong>Online Application:</strong> Complete the formal application form via our portal.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#00236F] text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                                        <p><strong>Entrance Assessment:</strong> Shortlisted candidates will be invited for a placement test in English and Mathematics.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#00236F] text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                                        <p><strong>Parent Interview:</strong> A meeting with the Admissions Committee to align expectations.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#00236F] text-white flex items-center justify-center font-bold shrink-0 mt-1">4</div>
                                        <p><strong>Final Decision:</strong> Successful candidates will receive an official approval email within 7 working days.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Required Documents */}
                            <div>
                                <h2 className="text-3xl font-black text-[#00236F] mb-6">3. Important Guidelines</h2>
                                <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 space-y-4">
                                    <p className="flex items-start gap-3">
                                        <AlertCircle className="text-rose-500 shrink-0 mt-1" />
                                        <span>Admission is not guaranteed until all fees are paid and original documents are verified.</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <AlertCircle className="text-rose-500 shrink-0 mt-1" />
                                        <span>The school reserves the right to refuse admission without providing a specific reason.</span>
                                    </p>
                                </div>
                            </div>

                            {/* Download Section */}
                            {policy && (
                                <div className="mt-16 p-10 bg-[#00236F] rounded-[3rem] text-center text-white shadow-2xl">
                                    <FileText className="w-16 h-16 text-[#FEA619] mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Official Policy Document</h3>
                                    <p className="text-blue-100 mb-8 max-w-md mx-auto">
                                        You can download the full signed version of our Admission Policy for your records.
                                    </p>
                                    <a 
                                        href={policy.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex bg-[#FEA619] hover:bg-[#fdb745] text-[#00236F] font-bold px-10 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-1"
                                    >
                                        Download PDF Version
                                    </a>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <SchoolFooter />
        </main>
    );
}
