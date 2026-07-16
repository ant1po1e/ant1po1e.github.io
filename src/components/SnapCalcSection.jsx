import { useState } from "react";

const fieldClass =
    "w-full bg-paper border border-rule text-ink text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-muted transition-colors duration-300";

export const SnapCalcSection = () => {
    const [desiredSnap, setDesiredSnap] = useState("");
    const [baseSnap, setBaseSnap] = useState("1");
    const [bpm, setBpm] = useState("");
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setError("⚠️ Failed to copy to clipboard.");
        }
    };

    const calculate = () => {
        if (desiredSnap && baseSnap && bpm) {
            const calculated =
                (parseFloat(bpm) * parseFloat(desiredSnap)) /
                parseFloat(baseSnap);
            setResult(`${calculated.toFixed(3)}`);
            setError("");
        } else {
            setError("⚠️ Please fill in all fields before calculating.");
            setResult("");
        }
    };

    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-16 md:mt-24"
            aria-label="Snap Calculator Tool">
            <div className="mx-auto w-full max-w-xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="text-center">
                    <p className="font-mono text-xs tracking-widest uppercase text-muted mb-1">
                        Tools
                    </p>
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Snap Calculator
                    </h2>
                </div>

                <div className="mt-6 pt-6 border-t border-rule">
                    <div className="space-y-4 max-w-md mx-auto">
                        {/* Desired Snap */}
                        <div>
                            <label htmlFor="desired-snap" className="sr-only">
                                Desired Snap (1/x)
                            </label>
                            <input
                                type="number"
                                id="desired-snap"
                                name="desired-snap"
                                placeholder="Desired Snap (1/x)"
                                value={desiredSnap}
                                onChange={(e) => setDesiredSnap(e.target.value)}
                                className={fieldClass}
                            />
                        </div>

                        {/* Base Snap */}
                        <div>
                            <label htmlFor="base-snap" className="sr-only">
                                Base Snap
                            </label>
                            <select
                                id="base-snap"
                                value={baseSnap}
                                onChange={(e) => setBaseSnap(e.target.value)}
                                className={fieldClass}>
                                <option value="1">1/1</option>
                                <option value="2">1/2</option>
                                <option value="3">1/3</option>
                                <option value="4">1/4</option>
                                <option value="5">1/5</option>
                                <option value="6">1/6</option>
                                <option value="7">1/7</option>
                                <option value="8">1/8</option>
                                <option value="9">1/9</option>
                                <option value="12">1/12</option>
                                <option value="16">1/16</option>
                            </select>
                        </div>

                        {/* BPM */}
                        <div>
                            <label htmlFor="bpm" className="sr-only">
                                BPM
                            </label>
                            <input
                                type="number"
                                id="bpm"
                                name="bpm"
                                placeholder="BPM"
                                value={bpm}
                                onChange={(e) => setBpm(e.target.value)}
                                className={fieldClass}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="font-mono text-xs text-red-600">
                                {error}
                            </p>
                        )}

                        {/* Button */}
                        <div className="text-center flex justify-center pt-2">
                            <button
                                onClick={calculate}
                                type="button"
                                className="font-mono text-xs uppercase tracking-wide px-6 py-2.5 rounded-sm bg-ink text-paper md:hover:bg-accent transition-colors duration-300">
                                Calculate
                            </button>
                        </div>

                        {/* Result + Tooltip */}
                        <div className="pt-4 text-center">
                            <div className="inline-block relative">
                                <div className="font-mono text-sm md:text-base border border-rule rounded-sm py-2 px-4 text-ink">
                                    Result:&nbsp;
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleCopy()
                                        }
                                        disabled={!result}
                                        aria-label={
                                            result
                                                ? `Copy result ${result} BPM`
                                                : "No result to copy"
                                        }
                                        className="relative inline-flex items-center gap-1 text-accent hover:underline focus:outline-none focus:ring-1 focus:ring-accent rounded-sm px-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:text-ink">
                                        {result || "—"}
                                    </button>
                                    <span aria-hidden>&nbsp;BPM</span>
                                </div>

                                {/* Tooltip on copy */}
                                <span
                                    className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-sm bg-ink text-paper font-mono text-xs px-2 py-1 shadow transition-all duration-200
                    ${
                        copied
                            ? "opacity-100 scale-100 -top-8"
                            : "opacity-0 scale-95 -top-6"
                    }`}
                                    role="status"
                                    aria-live="polite">
                                    Copied!
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
