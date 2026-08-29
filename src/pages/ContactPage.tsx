import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { PROFILE_DATA } from "../data/profileData";
import {
    Send,
    CheckCircle2,
    Github,
    Twitter,
    ArrowLeft,
    ArrowRight,
    Radio,
    Gamepad2,
    Youtube,
    Lock,
    AlertTriangle,
} from "lucide-react";

// Vite only exposes env vars prefixed with VITE_ to client-side code.
// Configure this in .env (copy from .env.example) with your Google Apps
// Script Web App URL — fetched here directly from the browser instead of
// through a server API route (this project is a static Vite SPA).
const CONTACT_SCRIPT_URL = import.meta.env.VITE_CONTACT_FORM_SCRIPT;
const ANON_EMAIL = "anonymous@antipole.my.id";

export const ContactPage: React.FC = () => {
    const previousEmailRef = useRef("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Contact & Community — Antipole";
    }, []);

    const toggleAnonymous = (checked: boolean) => {
        setIsAnonymous(checked);
        if (checked) {
            // remember what the user typed so we can restore it if they untick
            previousEmailRef.current = formData.email;
            setFormData((prev) => ({ ...prev, email: ANON_EMAIL }));
        } else {
            setFormData((prev) => ({
                ...prev,
                email: previousEmailRef.current,
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            message: "",
        });
        setIsAnonymous(false);
        previousEmailRef.current = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        if (!CONTACT_SCRIPT_URL) {
            setSubmitError(
                "Contact form isn't configured yet. Set VITE_CONTACT_FORM_SCRIPT in .env and restart the dev server.",
            );
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const urlEncoded = new URLSearchParams();
            urlEncoded.append("name", formData.name);
            urlEncoded.append("email", formData.email);
            urlEncoded.append("message", formData.message);
            urlEncoded.append("anonymous", String(isAnonymous));

            const response = await fetch(CONTACT_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlEncoded.toString(),
            });

            if (!response.ok) throw new Error("Google Script Error");

            setIsSubmitted(true);
            resetForm();
            setTimeout(() => setIsSubmitted(false), 3500);
        } catch (err) {
            console.error("Contact form error:", err);
            setSubmitError("Something went wrong! Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main
            id="contact-page-view"
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-[#E0A96D]/10 via-[#382312]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=contact"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-white/20 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-white/40 uppercase hidden sm:inline">
                            CONTACT
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] font-mono text-white/50">
                        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 font-semibold">
                            ONLINE
                        </span>
                    </div>
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8 space-y-6">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-2">
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-white mb-2">
                            CONTACT
                        </h1>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {/* Left Column: Direct Info & Social Channels */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="p-5 rounded-md border border-white/10 bg-white/2 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E0A96D] uppercase mb-3">
                                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                                    <span>AVAILABILITY STATUS</span>
                                </div>
                                <p className="text-xs text-white/70 font-light leading-relaxed mb-3">
                                    Open for website and mapping commisions.
                                </p>
                                <div className="text-[11px] font-mono text-white/40 space-y-1 pt-2.5 border-t border-white/10">
                                    <div>RESPONSE: ~24 Hours</div>
                                </div>
                            </div>

                            {/* Social Links Box */}
                            <div className="p-5 rounded-md border border-white/10 bg-white/2 space-y-2.5">
                                <span className="text-[12px] font-mono tracking-widest text-white/40 uppercase block mb-1">
                                    Socials
                                </span>
                                <div className="space-y-2">
                                    <a
                                        href={PROFILE_DATA.socials.itchio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-xs font-mono text-white/80 hover:text-white group p-2 rounded bg-black/40 border border-white/5 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <Gamepad2 className="w-3.5 h-3.5 text-[#E0A96D]" />
                                            <span>itch.io</span>
                                        </span>
                                        <span className="text-white/30 group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </a>

                                    <a
                                        href={PROFILE_DATA.socials.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-xs font-mono text-white/80 hover:text-white group p-2 rounded bg-black/40 border border-white/5 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <Youtube className="w-3.5 h-3.5 text-red-400" />
                                            <span>YouTube</span>
                                        </span>
                                        <span className="text-white/30 group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </a>

                                    <a
                                        href={PROFILE_DATA.socials.osu}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-xs font-mono text-white/80 hover:text-white group p-2 rounded bg-black/40 border border-white/5 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <span className="w-3.5 h-3.5 rounded-full bg-pink-500/80 flex items-center justify-center text-[8px] font-bold text-white">
                                                o
                                            </span>
                                            <span>osu! Profile</span>
                                        </span>
                                        <span className="text-white/30 group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </a>

                                    <a
                                        href={PROFILE_DATA.socials.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-xs font-mono text-white/80 hover:text-white group p-2 rounded bg-black/40 border border-white/5 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <Github className="w-3.5 h-3.5" />
                                            <span>GitHub</span>
                                        </span>
                                        <span className="text-white/30 group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </a>

                                    <a
                                        href={PROFILE_DATA.socials.x}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-xs font-mono text-white/80 hover:text-white group p-2 rounded bg-black/40 border border-white/5 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <Twitter className="w-3.5 h-3.5" />
                                            <span>@apolantipole</span>
                                        </span>
                                        <span className="text-white/30 group-hover:translate-x-0.5 transition-transform">
                                            →
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Transmission Form */}
                        <div className="md:col-span-2">
                            <form
                                onSubmit={handleSubmit}
                                className="relative p-6 sm:p-7 rounded-md border border-white/15 bg-white/2 backdrop-blur-md text-left">
                                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                                    <span className="text-xs font-mono tracking-widest uppercase text-[#E0A96D]">
                                        Contact Form
                                    </span>
                                </div>

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-14 flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                                            <CheckCircle2 className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-display text-white uppercase tracking-wider mb-1">
                                            Message Sent!
                                        </h3>
                                        <p className="text-xs font-mono text-white/60 max-w-sm">
                                            Thank you. Your message has been
                                            logged into Antipole's queue.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[12px] font-mono tracking-widest text-white/50 uppercase mb-1.5">
                                                NAME
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Your callsign or name..."
                                                className="w-full px-3.5 py-2 rounded bg-black/60 border border-white/15 focus:border-[#E0A96D] focus:outline-none text-xs font-mono text-white placeholder:text-white/20 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[12px] font-mono tracking-widest text-white/50 uppercase mb-1.5">
                                                EMAIL
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    required
                                                    readOnly={isAnonymous}
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="contact@yourdomain.com"
                                                    aria-readonly={isAnonymous}
                                                    className={`w-full px-3.5 py-2 rounded bg-black/60 border border-white/15 focus:border-[#E0A96D] focus:outline-none text-xs font-mono text-white placeholder:text-white/20 transition-colors ${
                                                        isAnonymous
                                                            ? "text-white/40 cursor-not-allowed pr-9"
                                                            : ""
                                                    }`}
                                                />
                                                {isAnonymous && (
                                                    <Lock className="w-3.5 h-3.5 text-white/30 absolute right-3 top-1/2 -translate-y-1/2" />
                                                )}
                                            </div>

                                            <label
                                                htmlFor="anonymous-toggle"
                                                className="mt-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide text-white/40 hover:text-white/60 cursor-pointer w-fit transition-colors">
                                                <input
                                                    id="anonymous-toggle"
                                                    type="checkbox"
                                                    checked={isAnonymous}
                                                    onChange={(e) =>
                                                        toggleAnonymous(
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="w-3.5 h-3.5 accent-[#E0A96D]"
                                                />
                                                Send anonymously
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-[12px] font-mono tracking-widest text-white/50 uppercase mb-1.5">
                                                Messages
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        message: e.target.value,
                                                    })
                                                }
                                                placeholder="Detail your inquiry, project scope, tournament schedule, or message..."
                                                className="w-full px-3.5 py-2 rounded bg-black/60 border border-white/15 focus:border-[#E0A96D] focus:outline-none text-xs font-mono text-white placeholder:text-white/20 resize-none transition-colors"
                                            />
                                        </div>

                                        {submitError && (
                                            <div className="flex items-start gap-2 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono leading-relaxed">
                                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                <span>{submitError}</span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-2.5 rounded-md bg-white hover:bg-white/90 text-black text-xs font-mono tracking-[0.2em] font-semibold uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-lg disabled:opacity-50">
                                            {isSubmitting ? (
                                                <span>
                                                    TRANSMITTING PACKETS...
                                                </span>
                                            ) : (
                                                <>
                                                    <span>
                                                        TRANSMIT MESSAGE
                                                    </span>
                                                    <Send className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/40 text-[12px] sm:text-[11px] font-mono text-white/40">
                    <div className="flex items-center gap-3">
                        <span>DIRECT CONTACT</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/about"
                            className="flex items-center gap-1.5 text-white hover:text-[#E0A96D] font-medium transition-colors">
                            <span>ABOUT</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
