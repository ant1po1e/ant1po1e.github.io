export const config = {
	runtime: "nodejs", 
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const scriptURL = process.env.CONTACT_FORM_SCRIPT;

	try {
		const response = await fetch(scriptURL, {
			method: "POST",
			body: req.body,
			headers: {
				"Content-Type": req.headers["content-type"],
			},
		});

		const text = await response.text();

		if (response.ok) {
			return res.status(200).json({ message: "Success", text });
		} else {
			return res.status(500).json({ message: "Google Script Error", text });
		}
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
