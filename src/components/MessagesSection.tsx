"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMessages, type AnonMessage } from "@/lib/api";

// Column names we treat specially so cards read naturally regardless of how
// the connected spreadsheet's headers are capitalized/phrased.
const TIMESTAMP_KEYS = ["timestamp", "date", "waktu", "tanggal", "time"];
const MESSAGE_KEYS = ["message", "pesan", "isi", "content", "text"];

function normalizeList(
    data: AnonMessage[] | { messages?: AnonMessage[] },
): AnonMessage[] {
    if (Array.isArray(data)) return data;
    return data.messages ?? [];
}

function pickKey(row: AnonMessage, candidates: string[]) {
    const keys = Object.keys(row);
    for (const candidate of candidates) {
        const found = keys.find((k) => k.toLowerCase() === candidate);
        if (found) return found;
    }
    return null;
}

function formatTimestamp(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

interface MessageCardProps {
    row: AnonMessage;
}

function MessageCard({ row }: MessageCardProps) {
    const timestampKey = pickKey(row, TIMESTAMP_KEYS);
    const messageKey = pickKey(row, MESSAGE_KEYS);

    const mainKey = messageKey ?? Object.keys(row)[0] ?? null;
    const mainValue = mainKey ? row[mainKey] : "";

    const otherEntries = Object.entries(row).filter(
        ([key]) => key !== timestampKey && key !== mainKey,
    );

    return (
        <div className="border border-rule rounded-sm bg-paper p-4 flex flex-col gap-2 shadow-sm transition-colors duration-300 md:hover:border-accent">
            {mainValue && (
                <p className="font-sans text-sm text-ink/90 whitespace-pre-wrap break-words">
                    {mainValue}
                </p>
            )}

            {otherEntries.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    {otherEntries.map(([key, value]) => (
                        <span
                            key={key}
                            className="font-mono text-[11px] text-muted">
                            <span className="uppercase tracking-wide">
                                {key}
                            </span>
                            : <span className="text-ink/70">{value}</span>
                        </span>
                    ))}
                </div>
            )}

            {timestampKey && (
                <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted self-end">
                    {formatTimestamp(row[timestampKey])}
                </span>
            )}
        </div>
    );
}

export const MessagesSection = () => {
    const [rows, setRows] = useState<AnonMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchMessages();
            setRows(normalizeList(data));
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Newest first, assuming rows come out of the sheet in append order.
    const sorted = useMemo(() => [...rows].reverse(), [rows]);

    if (loading) {
        return (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-24 rounded-sm border border-rule bg-rule/20 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 space-y-3">
                <p className="font-mono text-xs text-red-600">{error}</p>
                <button
                    onClick={load}
                    className="font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-sm bg-ink text-paper md:hover:bg-accent transition-colors duration-300">
                    Retry
                </button>
            </div>
        );
    }

    if (sorted.length === 0) {
        return (
            <div className="text-center py-10 text-muted">
                <i className="bi bi-chat-square-text text-2xl" />
                <p className="mt-2 text-sm font-mono">No messages yet</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-end mb-3">
                <button
                    onClick={load}
                    title="Refresh"
                    className="font-mono text-xs uppercase tracking-wide text-muted md:hover:text-accent transition-colors duration-300 flex items-center gap-1">
                    <i className="bi bi-arrow-clockwise" /> Refresh
                </button>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-h-[50vh] overflow-y-auto pr-1">
                {sorted.map((row, idx) => (
                    <MessageCard key={idx} row={row} />
                ))}
            </div>
        </div>
    );
};
