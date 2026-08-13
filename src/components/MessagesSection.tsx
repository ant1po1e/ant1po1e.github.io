"use client";

import { useEffect, useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { fetchMessages, type AnonMessage } from "@/lib/api";

// Export canvas: fixed width, height grows with message length, card
// centered with generous padding on a branded background — a shareable
// image rather than a bare screenshot of the on-page card.
const EXPORT_WIDTH = 1080;
const EXPORT_SCALE = 1.7;

function formatDate(iso: string | null) {
    if (!iso) return "Unknown date";
    try {
        return new Date(iso).toLocaleString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

interface CardFaceProps {
    message: AnonMessage;
    scale?: number;
}

// Single source of truth for the card's look — reused as-is on the page and
// scaled up for the exported JPG, so the two visuals never drift apart.
function CardFace({ message, scale = 1 }: CardFaceProps) {
    const px = (n: number) => `${n * scale}px`;

    return (
        <div
            className="relative rounded-2xl border border-rule bg-paper shadow-sm overflow-hidden"
            style={{ padding: px(24) }}>
            <i
                className="bi bi-chat-quote-fill absolute text-rule/50"
                style={{ top: px(20), right: px(20), fontSize: px(26) }}
                aria-hidden="true"
            />

            <div
                className="flex items-center gap-2"
                style={{ marginBottom: px(14), paddingRight: px(44) }}>
                <span
                    className="font-display italic text-ink truncate"
                    style={{ fontSize: px(19) }}>
                    {message.name}
                </span>
                {message.isAnonymous && (
                    <span
                        className="font-mono uppercase tracking-wide rounded-full border border-rule text-muted shrink-0"
                        style={{
                            fontSize: px(10),
                            padding: `${2 * scale}px ${8 * scale}px`,
                        }}>
                        Anonymous
                    </span>
                )}
            </div>

            <p
                className="font-sans text-ink/85 whitespace-pre-wrap break-words"
                style={{ fontSize: px(15), lineHeight: 1.6 }}>
                {message.message || (
                    <span className="text-muted italic">
                        (no message content)
                    </span>
                )}
            </p>

            <div
                className="border-t border-rule flex items-center gap-1.5 text-muted"
                style={{ marginTop: px(18), paddingTop: px(12) }}>
                <i
                    className="bi bi-clock"
                    style={{ fontSize: px(11) }}
                    aria-hidden="true"
                />
                <span className="font-mono" style={{ fontSize: px(11) }}>
                    {formatDate(message.timestamp)}
                </span>
            </div>
        </div>
    );
}

function MessageCard({ message }: { message: AnonMessage }) {
    const exportRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    async function downloadCard() {
        if (!exportRef.current || downloading) return;
        setDownloading(true);
        try {
            const dataUrl = await toJpeg(exportRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                quality: 0.95,
            });
            const link = document.createElement("a");
            link.download = `message-${message.id}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to export card", err);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="relative">
            <CardFace message={message} />

            <button
                onClick={downloadCard}
                disabled={downloading}
                title="Download as JPG"
                className={`absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-paper/90 backdrop-blur-sm border border-rule transition-colors duration-300 md:hover:text-accent md:hover:border-accent disabled:opacity-50 ${
                    downloading ? "text-accent" : "text-muted"
                }`}>
                <i
                    className={`bi text-sm ${downloading ? "bi-arrow-repeat animate-spin" : "bi-download"}`}
                />
            </button>

            {/* Off-screen export composition: gradient background with the
                card centered inside, captured instead of the bare card above. */}
            <div
                aria-hidden="true"
                style={{ position: "fixed", left: "-99999px", top: 0 }}>
                <div
                    ref={exportRef}
                    style={{
                        width: `${EXPORT_WIDTH}px`,
                        padding: "90px 80px",
                        boxSizing: "border-box",
                        background:
                            "radial-gradient(circle at 15% 15%, rgba(42,59,99,0.55), transparent 55%), radial-gradient(circle at 85% 90%, rgba(139,133,119,0.35), transparent 55%), linear-gradient(150deg, #1b1b1f, #2a3b63 65%, #1b1b1f)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "36px",
                    }}>
                    <p
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "15px",
                            letterSpacing: "4px",
                            textTransform: "uppercase",
                            color: "rgba(247,244,236,0.55)",
                            margin: 0,
                        }}>
                        Ask me something!
                    </p>

                    <div style={{ width: "100%" }}>
                        <CardFace message={message} scale={EXPORT_SCALE} />
                    </div>

                    <p
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "13px",
                            letterSpacing: "2px",
                            color: "rgba(247,244,236,0.4)",
                            margin: 0,
                        }}>
                        antipole.my.id/str
                    </p>
                </div>
            </div>
        </div>
    );
}

export function MessagesSection() {
    const [messages, setMessages] = useState<AnonMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    async function load() {
        setLoading(true);
        setError("");
        try {
            const { messages } = await fetchMessages();
            setMessages(messages);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = messages.filter((m) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q)
        );
    });

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="flex-1 bg-paper border border-rule text-ink text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-muted transition-colors duration-300"
                />
                <button
                    onClick={load}
                    title="Refresh"
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm border border-rule text-muted md:hover:text-accent md:hover:border-accent transition-colors duration-300">
                    <i
                        className={`bi bi-arrow-clockwise ${loading ? "animate-spin" : ""}`}
                    />
                </button>
            </div>

            {error && (
                <p className="font-mono text-xs text-red-600 mb-4">{error}</p>
            )}

            {loading ? (
                <div className="flex justify-center py-16">
                    <i className="bi bi-arrow-repeat animate-spin text-2xl text-muted" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted">
                    <i className="bi bi-chat-square-text text-3xl" />
                    <p className="mt-2 text-sm font-mono">
                        {messages.length === 0
                            ? "No messages yet"
                            : "No messages match your search"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1 border-t border-rule pt-3">
                    {filtered.map((message) => (
                        <MessageCard key={message.id} message={message} />
                    ))}
                </div>
            )}
        </div>
    );
}
