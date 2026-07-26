import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { get } from "@vercel/blob";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    if (!verifyAuth(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("pathname");

    if (!pathname || !pathname.startsWith("v/")) {
        return NextResponse.json(
            { error: "Path gambar tidak valid." },
            { status: 400 },
        );
    }

    try {
        const result = await get(pathname, { access: "private" });
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
                "Cache-Control": "private, no-cache",
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Gambar tidak ditemukan." },
            { status: 404 },
        );
    }
}
