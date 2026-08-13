"use client";

import { useEffect, useState } from "react";
import { fetchMessages, type ContactMessage } from "@/lib/api";

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

function MessageCard({ message }: { message: ContactMessage }) {
    const [copied, setCopied] = useState(false);

    async function copyMessage() {
        try {
            await navigator.clipboard.writeText(message.message);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    }

    return (
        <div className="border border-rule rounded-sm bg-paper p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-medium text-ink truncate flex items-center gap-2">
                        {message.name}
                        {message.isAnonymous && (
                            <span className="font-mono text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm border border-rule text-muted">
                                Anonymous
                            </span>
                        )}
                    </p>
                    {!message.isAnonymous && message.email && (
                        <p className="font-mono text-xs text-muted truncate">
                            {message.email}
                        </p>
                    )}
                </div>
                <button
                    onClick={copyMessage}
                    title="Copy message"
                    className={`shrink-0 transition-colors duration-300 md:hover:text-accent ${
                        copied ? "text-accent" : "text-muted"
                    }`}>
                    <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"}`} />
                </button>
            </div>

            <p className="text-sm text-ink/80 whitespace-pre-wrap break-words">
                {message.message || (
                    <span className="text-muted italic">
                        (no message content)
                    </span>
                )}
            </p>

            <p className="font-mono text-[11px] text-muted mt-auto">
                {formatDate(message.timestamp)}
            </p>
        </div>
    );
}

export function MessagesPanel() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {filtered.map((message) => (
                        <MessageCard key={message.id} message={message} />
                    ))}
                </div>
            )}
        </div>
    );
}
