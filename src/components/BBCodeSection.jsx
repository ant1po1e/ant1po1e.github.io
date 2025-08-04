import { useEffect, useState } from "react";

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
	const [bbcode, setBBCode] = useState("");
	const [previewHTML, setPreviewHTML] = useState("");

	useEffect(() => {
		generateBBCode();
	}, [
		text,
		effect,
		startColor,
		middleColor,
		endColor,
		font,
		size,
		bold,
		italic,
	]);

	const interpolateColor = (color1, color2, factor) => {
		let result = "#";
		for (let i = 1; i <= 3; i++) {
			let c1 = parseInt(color1.substr(i * 2 - 1, 2), 16);
			let c2 = parseInt(color2.substr(i * 2 - 1, 2), 16);
			let c = Math.round(c1 + factor * (c2 - c1));
			result += c.toString(16).padStart(2, "0");
		}
		return result;
	};

	const applyGradient = (text, start, end) => {
		let result = "";
		for (let i = 0; i < text.length; i++) {
			let color = interpolateColor(start, end, i / (text.length - 1));
			result += `[color=${color}]${text[i]}[/color]`;
		}
		return result;
	};

	const applyThreeColorGradient = (text, start, mid, end) => {
		let result = "";
		for (let i = 0; i < text.length; i++) {
			let color =
				i < text.length / 2
					? interpolateColor(start, mid, i / (text.length / 2 - 1))
					: interpolateColor(
							mid,
							end,
							(i - text.length / 2) / (text.length / 2 - 1)
					  );
			result += `[color=${color}]${text[i]}[/color]`;
		}
		return result;
	};

	const updatePreview = (code) => {
		const preview = code
			.replace(/\[color=(#[A-Fa-f0-9]{6})\]/g, '<span style="color: $1">')
			.replace(/\[\/color\]/g, "</span>")
			.replace(/\[font=([^\]]+)\]/g, '<span style="font-family: $1">')
			.replace(/\[\/font\]/g, "</span>")
			.replace(/\[size=([^\]]+)\]/g, '<span style="font-size: 25px">')
			.replace(/\[\/size\]/g, "</span>")
			.replace(/\[b\]/g, "<strong>")
			.replace(/\[\/b\]/g, "</strong>")
			.replace(/\[i\]/g, "<em>")
			.replace(/\[\/i\]/g, "</em>");
		setPreviewHTML(preview);
	};

	const generateBBCode = () => {
		let code = "";

		if (effect === "horizontal") {
			code = applyGradient(text, startColor, endColor);
		} else if (effect === "three-color") {
			code = applyThreeColorGradient(text, startColor, middleColor, endColor);
		} else if (effect === "solid") {
			code = `[color=${startColor}]${text}[/color]`;
		}

		if (font !== "None") code = `[font=${font}]${code}[/font]`;
		if (size !== "None") code = `[size=${size}]${code}[/size]`;
		if (bold) code = `[b]${code}[/b]`;
		if (italic) code = `[i]${code}[/i]`;

		setBBCode(code);
		updatePreview(code);
	};

	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-1/2 scrollbar-none px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black font-merienda text-xl md:text-3xl">
							Tools |{" "}
							<span className="text-base md:text-xl">
								BBCode Text Colorizer
							</span>
						</h1>
					</div>
				</div>

				<div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white">
					<div className="space-y-4 max-w-md mx-auto">
						{/* Text input */}
						<div>
							<label htmlFor="text" className="sr-only">
								Text
							</label>
							<input
								type="text"
								id="text"
								placeholder="Text"
								value={text}
								onChange={(e) => setText(e.target.value)}
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300"
							/>
						</div>

						{/* Effect select */}
						<div>
							<label htmlFor="effect" className="sr-only">
								Effect
							</label>
							<select
								id="effect"
								value={effect}
								onChange={(e) => setEffect(e.target.value)}
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300">
								<option value="horizontal">Horizontal gradient</option>
								<option value="three-color">Three colored gradient</option>
								<option value="solid">Solid color</option>
							</select>
						</div>

						{/* Color inputs */}
						<div className="flex md:hover:scale-105 transition duration-300">
							<input
								type="color"
								id="startColor"
								value={startColor}
								onChange={(e) => setStartColor(e.target.value)}
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-2 py-1 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white"
							/>
							{effect === "three-color" && (
								<input
									type="color"
									id="middleColor"
									value={middleColor}
									onChange={(e) => setMiddleColor(e.target.value)}
									className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
								/>
							)}
							{effect !== "solid" && (
								<input
									type="color"
									id="endColor"
									value={endColor}
									onChange={(e) => setEndColor(e.target.value)}
									className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-2 py-1 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-white"
								/>
							)}
						</div>

						{/* Font & size */}
						<div className="flex gap-4">
							<select
								id="font"
								value={font}
								onChange={(e) => setFont(e.target.value)}
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300">
								<option value="None">Font</option>
								<option value="Arial">Arial</option>
								<option value="Arial Black">Arial Black</option>
								<option value="Arial Narrow">Arial Narrow</option>
								<option value="Book Antiqua">Book Antiqua</option>
								<option value="Century Gothic">Century Gothic</option>
								<option value="Comic Sans MS">Comic Sans MS</option>
								<option value="Courier New">Courier New</option>
								<option value="Franklin Gothic Medium">
									Franklin Gothic Medium
								</option>
								<option value="Garamond">Garamond</option>
								<option value="Georgia">Georgia</option>
								<option value="Impact">Impact</option>
								<option value="Lucida Console">Lucida Console</option>
								<option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
								<option value="Microsoft Sans Serif">
									Microsoft Sans Serif
								</option>
								<option value="Palatino Linotype">Palatino Linotype</option>
								<option value="Tahoma">Tahoma</option>
								<option value="Times New Roman">Times New Roman</option>
								<option value="Trebuchet MS">Trebuchet MS</option>
								<option value="Verdana">Verdana</option>
							</select>

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
						</div>

						{/* Bold & Italic */}
						<div className="hover:scale-105 transition duration-300">
							<ul className="items-center w-full text-sm font-medium border rounded-lg sm:flex bg-slate-700/50 shadow-lg border-gray-600 text-white">
								<li className="w-full border-b sm:border-b-0 sm:border-r border-gray-600">
									<div className="flex items-center ps-3">
										<input
											id="bold"
											type="checkbox"
											checked={bold}
											onChange={(e) => setBold(e.target.checked)}
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
											onChange={(e) => setItalic(e.target.checked)}
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

						{/* Preview & BBCode output */}
						<div className="hover:scale-105 transition duration-300">
							<div className="w-full bg-slate-700/50 shadow-lg text-white text-base px-4 py-2 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300">
								<span
									className="bg-white px-2 py-1 rounded-md text-black"
									id="preview"
									dangerouslySetInnerHTML={{ __html: previewHTML }}></span>
							</div>
							<textarea
								id="bbcode"
								name="bbcode"
								rows="4"
								value={bbcode}
								readOnly
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 resize-none"></textarea>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
