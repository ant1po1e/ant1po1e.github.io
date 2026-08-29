import React, { useCallback, useEffect, useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";
import { Link } from "react-router-dom";
import {
    checkSession,
    deleteImage,
    fetchImages,
    logout,
    type VaultImage,
} from "../lib/vaultApi";
import { LoginForm } from "../components/vault/LoginForm";
import { UploadZone } from "../components/vault/UploadZone";
import { FileListModal } from "../components/vault/FileListModal";
import { FileLightbox } from "../components/vault/FileLightbox";
import { MessagesSection } from "../components/vault/MessagesSection";
import { ArrowLeft, RefreshCw, LogOut, Images, Shield } from "lucide-react";

type AuthState = "checking" | "out" | "in";
type VaultTab = "files" | "messages";

export const VaultPage: React.FC = () => {
    const [authState, setAuthState] = useState<AuthState>("checking");
    const [activeTab, setActiveTab] = useState<VaultTab>("files");
    const [images, setImages] = useState<VaultImage[]>([]);
    const [listOpen, setListOpen] = useState(false);
    const [selected, setSelected] = useState<VaultImage | null>(null);
    const [error, setError] = useState("");
    const bodyRef = useRef<HTMLDivElement>(null);
    const [bodyHeight, setBodyHeight] = useState<number | null>(null);

    useEffect(() => {
        document.title = "Vault — Antipole";
    }, []);

    useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;
        const update = () => setBodyHeight(el.clientHeight);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [authState]);

    const loadImages = useCallback(async () => {
        try {
            const { images } = await fetchImages();
            setImages(images);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }, []);

    useEffect(() => {
        checkSession()
            .then(({ authenticated }) => {
                setAuthState(authenticated ? "in" : "out");
                if (authenticated) loadImages();
            })
            .catch(() => setAuthState("out"));
    }, [loadImages]);

    const handleLogout = async () => {
        await logout();
        setAuthState("out");
        setImages([]);
        setListOpen(false);
    };

    const handleUploaded = (blob: PutBlobResult) => {
        setImages((prev) => [
            {
                url: blob.url,
                name: blob.pathname.split("/").pop() || blob.pathname,
                pathname: blob.pathname,
                uploadedAt: new Date().toISOString(),
                size: 0,
            },
            ...prev,
        ]);
    };

    const handleDelete = async (image: VaultImage) => {
        try {
            await deleteImage(image.url);
            setImages((prev) => prev.filter((i) => i.url !== image.url));
            setSelected(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    return (
        <main
            id="vault-page-view"
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[#7B68EE]/10 via-[#1A153B]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container */}
            <div className="relative z-10 w-full max-w-xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <header className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                    <Link
                        to="/"
                        className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>HOME</span>
                    </Link>

                    <div className="flex items-center gap-1.5 text-[12px] font-mono tracking-widest text-white/30 uppercase">
                        <Shield className="w-3 h-3" />
                        <span>PRIVATE</span>
                    </div>
                </header>

                {/* Body */}
                <div
                    ref={bodyRef}
                    className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <h1 className="font-display uppercase tracking-[0.25em] text-white text-2xl sm:text-3xl">
                            Vault
                        </h1>
                        {authState === "in" && activeTab === "files" && (
                            <span className="font-mono text-white/40 text-xs">
                                {images.length}{" "}
                                {images.length === 1 ? "file" : "files"}
                            </span>
                        )}
                    </div>

                    <div className="mt-5 pt-5 border-t border-white/10">
                        {authState === "checking" && (
                            <div className="flex justify-center py-16">
                                <RefreshCw className="w-6 h-6 text-white/30 animate-spin" />
                            </div>
                        )}

                        {authState === "out" && (
                            <LoginForm
                                onSuccess={() => {
                                    setAuthState("in");
                                    loadImages();
                                }}
                            />
                        )}

                        {authState === "in" && (
                            <>
                                <div className="flex items-center justify-between mb-4 gap-3">
                                    <div className="flex items-center gap-1 border border-white/10 rounded p-1">
                                        <button
                                            onClick={() =>
                                                setActiveTab("files")
                                            }
                                            className={`font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded transition-colors duration-300 ${
                                                activeTab === "files"
                                                    ? "bg-white text-black font-semibold"
                                                    : "text-white/50 hover:text-white"
                                            }`}>
                                            Files
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab("messages")
                                            }
                                            className={`font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded transition-colors duration-300 ${
                                                activeTab === "messages"
                                                    ? "bg-white text-black font-semibold"
                                                    : "text-white/50 hover:text-white"
                                            }`}>
                                            Messages
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="font-mono text-[12px] uppercase tracking-wide text-white/40 hover:text-red-400 transition-colors duration-300 flex items-center gap-1 shrink-0">
                                        <LogOut className="w-3 h-3" /> Log out
                                    </button>
                                </div>

                                {activeTab === "files" ? (
                                    <>
                                        <UploadZone
                                            onUploaded={handleUploaded}
                                        />

                                        {error && (
                                            <p className="font-mono text-xs text-red-400 mb-4">
                                                {error}
                                            </p>
                                        )}

                                        <button
                                            onClick={() => setListOpen(true)}
                                            className="w-full flex items-center justify-center gap-2 bg-white/[0.02] hover:border-[#7B68EE]/40 hover:text-[#7B68EE] border border-white/10 rounded py-3 font-mono text-[12px] uppercase tracking-wide text-white transition-colors duration-300">
                                            <Images className="w-3.5 h-3.5" />
                                            View files ({images.length})
                                        </button>
                                    </>
                                ) : (
                                    <MessagesSection />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {listOpen && (
                <FileListModal
                    images={images}
                    onClose={() => setListOpen(false)}
                    onSelect={setSelected}
                    onDelete={handleDelete}
                    maxHeight={bodyHeight}
                />
            )}

            <FileLightbox
                image={selected}
                onClose={() => setSelected(null)}
                onDelete={handleDelete}
                maxHeight={bodyHeight}
            />
        </main>
    );
};
