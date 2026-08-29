import React, { useEffect, useState } from "react";
import { toShareUrl, type VaultImage } from "../../lib/vaultApi";
import { fileKind, fileIconComponent } from "../../lib/vaultFileKind";
import { Download, Trash2, X, FileAudio } from "lucide-react";

function buildSnippets(image: VaultImage) {
    const url = toShareUrl(image.pathname);
    return {
        Link: url,
        HTML: `<img src="${url}" alt="${image.name}" />`,
        Markdown: `![${image.name}](${url})`,
        BBCode: `[img]${url}[/img]`,
    };
}

const CopyRow: React.FC<{ label: string; value: string }> = ({
    label,
    value,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 font-mono text-[9px] tracking-widest text-white/40 uppercase">
                {label}
            </span>
            <code className="flex-1 truncate bg-black/60 border border-white/10 rounded px-2 py-1.5 text-[12px] text-white/70 font-mono">
                {value}
            </code>
            <button
                onClick={handleCopy}
                className={`shrink-0 font-mono text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1.5 rounded border transition-colors duration-300 ${
                    copied
                        ? "border-[#7B68EE] text-[#7B68EE]"
                        : "border-white/10 text-white/40 hover:text-white hover:border-white/30"
                }`}>
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
};

interface FileLightboxProps {
    image: VaultImage | null;
    onClose: () => void;
    onDelete: (image: VaultImage) => void;
    maxHeight: number | null;
}

export const FileLightbox: React.FC<FileLightboxProps> = ({
    image,
    onClose,
    onDelete,
    maxHeight,
}) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    if (!image) return null;

    const snippets = buildSnippets(image);
    const kind = fileKind(image.name);
    const Icon = fileIconComponent(image.name);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={onClose}>
            <div
                className="max-w-3xl w-full bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl flex flex-col items-center py-6 px-6 overflow-y-auto custom-scrollbar"
                style={{ maxHeight: maxHeight ? `${maxHeight}px` : "80vh" }}
                onClick={(e) => e.stopPropagation()}>
                {kind === "image" && (
                    <img
                        src={image.url}
                        alt={image.name}
                        referrerPolicy="no-referrer"
                        className="max-h-[50vh] w-auto object-contain rounded border border-white/10"
                    />
                )}
                {kind === "video" && (
                    <video
                        src={image.url}
                        controls
                        className="max-h-[50vh] w-auto rounded border border-white/10"
                    />
                )}
                {kind === "audio" && (
                    <div className="w-full flex flex-col items-center gap-3 py-6">
                        <FileAudio className="w-12 h-12 text-white/30" />
                        <audio src={image.url} controls className="w-full" />
                    </div>
                )}
                {kind === "other" && (
                    <div className="w-full flex flex-col items-center gap-2 py-10">
                        <Icon className="w-12 h-12 text-white/30" />
                        <p className="font-mono text-xs text-white/40">
                            No preview available for this file type
                        </p>
                    </div>
                )}

                <div className="w-full flex items-center justify-between mt-4 text-xs font-mono text-white/40">
                    <span className="truncate">{image.name}</span>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                        <a
                            href={image.url}
                            download={image.name}
                            className="hover:text-[#7B68EE] transition-colors duration-300 flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" /> Download
                        </a>
                        <button
                            onClick={() => onDelete(image)}
                            className="hover:text-red-400 transition-colors duration-300 flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="hover:text-white transition-colors duration-300 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Close
                        </button>
                    </div>
                </div>

                <div className="w-full mt-5 bg-white/[0.02] border border-white/10 rounded p-4 space-y-2.5">
                    <p className="font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">
                        Link &amp; embed
                    </p>
                    {Object.entries(snippets).map(([label, value]) => (
                        <CopyRow key={label} label={label} value={value} />
                    ))}
                </div>
            </div>
        </div>
    );
};
