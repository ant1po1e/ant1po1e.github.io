import { Link } from "react-router-dom";

export const NotFoundSection = () => {
    return (
        <section
            className="w-full flex items-center justify-center text-ink px-6 md:px-24 min-h-[70vh]"
            aria-labelledby="not-found-title">
            <div className="w-full max-w-lg p-8 rounded-xl shadow-xl bg-paper">
                <div className="text-center">
                    <p className="font-mono text-xs tracking-widest uppercase text-muted mb-2">
                        404
                    </p>
                    <h1
                        id="not-found-title"
                        className="font-display italic font-medium text-ink text-3xl md:text-5xl mb-4">
                        Page Not Found
                    </h1>
                    <p className="font-sans text-sm md:text-base text-ink/80 max-w-sm mx-auto">
                        We couldn't find the page you were looking for. It might
                        have been moved, deleted, or you may have mistyped the
                        URL.
                    </p>
                    <div className="pt-8">
                        <Link
                            to="/"
                            aria-label="Go back to homepage"
                            className="inline-block font-mono text-xs uppercase tracking-wide px-6 py-2.5 rounded-sm bg-ink text-paper hover:bg-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors duration-300">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
