import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Projects } from "./pages/Projects";
import { Tools } from "./pages/Tools";
import { Contact } from "./pages/Contact";
import { BBCodeGenerator } from "./pages/BBCodeGenerator";
import { Navbar } from "./components/Navbar";
import "bootstrap-icons/font/bootstrap-icons.css";
import { SnapCalculator } from "./pages/SnapCalculator";

function App() {
	return (
		<BrowserRouter>
			<div className="absolute inset-0 bg-[rgba(200,200,200,0.6)] backdrop-blur-[10px]"></div>
			<Navbar />
			<Routes>
				<Route index element={<Home />} />
				<Route path="*" element={<NotFound />} />
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
