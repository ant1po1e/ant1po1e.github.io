import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    if (!verifyAuth(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                // Auth already verified above. The client is responsible for
                // sending a pathname prefixed with "v/" (see src/lib/api.ts).
                // Files are converted to WebP client-side before upload; GIFs are
                // sent through untouched to preserve animation.
                return {
                    addRandomSuffix: false,
                    maximumSizeInBytes: 25 * 1024 * 1024, // 25MB
                };
            },
            onUploadCompleted: async () => {
                // no external DB to update — Vercel Blob's own listing is our source of truth
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : String(err) },
            { status: 400 },
        );
    }
}
