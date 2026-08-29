import React, { useMemo, useState } from "react";
import {
    generateBBCode,
    generatePreviewHTML,
    type BBCodeEffect,
} from "../../lib/bbcodeUtils";
import type { UnicodeFontKey } from "../../lib/unicodeFonts";
import { Copy, Check, Palette } from "lucide-react";

const fieldClass =
    "w-full bg-black/60 border border-white/15 text-white text-xs font-mono px-3 py-2 rounded focus:outline-none focus:border-[#4E82B8] transition-colors";

export const BBCodeColorizer: React.FC = () => {
    const [text, setText] = useState("Hello World!");
    const [effect, setEffect] = useState<BBCodeEffect>("horizontal");

    const [startColor, setStartColor] = useState("#4E82B8");
    const [middleColor, setMiddleColor] = useState("#C95767");
    const [endColor, setEndColor] = useState("#7B68EE");

    const [font, setFont] = useState<UnicodeFontKey>("None");
    const [size, setSize] = useState("None");

    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [copied, setCopied] = useState(false);

    const bbcode = useMemo(
        () =>
            generateBBCode({
                text,
                effect,
                startColor,
                middleColor,
                endColor,
                font,
                size,
                bold,
                italic,
            }),
        [
            text,
            effect,
            startColor,
            middleColor,
            endColor,
            font,
            size,
            bold,
            italic,
        ],
    );

    const previewHTML = useMemo(() => generatePreviewHTML(bbcode), [bbcode]);

    const handleCopy = async () => {
        if (!bbcode) return;
        try {
            await navigator.clipboard.writeText(bbcode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    };

    return (
        <div className="p-6 sm:p-8 rounded-lg border border-white/15 bg-white/[0.02] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4E82B8] mb-6 pb-4 border-b border-white/10">
                <Palette className="w-3.5 h-3.5" />
                <span>OSU! FORUM BBCODE TEXT COLORIZER</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                            Text
                        </label>
                        <input
                            type="text"
                            placeholder="Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className={fieldClass}
                        />
                    </div>

                    <div>
                        <label className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                            Effect
                        </label>
                        <select
                            value={effect}
                            onChange={(e) =>
                                setEffect(e.target.value as BBCodeEffect)
                            }
                            className={fieldClass}>
                            <option value="horizontal">
                                Horizontal Gradient
                            </option>
                            <option value="three-color">
                                Three Color Gradient
                            </option>
                            <option value="solid">Solid Color</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                            Colors
                        </label>
                        <div className="flex border border-white/15 rounded overflow-hidden divide-x divide-white/15">
                            <input
                                type="color"
                                value={startColor}
                                onChange={(e) => setStartColor(e.target.value)}
                                className="w-full bg-black/60 h-10 px-2 cursor-pointer"
                            />
                            {effect === "three-color" && (
                                <input
                                    type="color"
                                    value={middleColor}
                                    onChange={(e) =>
                                        setMiddleColor(e.target.value)
                                    }
                                    className="w-full bg-black/60 h-10 px-2 cursor-pointer"
                                />
                            )}
                            {effect !== "solid" && (
                                <input
                                    type="color"
                                    value={endColor}
                                    onChange={(e) =>
                                        setEndColor(e.target.value)
                                    }
                                    className="w-full bg-black/60 h-10 px-2 cursor-pointer"
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                            Font
                        </label>
                        <select
                            value={font}
                            onChange={(e) =>
                                setFont(e.target.value as UnicodeFontKey)
                            }
                            className={fieldClass}>
                            <option value="None">Font</option>
                            <option value="bold">Bold Unicode</option>
                            <option value="italic">Italic Unicode</option>
                            <option value="boldItalic">Bold Italic</option>
                            <option value="script">Script</option>
                            <option value="fraktur">Fraktur</option>
                            <option value="fullWidth">Full Width</option>
                            <option value="smallCaps">Small Caps</option>
                            <option value="circled">Circled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                            Size
                        </label>
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className={fieldClass}>
                            <option value="None">Size</option>
                            <option value="50">Tiny</option>
                            <option value="85">Small</option>
                            <option value="100">Normal</option>
                            <option value="150">Large</option>
                        </select>
                    </div>

                    <div className="flex border border-white/15 rounded divide-x divide-white/15 font-mono text-xs text-white">
                        <label
                            htmlFor="bold"
                            className="flex items-center gap-2 w-full px-4 py-2.5 cursor-pointer">
                            <input
                                id="bold"
                                type="checkbox"
                                checked={bold}
                                onChange={(e) => setBold(e.target.checked)}
                                className="w-3.5 h-3.5 accent-[#4E82B8]"
                            />
                            Bold
                        </label>
                        <label
                            htmlFor="italic"
                            className="flex items-center gap-2 w-full px-4 py-2.5 cursor-pointer">
                            <input
                                id="italic"
                                type="checkbox"
                                checked={italic}
                                onChange={(e) => setItalic(e.target.checked)}
                                className="w-3.5 h-3.5 accent-[#4E82B8]"
                            />
                            Italic
                        </label>
                    </div>
                </div>

                {/* Preview + Output */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-[12px] font-mono text-white/50 uppercase mb-1">
                            Preview
                        </label>
                        <div className="min-h-[44px] flex items-center px-3 py-2 rounded bg-black/60 border border-white/15">
                            <span
                                className="text-base break-all"
                                dangerouslySetInnerHTML={{
                                    __html: previewHTML || "&nbsp;",
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-[12px] font-mono text-white/50 uppercase">
                                BBCode Output
                            </label>
                            <button
                                onClick={handleCopy}
                                disabled={!bbcode}
                                className="flex items-center gap-1 text-[12px] font-mono text-[#4E82B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                {copied ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                    <Copy className="w-3 h-3" />
                                )}
                                <span>{copied ? "COPIED!" : "COPY"}</span>
                            </button>
                        </div>
                        <textarea
                            rows={8}
                            value={bbcode}
                            readOnly
                            className="w-full bg-black/80 font-mono text-white/80 text-[12px] px-3 py-2.5 rounded border border-white/10 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
