import React, { useState } from "react";
import { toShareUrl, type VaultImage } from "../../lib/vaultApi";
import { fileKind, fileIconComponent } from "../../lib/vaultFileKind";
import { X, Clipboard, Check, Trash2, Images } from "lucide-react";

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

interface TableRowProps {
    image: VaultImage;
    onSelect: (image: VaultImage) => void;
    onDelete: (image: VaultImage) => void;
}

const TableRow: React.FC<TableRowProps> = ({ image, onSelect, onDelete }) => {
    const [copied, setCopied] = useState(false);
    const Icon = fileIconComponent(image.name);

    const copyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(toShareUrl(image.pathname));
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    };

    return (
        <tr
            onClick={() => onSelect(image)}
            className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer">
            <td className="px-2 py-2 w-14">
                {fileKind(image.name) === "image" ? (
                    <img
                        src={image.url}
                        alt={image.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded border border-white/10"
                    />
                ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded border border-white/10 bg-white/5 text-white/40">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
            </td>
            <td className="px-3 py-2 text-white/80 text-xs truncate max-w-[160px] sm:max-w-[260px]">
                {image.name}
            </td>
            <td className="px-3 py-2 text-white/40 text-[12px] font-mono whitespace-nowrap hidden sm:table-cell">
                {formatDate(image.uploadedAt)}
            </td>
            <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-3 text-white/40">
                    <button
                        onClick={copyLink}
                        title="Copy link"
                        className={`transition-colors duration-300 hover:text-[#7B68EE] ${copied ? "text-[#7B68EE]" : ""}`}>
                        {copied ? (
                            <Check className="w-3.5 h-3.5" />
                        ) : (
                            <Clipboard className="w-3.5 h-3.5" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(image);
                        }}
                        title="Delete"
                        className="hover:text-red-400 transition-colors duration-300">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

interface FileListModalProps {
    images: VaultImage[];
    onClose: () => void;
    onSelect: (image: VaultImage) => void;
    onDelete: (image: VaultImage) => void;
    maxHeight: number | null;
}

export const FileListModal: React.FC<FileListModalProps> = ({
    images,
    onClose,
    onSelect,
    onDelete,
    maxHeight,
}) => {
    return (
        <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: maxHeight ? `${maxHeight}px` : "80vh" }}
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                    <h2 className="font-display uppercase tracking-wider text-white text-base">
                        All files{" "}
                        <span className="font-mono normal-case text-white/40 text-xs">
                            ({images.length})
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors duration-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {images.length === 0 ? (
                        <div className="text-center py-16 text-white/30">
                            <Images className="w-7 h-7 mx-auto" />
                            <p className="mt-2 text-xs font-mono">
                                No files yet
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 text-white/40 font-mono text-[9px] uppercase tracking-widest">
                                <tr>
                                    <th className="px-4 py-2 w-14" />
                                    <th className="text-left font-semibold px-3 py-2">
                                        Name
                                    </th>
                                    <th className="text-left font-semibold px-3 py-2 hidden sm:table-cell">
                                        Uploaded
                                    </th>
                                    <th className="text-right font-semibold px-4 py-2">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map((img) => (
                                    <TableRow
                                        key={img.url}
                                        image={img}
                                        onSelect={onSelect}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
