import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { del } from "@vercel/blob";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    if (!verifyAuth(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { url?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const { url } = body || {};
    if (!url || typeof url !== "string" || !url.includes("/v/")) {
        return NextResponse.json(
            { error: "Invalid image URL." },
            { status: 400 },
        );
    }

    try {
        await del(url);
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : String(err) },
            { status: 500 },
        );
    }
}
