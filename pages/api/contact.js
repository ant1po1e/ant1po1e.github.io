import formidable from "formidable";
import { promisify } from "util";

export const config = {
	api: {
		bodyParser: false, // ⚠️ Turn off default body parsing!
	},
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const scriptURL = process.env.CONTACT_FORM_SCRIPT;

	if (!scriptURL) {
		console.error("❌ Missing CONTACT_FORM_SCRIPT");
		return res.status(500).json({ error: "Missing Google Script URL" });
	}

	try {
		const form = formidable();
		const parseForm = promisify(form.parse);
		const [fields] = await parseForm(req);

		const formBody = new URLSearchParams(fields).toString();

		const response = await fetch(scriptURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formBody,
		});

		const text = await response.text();

		if (response.ok) {
			return res.status(200).json({ message: "Success", text });
		} else {
			console.error("❌ Google Script error:", text);
			return res.status(500).json({ error: "Google Script failed", text });
		}
	} catch (error) {
		console.error("❌ Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
