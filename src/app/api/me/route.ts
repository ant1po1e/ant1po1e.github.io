import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    const cookieStore = await cookies();
    const authenticated = verifyAuth(cookieStore);
    return NextResponse.json({ authenticated });
}
