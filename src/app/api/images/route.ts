import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { list } from "@vercel/blob";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    const cookieStore = await cookies();
    if (!verifyAuth(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { blobs } = await list({ prefix: "v/" });
        const images = blobs
            .filter((b) => b.pathname.startsWith("v/"))
            .sort(
                (a, b) =>
                    new Date(b.uploadedAt).getTime() -
                    new Date(a.uploadedAt).getTime(),
            )
            .map((b) => ({
                url: b.url,
                pathname: b.pathname,
                name: b.pathname.replace(/^v\//, ""),
                size: b.size,
                uploadedAt: b.uploadedAt,
            }));
        return NextResponse.json({ images });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : String(err) },
            { status: 500 },
        );
    }
}
