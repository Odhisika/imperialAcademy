import { contactPageSchema, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SchoolNavbar from "@/components/SchoolNavbar";
import SchoolFooter from "@/components/SchoolFooter";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import MapWrapper from "@/components/MapWrapper";
import { getSiteSettings, telHref } from "@/lib/siteSettings";

export const metadata = pageMetadata({
    title: "Contact Us",
    description: "Contact Imperial Academy in New Tafo Akim, Ghana. Call 0201 188 847 or 0543 974 931, email us, or visit our campus for admissions enquiries.",
    path: "/contact",
    keywords: ["contact Imperial Academy", "Imperial Academy phone number", "school in New Tafo Akim", "Imperial Academy address"],
});

export default async function ContactPage() {
    const settings = await getSiteSettings();
    let headerImage = "/images/library-student.png";
    try {
        const headersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/headers/contact`, { next: { revalidate: 3600 } });
        if (headersRes.ok) {
            const data = await headersRes.json();
            if (Array.isArray(data) && data.length > 0) {
                headerImage = data[0].imageUrl;
            }
        }
    } catch (error) {
        console.error("Failed to fetch contact page data:", error);
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans overflow-hidden relative">
            <JsonLd data={contactPageSchema(settings)} />
            {/* Top Navbar Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#00236F]/80 to-transparent z-0 pointer-events-none opacity-90" />

            <SchoolNavbar />

            <main>
                {/* CONTACT HERO SECTION */}
                <section className="relative h-[60vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={headerImage}
                            alt="Imperial Academy campus"
                            fill
                            className="object-cover brightness-50"
                        />
                        {/* Navy blue overlay gradient matching the design (dark on left, fading to right) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00236F]/95 via-[#00236F]/70 to-transparent" />
                    </div>

                    <div className="relative z-10 px-8 md:px-12 lg:px-15 max-w-4xl mt-15">
                        <ScrollReveal>
                            <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-3.5">
                                GET IN TOUCH
                            </p>
                            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                                Contact Us
                            </h1>
                            <p className="text-blue-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                                We are here to answer your questions and help you begin your journey at Imperial Academy. Reach out to our dedicated team today.
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                {/* CONTACT INFO & FORM SECTION */}
                <section className="py-24 bg-zinc-50 relative">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-16">

                            {/* Left Column: Contact Info */}
                            <div className="w-full lg:w-1/3 flex flex-col gap-6">

                                {/* Mailing Address */}
                                <ScrollReveal>
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <MapPin className="text-[#00236F]" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#a47b38] mb-2">Mailing Address</p>
                                            <p className="text-zinc-600 leading-relaxed font-medium">
                                                {settings.addressLine1}
                                                {settings.digitalAddress && (
                                                    <>
                                                        <br />Digital Address: {settings.digitalAddress}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                    {/* Phone Support */}
                                    <ScrollReveal>
                                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex items-start gap-4 h-full">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                                <Phone className="text-[#00236F]" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-[#a47b38] mb-2">Phone Support</p>
                                                <p className="text-zinc-600 font-bold text-lg flex flex-wrap gap-x-2">
                                                    {[settings.phone1, settings.phone2].filter(Boolean).map((phone, index) => (
                                                        <span key={phone}>
                                                            {index > 0 && <span className="text-zinc-300">/</span>}{" "}
                                                            <a href={telHref(phone)} className="hover:text-[#00236F] transition-colors">{phone}</a>
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                    </ScrollReveal>

                                    {/* Email Inquiries */}
                                    <ScrollReveal>
                                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex items-start gap-4 h-full">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                                <Mail className="text-[#00236F]" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-[#a47b38] mb-2">Email Inquiries</p>
                                                <a href={`mailto:${settings.email}`} className="text-zinc-600 font-bold text-lg break-all hover:text-[#00236F] transition-colors">
                                                    {settings.email}
                                                </a>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                </div>

                                {/* Office Hours */}
                                <ScrollReveal>
                                    <div className="bg-[#00236F] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                        <Clock className="absolute -bottom-6 -right-6 text-white/5 opacity-10" size={160} />
                                        <h3 className="text-2xl font-bold mb-8 relative z-10">Office Hours</h3>
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex justify-between items-center gap-4 border-b border-white/10 pb-2">
                                                <span className="text-blue-100">Monday - Friday</span>
                                                <span className="font-bold">{settings.weekdayHours}</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-4 border-b border-white/10 pb-2">
                                                <span className="text-blue-100">Saturday</span>
                                                <span className="font-bold">{settings.saturdayHours}</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-4">
                                                <span className="text-blue-100">Sunday</span>
                                                <span className="font-bold text-[#FEA619]">{settings.sundayHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>

                            {/* Right Column: Form */}
                            <div className="w-full lg:w-2/3">
                                <ScrollReveal>
                                    <ContactForm />
                                </ScrollReveal>
                            </div>

                        </div>
                    </div>
                </section>

                {/* MAP SECTION */}
                <section className="relative h-[500px] w-full overflow-hidden border-t border-zinc-100">
                    <MapWrapper />

                    {/* Custom Map Overlay/Pin (Optional, since Leaflet has its own marker, but can be kept for styling if needed) */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#00236F] rounded-lg flex items-center justify-center">
                                <div className="w-5 h-5 bg-white rounded-sm rotate-45 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-[#00236F] rounded-full" />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-[#00236F] text-sm">Our Campus</p>
                                <p className="text-zinc-500 text-xs tracking-tight">Interactive Map View</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SchoolFooter />
        </div>
    );
}
