import { useRef, useState } from "react";

const ANON_EMAIL = "anonymous@antipole.my.id";

const fieldClass =
    "w-full bg-paper border border-rule text-ink text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-muted transition-colors duration-300";

export const ContactSection = () => {
    const formRef = useRef(null);
    const alertRef = useRef(null);
    const previousEmailRef = useRef("");

    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [email, setEmail] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const scriptURL = "/api/contact";

    const toggleAnonymous = (checked) => {
        setIsAnonymous(checked);

        if (checked) {
            // remember what the user typed so we can restore it if they untick
            previousEmailRef.current = email;
            setEmail(ANON_EMAIL);
        } else {
            setEmail(previousEmailRef.current);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = formRef.current;
            const formData = new FormData(form);

            const urlEncoded = new URLSearchParams();
            for (let pair of formData.entries()) {
                urlEncoded.append(pair[0], pair[1]);
            }

            const response = await fetch(scriptURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlEncoded.toString(),
            });

            if (response.ok) {
                form.reset();
                // form.reset() only resets the DOM, not our controlled email state
                setEmail("");
                setIsAnonymous(false);
                previousEmailRef.current = "";

                setShowAlert(true);

                setTimeout(() => {
                    if (alertRef.current) {
                        alertRef.current.focus();
                    }
                }, 100);

                setTimeout(() => setShowAlert(false), 3000);
            } else {
                alert("Something went wrong! Please try again later.");
            }
        } catch (error) {
            console.error("Error!", error.message);
            alert("Something went wrong! Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="Contact Section">
            <div className="mx-auto w-full max-w-2xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Contact Me!
                    </h2>
                </div>

                <div className="mt-6 pt-6 border-t border-rule">
                    <form
                        ref={formRef}
                        name="Ant1po1e-contact-form"
                        onSubmit={handleSubmit}
                        className="space-y-4 max-w-md mx-auto"
                        aria-describedby="contact-description">
                        <p id="contact-description" className="sr-only">
                            Fill out this form to send me a message
                        </p>

                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                required
                                aria-label="Your name"
                                className={fieldClass}
                            />
                        </div>

                        {/* Email + anonymous lock */}
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    readOnly={isAnonymous}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-label="Your email address"
                                    aria-readonly={isAnonymous}
                                    className={`${fieldClass} ${
                                        isAnonymous
                                            ? "text-muted cursor-not-allowed pr-9"
                                            : ""
                                    }`}
                                />
                                {isAnonymous && (
                                    <i
                                        className="bi bi-lock-fill absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm"
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            {/* Anonymous toggle */}
                            <label
                                htmlFor="anonymous-toggle"
                                className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted cursor-pointer w-fit">
                                <input
                                    id="anonymous-toggle"
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) =>
                                        toggleAnonymous(e.target.checked)
                                    }
                                    className="w-4 h-4 accent-accent"
                                />
                                Send anonymously
                            </label>
                        </div>

                        <div>
                            <label htmlFor="message" className="sr-only">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Your message"
                                rows="4"
                                required
                                aria-label="Your message"
                                className={`${fieldClass} resize-none`}
                            />
                        </div>

                        {/* Success alert */}
                        {showAlert && (
                            <div
                                ref={alertRef}
                                tabIndex={-1}
                                className="items-center justify-center w-full text-center mb-2 p-4 gap-3 rounded-sm border border-rule bg-paper text-ink flex transition-opacity duration-300"
                                role="alert"
                                aria-live="polite">
                                <i
                                    className="bi bi-send text-accent"
                                    aria-hidden="true"
                                />
                                <div className="text-sm font-sans">
                                    <span className="font-medium">Thanks!</span>{" "}
                                    Your message has been submitted.
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="text-center flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                aria-busy={loading}
                                className="font-mono text-xs uppercase tracking-wide px-6 py-2.5 rounded-sm bg-ink text-paper hover:bg-accent transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                                {loading ? (
                                    <i
                                        className="bi bi-arrow-clockwise animate-spin inline-block"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
