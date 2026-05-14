"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, GraduationCap, Send, School, Loader2, Users } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export default function AdmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        childName: '',
        childDob: '',
        gender: '',
        gradeLevel: '',
        previousSchool: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/api/admissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to submit application');
            
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white rounded-[2rem] p-12 shadow-2xl text-center border border-zinc-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="text-green-600" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-[#00236F] mb-4">Application Received!</h3>
                <p className="text-zinc-600 text-lg mb-8">
                    Thank you for applying to Imperial Academy. Our admissions team will review your application and contact you shortly.
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#00236F] hover:bg-[#00174f] text-white font-bold px-8 py-3 rounded-xl transition-all"
                >
                    Submit Another Application
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-zinc-100">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#00236F] mb-3">Begin Your Application</h2>
                <p className="text-zinc-600">Please fill out the form below to start the enrollment process.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Parent/Guardian Info */}
                <div>
                    <h3 className="text-xl font-semibold text-zinc-800 border-b border-zinc-200 pb-2 mb-6">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    required 
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="John Doe" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    required 
                                    name="parentEmail"
                                    value={formData.parentEmail}
                                    onChange={handleChange}
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    required 
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    type="tel" 
                                    placeholder="+1 (555) 000-0000" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-sm font-medium text-zinc-700">Home Address</label>
                            <div className="relative">
                                <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    required 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="123 Street, City" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Info */}
                <div>
                    <h3 className="text-xl font-semibold text-zinc-800 border-b border-zinc-200 pb-2 mb-6">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Student Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    required 
                                    name="childName"
                                    value={formData.childName}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="Jane Doe" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    required 
                                    name="childDob"
                                    value={formData.childDob}
                                    onChange={handleChange}
                                    type="date" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all text-zinc-700" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Gender</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <select 
                                    required 
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all text-zinc-700 appearance-none bg-white"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Grade Applying For</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <select 
                                    required 
                                    name="gradeLevel"
                                    value={formData.gradeLevel}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all text-zinc-700 appearance-none bg-white"
                                >
                                    <option value="">Select a grade</option>
                                    <option value="Nursery">Nursery (Ages 3-5)</option>
                                    <option value="Primary">Primary (Ages 6-11)</option>
                                    <option value="Junior High">Junior High (Ages 12-15)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Previous School</label>
                            <div className="relative">
                                <School className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input 
                                    name="previousSchool"
                                    value={formData.previousSchool}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="Previous School Name (if any)" 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#FEA619] focus:ring-2 focus:ring-[#FEA619]/20 outline-none transition-all" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#00236F] hover:bg-[#00174f] disabled:bg-[#00236F]/70 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Submit Application <Send size={18} />
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
