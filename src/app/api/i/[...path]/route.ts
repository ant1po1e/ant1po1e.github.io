import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;
    const pathname = Array.isArray(path) ? path.join("/") : path;

    if (!pathname || !pathname.startsWith("v/")) {
        return NextResponse.json(
            { error: "Path tidak valid." },
            { status: 400 },
        );
    }

    try {
        const result = await get(pathname, { access: "public" });
        if (!result) {
            return NextResponse.json(
                { error: "Gambar tidak ditemukan." },
                { status: 404 },
            );
        }

        return new NextResponse(result.stream, {
            status: 200,
            headers: {
                "Content-Type":
                    result.blob.contentType || "application/octet-stream",
                // These are public images served under our own domain purely for a
                // nicer URL/embed — safe to let browsers and CDNs cache them hard.
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Gambar tidak ditemukan." },
            { status: 404 },
        );
    }
}
