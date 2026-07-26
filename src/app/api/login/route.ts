import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    checkPassword,
    buildSessionCookieValue,
    sessionCookieOptions,
    COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: Request) {
    let body: { password?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const { password } = body || {};

    try {
        if (!checkPassword(password)) {
            // small delay to soften brute-force attempts
            await new Promise((r) => setTimeout(r, 400));
            return NextResponse.json(
                { error: "Incorrect password." },
                { status: 401 },
            );
        }
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : String(err) },
            { status: 500 },
        );
    }

    const cookieStore = await cookies();
    cookieStore.set(
        COOKIE_NAME,
        buildSessionCookieValue(),
        sessionCookieOptions(),
    );

    return NextResponse.json({ ok: true });
}
