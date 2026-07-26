import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
    return NextResponse.json({ ok: true });
}
