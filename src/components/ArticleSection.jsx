import { useState } from "react";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
	return (
		<div className="border-b border-gray-300">
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

			<div
				className={`overflow-hidden transition-all duration-300 ${
					isOpen ? "max-h-screen py-2" : "max-h-0"
				}`}>
				<div className="text-sm text-gray-700 space-y-2">
					{content.map((block, i) =>
						block.type === "p" ? (
							<p key={i}>{block.text}</p>
						) : block.type === "ul" ? (
							<ul key={i} className="list-disc list-outside pl-5 space-y-1">
								{block.items.map((item, j) => (
									<li key={j}>{item}</li>
								))}
							</ul>
						) : null
					)}
				</div>
			</div>
		</div>
	);
};

export const ArticleSection = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	const articles = [
		{
			title: "Core Rule of Mapping",
			content: [
				{
					type: "p",
					text: "The foundation of mapping is map to the sounds. This principle shapes the entire process—guiding how balance, consistency, and variation are approached. Mapping isn’t about arbitrary design or decoration; it’s about translating music into a playable and meaningful experience.",
				},
			],
		},
		{
			title: "Balance as a Meta-Term",
			content: [
				{
					type: "p",
					text: "Balance is the most important concept, serving as a “meta-term” that connects all other aspects of mapping. Rather than a strict technical rule, balance is about how different elements work together. It relates closely to:",
				},
				{
					type: "ul",
					items: [
						"Consistency: Creating a coherent experience across the map so players feel grounded.",
						"Repetition: Respecting recurring sounds in a straightforward way, reinforcing familiarity.",
						"Variation: Introducing differences to keep things fresh, especially during repetitive parts of a song.",
					],
				},
				{
					type: "p",
					text: "These aren’t rigid rules—they shift depending on context. For instance, heavy variation may be needed to keep a repetitive section engaging, while consistency can still be preserved in smaller details. Likewise, breaking consistency intentionally can highlight a particularly important sound or moment. In every case, the ultimate goal is balance.",
				},
			],
		},
		{
			title: "Rethinking Terminology",
			content: [
				{
					type: "p",
					text: "Some common mapping terms—like layering or impact—are avoided because they can be vague or misleading. Instead:",
				},
				{
					type: "ul",
					items: [
						"Layering is reframed as structure, usually shaped by musical repetition.",
						"Impact is understood as the natural effect of how humans perceive sound and translate it into another sensory form.",
					],
				},
				{
					type: "p",
					text: "In short, the aim is to ground mapping concepts in clearer, more precise definitions rather than relying on conventional but ambiguous terms.",
				},
			],
		},
		{
			title: "Visuals and Expression",
			content: [
				{
					type: "p",
					text: "Visual design in mapping is not the starting point—it emerges naturally from interpreting sounds through gameplay. Patterns that are visually striking or hard to read may sometimes appear, but they are exceptions rather than the rule. Most visuals arise indirectly from how the song itself is structured and balanced. The guiding principle is simple: follow the music first, let visuals be a byproduct.",
				},
			],
		},
        {
            title: "How to Improve",
            content: [
                {
                    type: "p",
                    text: "Improving as a mapper is simple in theory: gain more experience. The real challenge lies in being intentional about growth. This requires deliberate practice and active engagement:",
                },
                {
                    type: "ul",
                    items: [
                        "Explore widely: Regularly check pending or in-progress maps. Study them critically to spot both strengths and weaknesses.",
                        "Study your own tastes: Play and revisit maps you enjoy. Ask yourself what specifically makes them appealing.",
                        "Limit editor time: Spend no more than ten hours per map. This forces you to focus on what truly matters instead of over-polishing.",
                        "Replicate to learn: Try creating maps inspired by the ones you admire. This isn’t copying—it’s a way to internalize what you like and make it part of your own style.",
                        "Refine your taste: Over time, these habits naturally shape and expand your preferences, helping you develop a unique identity as a mapper.",
                    ]
                }
            ]
        }
	];

	return (
		<section
			className="w-full px-4 md:px-24 flex justify-center items-center min-h-[70vh]"
			aria-labelledby="article-section">
			<div className="w-full md:w-7/8 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black text-xl md:text-3xl">
							Mapping
						</h1>
					</div>
				</div>
				<div className="text-justify mt-5 w-full px-4 py-4 border-t-2 border-t-black overflow-y-auto max-h-[400px]">
					<div className="mt-4 divide-y divide-gray-200">
						{articles.map((article, index) => (
							<AccordionItem
								key={index}
								title={article.title}
								content={article.content}
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
