"use client"

import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api"

export default function ContactPage() {
    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "MAISON";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        orderNumber: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Translate camelCase to snake_case for the Python backend
            const payload = {
                name: formData.name,
                email: formData.email,
                order_number: formData.orderNumber, // <-- This is the fix!
                message: formData.message
            };

            // Send the translated payload
            await api.post("/api/v1/contact/", payload);

            toast.success("Message Sent", {
                description: "A client advisor will contact you shortly."
            });
            setFormData({ name: "", email: "", orderNumber: "", message: "" });
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Error", {
                description: "Failed to send message. Please try again later."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

                {/* Left Side: Information */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-light tracking-[0.1em] uppercase mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-sm text-neutral-600 leading-relaxed font-light max-w-md">
                            {companyName} client advisors are available to assist you with styling advice, sizing inquiries, and order support.
                        </p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-neutral-200">
                        <div>
                            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-900 mb-2">Hours of Operation</h3>
                            <p className="text-sm text-neutral-500 font-light">Monday - Friday: 9AM - 8PM EST</p>
                            <p className="text-sm text-neutral-500 font-light">Saturday - Sunday: 10AM - 6PM EST</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-900 mb-2">Email</h3>
                            <p className="text-sm text-neutral-500 font-light">clientservices@{companyName.toLowerCase().replace(/\s+/g, '')}.com</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="NAME *"
                                    className="w-full bg-transparent border-b border-black py-3 text-sm placeholder:text-neutral-400 placeholder:tracking-[0.1em] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="EMAIL *"
                                    className="w-full bg-transparent border-b border-black py-3 text-sm placeholder:text-neutral-400 placeholder:tracking-[0.1em] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="orderNumber" className="sr-only">Order Number</label>
                                <input
                                    type="text"
                                    id="orderNumber"
                                    name="orderNumber"
                                    value={formData.orderNumber}
                                    onChange={handleChange}
                                    placeholder="ORDER NUMBER (OPTIONAL)"
                                    className="w-full bg-transparent border-b border-black py-3 text-sm placeholder:text-neutral-400 placeholder:tracking-[0.1em] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="YOUR MESSAGE *"
                                    className="w-full bg-transparent border-b border-black py-3 text-sm placeholder:text-neutral-400 placeholder:tracking-[0.1em] focus:outline-none resize-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Sending..." : "Submit"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}