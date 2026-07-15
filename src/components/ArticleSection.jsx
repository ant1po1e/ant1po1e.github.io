import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AccordionItem = ({ title, markdown, isOpen, onClick }) => (
    <div className="border-b border-rule">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center gap-4 py-4 text-left text-ink font-sans font-medium transition-colors duration-300 hover:text-accent focus:outline-none">
            <span>{title}</span>
            <i
                className={`bi bi-chevron-${
                    isOpen ? "up" : "down"
                } text-sm text-muted transition-transform duration-300`}
                aria-hidden="true"
            />
        </button>

        <div
            className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-screen py-2" : "max-h-0"
            }`}>
            <div className="prose prose-sm max-w-none font-sans text-sm text-ink/80">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        a: ({ ...props }) => (
                            <a
                                className="text-accent underline decoration-rule hover:decoration-accent transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            />
                        ),
                        ul: ({ ...props }) => (
                            <ul
                                className="list-disc pl-5 space-y-1"
                                {...props}
                            />
                        ),
                        ol: ({ ...props }) => (
                            <ol
                                className="list-decimal pl-5 space-y-1"
                                {...props}
                            />
                        ),
                        li: ({ ...props }) => (
                            <li className="text-ink/80" {...props} />
                        ),
                        blockquote: ({ ...props }) => (
                            <blockquote
                                className="border-l-2 border-rule pl-4 font-mono italic text-muted"
                                {...props}
                            />
                        ),
                        code: ({ inline, ...props }) =>
                            inline ? (
                                <code
                                    className="font-mono text-xs bg-rule/30 text-ink rounded-sm px-1.5 py-0.5"
                                    {...props}
                                />
                            ) : (
                                <code
                                    className="font-mono text-xs text-ink"
                                    {...props}
                                />
                            ),
                        pre: ({ ...props }) => (
                            <pre
                                className="bg-rule/20 border border-rule rounded-sm p-4 overflow-x-auto"
                                {...props}
                            />
                        ),
                        table: ({ ...props }) => (
                            <table
                                className="table-auto border-collapse border border-rule my-4"
                                {...props}
                            />
                        ),
                        th: ({ ...props }) => (
                            <th
                                className="border border-rule px-2 py-1 bg-rule/30 font-mono text-xs uppercase tracking-wide text-ink"
                                {...props}
                            />
                        ),
                        td: ({ ...props }) => (
                            <td
                                className="border border-rule px-2 py-1"
                                {...props}
                            />
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
            files.map((file) => fetch(file).then((res) => res.text())),
        ).then((markdowns) => {
            const parsed = markdowns.map((md) => {
                const lines = md.split("\n");
                const firstHeadingIndex = lines.findIndex((line) =>
                    line.startsWith("# "),
                );
                let title = "Untitled";

                if (firstHeadingIndex !== -1) {
                    title = lines[firstHeadingIndex].replace(/^# /, "").trim();
                    lines.splice(firstHeadingIndex, 1);
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
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="Mapping Articles Section">
            <div className="mx-auto w-full max-w-3xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Mapping
                    </h2>
                </div>

                {/* Accordion list */}
                <div className="text-justify mt-6 pt-6 border-t border-rule overflow-y-auto max-h-[42vh] pr-1">
                    <div className="mt-2 divide-y divide-rule">
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
