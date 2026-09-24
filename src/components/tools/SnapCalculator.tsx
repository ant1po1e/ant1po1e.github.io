import React, { useState } from "react";
import { Copy, Check, Calculator } from "lucide-react";

const inputClass =
    "w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#4E82B8] transition-colors";

export const SnapCalculator: React.FC = () => {
    const [desiredSnap, setDesiredSnap] = useState("");
    const [baseSnap, setBaseSnap] = useState("1");
    const [bpm, setBpm] = useState("");
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const calculate = () => {
        if (desiredSnap && baseSnap && bpm) {
            const calculated =
                (parseFloat(bpm) * parseFloat(desiredSnap)) /
                parseFloat(baseSnap);
            setResult(calculated.toFixed(3));
            setError("");
        } else {
            setError("Please fill in all fields before calculating.");
            setResult("");
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setError("Failed to copy to clipboard.");
        }
    };

    return (
        <div className="p-6 sm:p-8 rounded-lg border border-white/15 bg-white/[0.02] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4E82B8] mb-6 pb-4 border-b border-white/10">
                <Calculator className="w-3.5 h-3.5" />
                <span>SNAP-TO-BPM TIMING CONVERTER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                    <label
                        htmlFor="desired-snap"
                        className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                        Desired Snap (1/x)
                    </label>
                    <input
                        type="number"
                        id="desired-snap"
                        placeholder="e.g. 4"
                        value={desiredSnap}
                        onChange={(e) => setDesiredSnap(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label
                        htmlFor="base-snap"
                        className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                        Base Snap
                    </label>
                    <select
                        id="base-snap"
                        value={baseSnap}
                        onChange={(e) => setBaseSnap(e.target.value)}
                        className={inputClass}>
                        {[
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "12",
                            "16",
                        ].map((v) => (
                            <option key={v} value={v}>
                                1/{v}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="bpm"
                        className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                        BPM
                    </label>
                    <input
                        type="number"
                        id="bpm"
                        placeholder="e.g. 180"
                        value={bpm}
                        onChange={(e) => setBpm(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            {error && (
                <p className="font-mono text-xs text-red-400 mb-4">{error}</p>
            )}

            <div className="flex justify-center mb-6">
                <button
                    onClick={calculate}
                    className="px-6 py-2.5 rounded bg-white hover:bg-white/90 text-black text-xs font-mono font-semibold uppercase tracking-wider transition-colors">
                    Calculate
                </button>
            </div>

            <div className="p-6 rounded bg-black/60 border border-white/10 text-center">
                <div className="text-[12px] font-mono text-white/40 uppercase mb-1">
                    Result
                </div>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-display font-light text-white">
                        {result || "—"}
                    </span>
                    <span className="text-sm font-mono text-[#4E82B8] mb-1">
                        BPM
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!result}
                    aria-label={
                        result
                            ? `Copy result ${result} BPM`
                            : "No result to copy"
                    }
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "COPIED!" : "COPY RESULT"}</span>
                </button>
            </div>
        </div>
    );
};
