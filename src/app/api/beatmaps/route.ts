import { NextResponse } from "next/server";

export async function GET() {
    const scriptURL = process.env.BEATMAP_FEED_URL;

    try {
        const response = await fetch(scriptURL as string);
        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            console.error("Google Script Error:", data);
            return NextResponse.json(
                { message: "Google Script Error", data },
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
