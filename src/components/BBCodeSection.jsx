import { useMemo, useState } from "react";
import { generateBBCode, generatePreviewHTML } from "../utils/bbcodeUtils";

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
        <section className="w-full px-4 md:px-24 flex justify-center items-center">
            <div className="w-full md:w-1/2 scrollbar-none px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
                <div className="w-full px-4">
                    <div className="mx-auto text-center">
                        <h1 className="font-bold text-black text-xl md:text-3xl">
                            Tools |{" "}
                            <span className="text-base md:text-xl">
                                BBCode Text Colorizer
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white overflow-y-auto max-h-[50vh]">
                    <div className="space-y-4 max-w-md mx-auto">
                        {/* TEXT */}
                        <input
                            type="text"
                            id="text"
                            placeholder="Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300"
                        />

                        {/* EFFECT */}
                        <select
                            id="effect"
                            value={effect}
                            onChange={(e) => setEffect(e.target.value)}
                            className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300">
                            <option value="horizontal">
                                Horizontal Gradient
                            </option>
                            <option value="three-color">
                                Three Color Gradient
                            </option>
                            <option value="solid">Solid Color</option>
                        </select>

                        {/* COLORS */}
                        <div className="flex md:hover:scale-105 transition duration-300">
                            <input
                                type="color"
                                value={startColor}
                                onChange={(e) => setStartColor(e.target.value)}
                                className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-2 py-1 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white"
                            />

                            {effect === "three-color" && (
                                <input
                                    type="color"
                                    value={middleColor}
                                    onChange={(e) =>
                                        setMiddleColor(e.target.value)
                                    }
                                    className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            )}

                            {effect !== "solid" && (
                                <input
                                    type="color"
                                    value={endColor}
                                    onChange={(e) =>
                                        setEndColor(e.target.value)
                                    }
                                    className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-2 py-1 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            )}
                        </div>

                        {/* FONT */}
                        <select
                            id="font"
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300">
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
                            className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300">
                            <option value="None">Size</option>
                            <option value="50">Tiny</option>
                            <option value="85">Small</option>
                            <option value="100">Normal</option>
                            <option value="150">Large</option>
                        </select>

                        {/* Bold & Italic */}
                        <div className="hover:scale-105 transition duration-300">
                            <ul className="items-center w-full text-sm font-medium border rounded-lg sm:flex bg-slate-700/50 shadow-lg border-gray-600 text-white">
                                <li className="w-full border-b sm:border-b-0 sm:border-r border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input
                                            id="bold"
                                            type="checkbox"
                                            checked={bold}
                                            onChange={(e) =>
                                                setBold(e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-400 rounded focus:ring-blue-400 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-white border-gray-500"
                                        />
                                        <label
                                            htmlFor="bold"
                                            className="w-full py-3 ms-2 text-sm font-medium">
                                            Bold
                                        </label>
                                    </div>
                                </li>

                                <li className="w-full border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input
                                            id="italic"
                                            type="checkbox"
                                            checked={italic}
                                            onChange={(e) =>
                                                setItalic(e.target.checked)
                                            }
                                            className="w-4 h-4 text-blue-400 rounded focus:ring-blue-400 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-white border-gray-500"
                                        />
                                        <label
                                            htmlFor="italic"
                                            className="w-full py-3 ms-2 text-sm font-medium">
                                            Italic
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* PREVIEW */}
                        <div className="hover:scale-105 transition duration-300">
                            <div className="w-full bg-slate-700/50 shadow-lg text-white text-base px-4 py-2 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300">
                                <span
                                    className="bg-white px-2 py-1 rounded-md text-black"
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
                                className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
