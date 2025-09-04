import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AccordionItem = ({ title, markdown, isOpen, onClick }) => (
	<div className="border-b border-gray-300">
		{/* Button */}
		<button
			onClick={onClick}
			className="w-full flex justify-between items-center py-3 text-left text-black font-medium focus:outline-none">
			<span>{title}</span>
			<i
				className={`bi bi-chevron-${
					isOpen ? "up" : "down"
				} transition-transform duration-300`}
			/>
		</button>

		{/* Content */}
		<div
			className={`overflow-hidden transition-all duration-300 ${
				isOpen ? "max-h-screen py-2" : "max-h-0"
			}`}>
			<div className="prose prose-sm max-w-none text-sm text-gray-800">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
						ul: ({ node, ...props }) => (
							<ul className="list-disc pl-5 space-y-1" {...props} />
						),
						ol: ({ node, ...props }) => (
							<ol className="list-decimal pl-5 space-y-1" {...props} />
						),
						li: ({ node, ...props }) => (
							<li className="text-gray-700" {...props} />
						),
						blockquote: ({ node, ...props }) => (
							<blockquote
								className="border-l-4 border-gray-400 pl-4 italic text-gray-600"
								{...props}
							/>
						),
						table: ({ node, ...props }) => (
							<table
								className="table-auto border-collapse border border-gray-400 my-4"
								{...props}
							/>
						),
						th: ({ node, ...props }) => (
							<th
								className="border border-gray-400 px-2 py-1 bg-gray-100"
								{...props}
							/>
						),
						td: ({ node, ...props }) => (
							<td className="border border-gray-400 px-2 py-1" {...props} />
						),
					}}>
					{markdown}
				</ReactMarkdown>
			</div>
		</div>
	</div>
);

export const ArticleSection = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		const files = [
			"/markdown/core-rule.md",
			"/markdown/balance.md",
			"/markdown/rethinking.md",
			"/markdown/visuals.md",
			"/markdown/improve.md",
		];

		Promise.all(
			files.map((file) => fetch(file).then((res) => res.text()))
		).then((markdowns) => {
			const parsed = markdowns.map((md) => {
				const lines = md.split("\n");
				const firstHeadingIndex = lines.findIndex((line) =>
					line.startsWith("# ")
				);
				let title = "Untitled";

				if (firstHeadingIndex !== -1) {
					title = lines[firstHeadingIndex].replace(/^# /, "").trim();
					lines.splice(firstHeadingIndex, 1); // remove heading from content
				}

				return {
					title,
					markdown: lines.join("\n").trim(),
				};
			});

			setArticles(parsed);
		});
	}, []);

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-7/8 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black text-xl md:text-3xl">
							Mapping
						</h1>
					</div>
				</div>

				<div className="text-justify mt-5 w-full px-4 py-4 border-t-2 border-t-black overflow-y-auto max-h-[50vh]">
					<div className="mt-4 divide-y divide-gray-200">
						{articles.map((article, index) => (
							<AccordionItem
								key={index}
								title={article.title}
								markdown={article.markdown}
								isOpen={activeIndex === index}
								onClick={() => toggleAccordion(index)}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
