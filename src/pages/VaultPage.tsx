import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    checkSession,
    deleteImage,
    fetchImages,
    logout,
    type VaultImage,
    type VaultUploadResult,
} from "../lib/vaultApi";
import { LoginForm } from "../components/vault/LoginForm";
import { UploadZone } from "../components/vault/UploadZone";
import { FileListModal } from "../components/vault/FileListModal";
import { FileLightbox } from "../components/vault/FileLightbox";
import { MessagesSection } from "../components/vault/MessagesSection";
import { LinkShortener } from "../components/vault/LinkShortener";
import { BeatmapsManager } from "../components/vault/BeatmapsManager";
import { ArrowLeft, RefreshCw, LogOut, Images, Shield } from "lucide-react";

type AuthState = "checking" | "out" | "in";
type VaultTab = "files" | "messages" | "links" | "beatmaps";

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

    const handleUploaded = (blob: VaultUploadResult) => {
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
            await deleteImage(image.pathname);
            setImages((prev) => prev.filter((i) => i.url !== image.url));
            setSelected(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    return (
        <main
            id="vault-page-view"
            className="relative h-dvh w-full bg-transparent text-ink overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-ink selection:text-paper">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-rose/10 via-rose/15 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container */}
            <div className="relative z-10 w-full max-w-xl flex-1 min-h-0 bg-paper/85 border border-ink/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <header className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-ink/10 bg-wash/60">
                    <Link
                        to="/"
                        className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-ink/60 hover:text-ink transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>HOME</span>
                    </Link>

                    <div className="flex items-center gap-1.5 text-[12px] font-mono tracking-widest text-ink/45 uppercase">
                        <Shield className="w-3 h-3" />
                        <span>PRIVATE</span>
                    </div>
                </header>

                {/* Body */}
                <div
                    ref={bodyRef}
                    className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <h1 className="font-display uppercase tracking-[0.25em] text-ink text-2xl sm:text-3xl">
                            Vault
                        </h1>
                        {authState === "in" && activeTab === "files" && (
                            <span className="font-mono text-ink/55 text-xs">
                                {images.length}{" "}
                                {images.length === 1 ? "file" : "files"}
                            </span>
                        )}
                    </div>

                    <div className="mt-5 pt-5 border-t border-ink/10">
                        {authState === "checking" && (
                            <div className="flex justify-center py-16">
                                <RefreshCw className="w-6 h-6 text-ink/45 animate-spin" />
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
                                    <div className="flex items-center gap-1 border border-ink/10 rounded p-1">
                                        <button
                                            onClick={() =>
                                                setActiveTab("files")
                                            }
                                            className={`font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded transition-colors duration-300 ${
                                                activeTab === "files"
                                                    ? "bg-ink text-paper font-semibold"
                                                    : "text-ink/60 hover:text-ink"
                                            }`}>
                                            Files
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab("messages")
                                            }
                                            className={`font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded transition-colors duration-300 ${
                                                activeTab === "messages"
                                                    ? "bg-ink text-paper font-semibold"
                                                    : "text-ink/60 hover:text-ink"
                                            }`}>
                                            Messages
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab("links")
                                            }
                                            className={`font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded transition-colors duration-300 ${
                                                activeTab === "links"
                                                    ? "bg-ink text-paper font-semibold"
                                                    : "text-ink/60 hover:text-ink"
                                            }`}>
                                            Links
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab("beatmaps")
                                            }
                                            className={`font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded transition-colors duration-300 ${
                                                activeTab === "beatmaps"
                                                    ? "bg-ink text-paper font-semibold"
                                                    : "text-ink/60 hover:text-ink"
                                            }`}>
                                            Beatmaps
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="font-mono text-[12px] uppercase tracking-wide text-ink/55 hover:text-red-400 transition-colors duration-300 flex items-center gap-1 shrink-0">
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
                                            className="w-full flex items-center justify-center gap-2 bg-ink/[0.02] hover:border-rose/40 hover:text-rose-deep border border-ink/10 rounded py-3 font-mono text-[12px] uppercase tracking-wide text-ink transition-colors duration-300">
                                            <Images className="w-3.5 h-3.5" />
                                            View files ({images.length})
                                        </button>
                                    </>
                                ) : activeTab === "messages" ? (
                                    <MessagesSection />
                                ) : activeTab === "links" ? (
                                    <LinkShortener />
                                ) : (
                                    <BeatmapsManager />
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
