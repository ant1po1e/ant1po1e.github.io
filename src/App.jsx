import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Beatmaps } from "./pages/Beatmaps";
import { Article } from "./pages/Article";
import { Projects } from "./pages/Projects";
import { Tools } from "./pages/Tools";
import { Contact } from "./pages/Contact";
import { BBCodeGenerator } from "./pages/BBCodeGenerator";
import { SnapCalculator } from "./pages/SnapCalculator";
import { Navbar } from "./components/Navbar";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
	return (
		<BrowserRouter>
			<div className="absolute inset-0 bg-[rgba(200,200,200,0.6)] backdrop-blur-[10px]"></div>
			<Navbar />
			<Routes>
				<Route index element={<Home />} />
				<Route path="*" element={<NotFound />} />
				<Route path="/contributed-beatmaps" element={<Beatmaps />} />
				<Route path="/how-to-map" element={<Article />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/tools">
					<Route index element={<Tools />} />
					<Route path="bbcode-generator" element={<BBCodeGenerator />} />
					<Route path="snap-calculator" element={<SnapCalculator />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
