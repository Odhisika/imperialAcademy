"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "Admissions Inquiry",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg(null);
        
        try {
            const res = await fetch(`${API_BASE}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to send message');
            
            setStatus("success");
            setFormData({ name: "", email: "", subject: "Admissions Inquiry", message: "" });
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || 'Something went wrong.');
        }
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100 h-full">
            <h2 className="text-3xl font-bold text-[#00236F] mb-4">Send a Message</h2>
            <p className="text-zinc-500 mb-10">
                Fill out the form below and our admissions office will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder="John Doe"
                            className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-[#FEA619] transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder="john@example.com"
                            className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-[#FEA619] transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subject</label>
                    <select
                        id="subject"
                        className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-[#FEA619] transition-colors appearance-none cursor-pointer"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                        <option>Admissions Inquiry</option>
                        <option>General Information</option>
                        <option>Academic Programs</option>
                        <option>Athletics & Clubs</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</label>
                    <textarea
                        id="message"
                        required
                        rows={5}
                        placeholder="How can we help you?"
                        className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-[#FEA619] transition-colors resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-[#FEA619] hover:bg-[#e89512] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {status === "sending" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Send Message</span>
                            <Send size={18} />
                        </>
                    )}
                </button>

                {status === "success" && (
                    <p className="text-green-600 font-medium text-center mt-4">
                        Thank you! Your message has been sent successfully.
                    </p>
                )}

                {status === "error" && (
                    <p className="text-rose-600 font-medium text-center mt-4">
                        {errorMsg}
                    </p>
                )}
            </form>
        </div>
    );
}
