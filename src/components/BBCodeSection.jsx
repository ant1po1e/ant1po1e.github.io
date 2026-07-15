import { useMemo, useState } from "react";
import { generateBBCode, generatePreviewHTML } from "../utils/bbcodeUtils";

const fieldClass =
    "w-full bg-paper border border-rule text-ink text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-muted transition-colors duration-300";

export const BBCodeSection = () => {
    const [text, setText] = useState("Hello World!");
    const [effect, setEffect] = useState("horizontal");

    const [startColor, setStartColor] = useState("#FF0000");
    const [middleColor, setMiddleColor] = useState("#00FF00");
    const [endColor, setEndColor] = useState("#0000FF");

    const [font, setFont] = useState("None");
    const [size, setSize] = useState("None");

    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);

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

    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="BBCode Text Colorizer Tool">
            <div className="mx-auto w-full max-w-xl scrollbar-none p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="text-center">
                    <p className="font-mono text-xs tracking-widest uppercase text-muted mb-1">
                        Tools
                    </p>
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        BBCode Text Colorizer
                    </h2>
                </div>

                <div className="mt-6 pt-6 border-t border-rule overflow-y-auto max-h-[40vh] pr-1">
                    <div className="space-y-4 max-w-md mx-auto">
                        {/* TEXT */}
                        <input
                            type="text"
                            id="text"
                            placeholder="Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className={fieldClass}
                        />

                        {/* EFFECT */}
                        <select
                            id="effect"
                            value={effect}
                            onChange={(e) => setEffect(e.target.value)}
                            className={fieldClass}>
                            <option value="horizontal">
                                Horizontal Gradient
                            </option>
                            <option value="three-color">
                                Three Color Gradient
                            </option>
                            <option value="solid">Solid Color</option>
                        </select>

                        {/* COLORS */}
                        <div className="flex border border-rule rounded-sm overflow-hidden divide-x divide-rule">
                            <input
                                type="color"
                                value={startColor}
                                onChange={(e) => setStartColor(e.target.value)}
                                className="w-full bg-paper h-10 px-2 focus:outline-none focus:ring-1 focus:ring-accent"
                            />

                            {effect === "three-color" && (
                                <input
                                    type="color"
                                    value={middleColor}
                                    onChange={(e) =>
                                        setMiddleColor(e.target.value)
                                    }
                                    className="w-full bg-paper h-10 px-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                            )}

                            {effect !== "solid" && (
                                <input
                                    type="color"
                                    value={endColor}
                                    onChange={(e) =>
                                        setEndColor(e.target.value)
                                    }
                                    className="w-full bg-paper h-10 px-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                            )}
                        </div>

                        {/* FONT */}
                        <select
                            id="font"
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
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

                        {/* SIZE */}
                        <select
                            id="size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className={fieldClass}>
                            <option value="None">Size</option>
                            <option value="50">Tiny</option>
                            <option value="85">Small</option>
                            <option value="100">Normal</option>
                            <option value="150">Large</option>
                        </select>

                        {/* Bold & Italic */}
                        <div className="flex border border-rule rounded-sm divide-x divide-rule font-mono text-sm text-ink">
                            <label
                                htmlFor="bold"
                                className="flex items-center gap-2 w-full px-4 py-3 cursor-pointer">
                                <input
                                    id="bold"
                                    type="checkbox"
                                    checked={bold}
                                    onChange={(e) => setBold(e.target.checked)}
                                    className="w-4 h-4 accent-accent"
                                />
                                Bold
                            </label>

                            <label
                                htmlFor="italic"
                                className="flex items-center gap-2 w-full px-4 py-3 cursor-pointer">
                                <input
                                    id="italic"
                                    type="checkbox"
                                    checked={italic}
                                    onChange={(e) =>
                                        setItalic(e.target.checked)
                                    }
                                    className="w-4 h-4 accent-accent"
                                />
                                Italic
                            </label>
                        </div>

                        {/* PREVIEW */}
                        <div className="border border-rule rounded-sm overflow-hidden">
                            <div className="w-full bg-paper px-4 py-3 border-b border-rule">
                                <span
                                    className="text-base"
                                    dangerouslySetInnerHTML={{
                                        __html: previewHTML,
                                    }}
                                />
                            </div>

                            {/* BBCODE */}
                            <textarea
                                rows={4}
                                value={bbcode}
                                readOnly
                                className="w-full bg-paper font-mono text-ink text-xs px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
