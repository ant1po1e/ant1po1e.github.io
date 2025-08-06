import { useState } from "react";

export const SnapCalcSection = () => {
	const [desiredSnap, setDesiredSnap] = useState("");
	const [baseSnap, setBaseSnap] = useState("1");
	const [bpm, setBpm] = useState("");
	const [result, setResult] = useState("");
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(result);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const calculate = () => {
		if (desiredSnap && baseSnap && bpm) {
			const calculated =
				(parseFloat(bpm) * parseFloat(desiredSnap)) / parseFloat(baseSnap);
			setResult(`${calculated.toFixed(3)}`);
		} else {
			alert("Please fill in all fields!");
		}
	};
	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-1/2 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black font-merienda text-xl md:text-3xl">
							Tools |{" "}
							<span className="text-base md:text-xl">Snap Calculator</span>
						</h1>
					</div>
				</div>

				<div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white">
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
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300"
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
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300">
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
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300"
							/>
						</div>

						{/* Button */}
						<div className="text-center flex justify-center">
							<button
								onClick={calculate}
								type="button"
								className="relative flex h-[50px] w-24 md:hover:w-40 items-center justify-center overflow-hidden rounded-lg bg-black text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-400 before:duration-500 before:ease-out md:hover:shadow-blue-400 md:hover:before:h-56 md:hover:before:w-56 duration-300">
								<span className="relative z-10">Calculate</span>
							</button>
						</div>

						{/* Result */}
						<div className="result pt-6 md:hover:scale-90 transition duration-300">
							<h2 className="text-sm md:text-xl font-bold bg-white inline rounded-lg py-2 px-4 text-blue-400">
								Result:
								<span
									className="hover:underline relative inline-block cursor-pointer"
									onClick={handleCopy}>
									{result}&nbsp;
								</span>
								BPM
								{copied && (
									<span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow transition-opacity duration-300">
										Copied!
									</span>
								)}
							</h2>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
