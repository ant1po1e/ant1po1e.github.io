import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { head } from "@vercel/blob";
import crypto from "node:crypto";
import { verifyAuth } from "@/lib/auth";

const SLUG_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_ATTEMPTS = 6;

function randomSlug(length = 5) {
    let out = "";
    for (let i = 0; i < length; i++) {
        out += SLUG_CHARS[crypto.randomInt(0, SLUG_CHARS.length)];
    }
    return out;
}

export async function GET(request: Request) {
    const cookieStore = await cookies();
    if (!verifyAuth(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ext = searchParams.get("ext");

    if (!ext || !/^[a-z0-9]{1,10}$/i.test(ext)) {
        return NextResponse.json(
            { error: "Invalid extension." },
            { status: 400 },
        );
    }

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const pathname = `v/${randomSlug()}.${ext}`;
        try {
            // head() throws if the blob doesn't exist — that's the "free" case.
            await head(pathname);
            // No throw means something is already there at this path — retry.
        } catch {
            return NextResponse.json({ pathname });
        }
    }

    return NextResponse.json(
        { error: "Could not find a free slug, please try again." },
        { status: 500 },
    );
}
