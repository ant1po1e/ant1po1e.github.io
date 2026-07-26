import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const scriptURL = process.env.CONTACT_FORM_SCRIPT;

    try {
        const bodyBuffer = await request.arrayBuffer();
        const contentType = request.headers.get("content-type") || "";

        const response = await fetch(scriptURL as string, {
            method: "POST",
            body: bodyBuffer,
            headers: {
                "Content-Type": contentType,
            },
        });

        const text = await response.text();

        if (response.ok) {
            return NextResponse.json({ message: "Success", text });
        } else {
            console.error("Google Script Error:", text);
            return NextResponse.json(
                { message: "Google Script Error", text },
                { status: 500 },
            );
        }
    } catch (err) {
        console.error("Handler error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
