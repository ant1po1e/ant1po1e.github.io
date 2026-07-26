import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("p");

    if (!pathname || !pathname.startsWith("v/")) {
        return NextResponse.json({ error: "Invalid path." }, { status: 400 });
    }

    try {
        const result = await get(pathname, { access: "public" });
        if (!result) {
            return NextResponse.json(
                { error: "Image not found." },
                { status: 404 },
            );
        }

        return new NextResponse(result.stream, {
            status: 200,
            headers: {
                "Content-Type":
                    result.blob.contentType || "application/octet-stream",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Image not found." },
            { status: 404 },
        );
    }
}
