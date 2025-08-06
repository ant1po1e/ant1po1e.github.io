export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const scriptURL = process.env.CONTACT_FORM_SCRIPT;

	if (!scriptURL) {
		console.error("❌ Missing CONTACT_FORM_SCRIPT environment variable");
		return res.status(500).json({ error: "Missing Google Script URL" });
	}

	try {
		const response = await fetch(scriptURL, {
			method: "POST",
			body: req.body,
			headers: {
				"Content-Type": req.headers["content-type"],
			},
		});

		const text = await response.text();

		console.log("✅ Google Script Response:", text);

		if (response.ok) {
			return res.status(200).json({ message: "Success", text });
		} else {
			console.error("❌ Google Script Error:", text);
			return res.status(500).json({ message: "Google Script Error", text });
		}
	} catch (err) {
		console.error("❌ Server error:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
