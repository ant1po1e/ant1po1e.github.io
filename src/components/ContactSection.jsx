import { useRef, useState } from "react";

export const ContactSection = () => {
	const formRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const scriptURL = "/api/contact";

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
				setShowAlert(true);
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
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-1/2 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black text-xl md:text-3xl">
							Contact Me!
						</h1>
					</div>
				</div>

				<div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white">
					<form
						ref={formRef}
						name="Ant1po1e-contact-form"
						onSubmit={handleSubmit}
						className="space-y-4 max-w-md mx-auto">
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
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300"
							/>
						</div>
						<div>
							<label htmlFor="email" className="sr-only">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Email"
								required
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300"
							/>
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
								className="w-full bg-slate-700/50 shadow-lg text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder:text-slate-300 md:hover:scale-105 transition duration-300 resize-none"></textarea>
						</div>

						{/* Success alert */}
						{showAlert && (
							<div
								className="items-center justify-center w-full text-center mb-8 p-4 space-x-4 rounded-lg shadow text-blue-400 divide-gray-700 bg-white border border-blue-300 flex transition-opacity duration-300"
								role="alert">
								<i className="bi bi-send"></i>
								<div className="pl-1 text-sm font-normal">
									<span className="font-bold">Thanks!</span> Your message has
									been submitted.
								</div>
							</div>
						)}

						{/* Submit button */}
						<div className="text-center flex justify-center">
							<button
								type="submit"
								disabled={loading}
								className="relative flex h-[50px] w-24 md:hover:w-40 items-center justify-center overflow-hidden rounded-lg bg-black text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-400 before:duration-500 before:ease-out md:hover:shadow-blue-400 md:hover:before:h-56 md:hover:before:w-56 duration-300">
								<span className="relative z-10">
									{loading ? (
										<i className="bi bi-arrow-clockwise animate-spin inline-block" />
									) : (
										"Submit"
									)}
								</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};
