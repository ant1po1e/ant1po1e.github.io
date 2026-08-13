import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

const ANON_EMAIL = "anonymous@antipole.my.id";

// Raw row shape is whatever the Google Apps Script feed returns — column
// names depend on how the sheet headers are set up, so we read leniently.
type RawRow = Record<string, unknown>;

function pick(row: RawRow, keys: string[]): string {
    for (const key of Object.keys(row)) {
        if (keys.includes(key.toLowerCase().trim())) {
            const value = row[key];
            if (value !== null && value !== undefined && value !== "") {
                return String(value);
            }
        }
    }
    return "";
}

function normalize(row: RawRow, index: number) {
    const name = pick(row, ["name", "nama"]);
    const email = pick(row, ["email", "e-mail"]);
    const message = pick(row, ["message", "pesan", "msg", "comment"]);
    const timestampRaw = pick(row, [
        "timestamp",
        "date",
        "time",
        "waktu",
        "tanggal",
    ]);

    let timestamp: string | null = null;
    if (timestampRaw) {
        const parsed = new Date(timestampRaw);
        timestamp = Number.isNaN(parsed.getTime())
            ? timestampRaw
            : parsed.toISOString();
    }

    return {
        id: `${index}-${timestampRaw || name}`,
        name: name || "Unknown",
        email: email || "",
        message,
        timestamp,
        isAnonymous: email.toLowerCase() === ANON_EMAIL,
    };
}

export async function GET() {
    const cookieStore = await cookies();
    if (!verifyAuth(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Falls back to the same script used to submit the form, since a single
    // Google Apps Script Web App commonly handles both doPost (write) and
    // doGet (read) against the same sheet.
    const scriptURL =
        process.env.CONTACT_MESSAGES_FEED_URL || process.env.CONTACT_FORM_SCRIPT;

    if (!scriptURL) {
        return NextResponse.json(
            {
                error:
                    "CONTACT_MESSAGES_FEED_URL (or CONTACT_FORM_SCRIPT) is not configured.",
            },
            { status: 500 },
        );
    }

    try {
        const response = await fetch(scriptURL, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
            console.error("Google Script Error:", data);
            return NextResponse.json(
                { error: "Failed to load messages from the sheet." },
                { status: 502 },
            );
        }

        const rows: RawRow[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.messages)
                ? data.messages
                : Array.isArray(data?.rows)
                    ? data.rows
                    : [];

        const messages = rows
            .map((row, index) => normalize(row, index))
            .filter((m) => m.message || m.name)
            .reverse(); // newest submissions are usually appended last

        return NextResponse.json({ messages });
    } catch (err) {
        console.error("Handler error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
