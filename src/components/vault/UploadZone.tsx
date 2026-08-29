import React, { useCallback, useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";
import { uploadFile } from "../../lib/vaultApi";
import { UploadCloud } from "lucide-react";

interface QueueItem {
    name: string;
    progress: number;
    error: string | null;
}

export const UploadZone: React.FC<{
    onUploaded: (blob: PutBlobResult) => void;
}> = ({ onUploaded }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const handleFiles = useCallback(
        async (fileList: FileList | null) => {
            const files = Array.from(fileList || []);
            if (files.length === 0) return;

            setQueue((q) => [
                ...q,
                ...files.map((f) => ({
                    name: f.name,
                    progress: 0,
                    error: null,
                })),
            ]);

            for (const file of files) {
                try {
                    const blob = await uploadFile(file, (pct) => {
                        setQueue((q) =>
                            q.map((item) =>
                                item.name === file.name
                                    ? { ...item, progress: pct }
                                    : item,
                            ),
                        );
                    });
                    onUploaded(blob);
                    setQueue((q) =>
                        q.filter((item) => item.name !== file.name),
                    );
                } catch (err) {
                    setQueue((q) =>
                        q.map((item) =>
                            item.name === file.name
                                ? {
                                      ...item,
                                      error:
                                          err instanceof Error
                                              ? err.message
                                              : String(err),
                                  }
                                : item,
                        ),
                    );
                }
            }
        },
        [onUploaded],
    );

    return (
        <div className="mb-5">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors duration-300 ${
                    dragging
                        ? "border-[#7B68EE] bg-[#7B68EE]/5"
                        : "border-white/15 hover:border-white/30"
                }`}>
                <UploadCloud className="w-6 h-6 text-white/40 mx-auto" />
                <p className="font-medium text-white text-sm mt-2">
                    Drop files here
                </p>
                <p className="font-mono text-[12px] text-white/40 mt-1">
                    or click to choose files · images are auto-converted to WebP
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                    }}
                />
            </div>

            {queue.length > 0 && (
                <div className="mt-3 space-y-2">
                    {queue.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-3 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono">
                            <span className="truncate flex-1 text-white/50">
                                {item.name}
                            </span>
                            {item.error ? (
                                <span className="text-red-400">
                                    {item.error}
                                </span>
                            ) : (
                                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#7B68EE] transition-all"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
