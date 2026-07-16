import { upload } from "@vercel/blob/client";

async function jsonFetch(url, options = {}) {
    const res = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
}

export function checkSession() {
    return jsonFetch("/api/me");
}

export function login(password) {
    return jsonFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ password }),
    });
}

export function logout() {
    return jsonFetch("/api/logout", { method: "POST" });
}

export function fetchImages() {
    return jsonFetch("/api/images");
}

export function deleteImage(url) {
    return jsonFetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({ url }),
    });
}

function reserveSlug(ext) {
    return jsonFetch(`/api/slug?ext=${encodeURIComponent(ext)}`);
}

// Re-encodes an image file to WebP client-side using the canvas API, so
// every upload lands in storage already optimized. Animated GIFs are left
// untouched — canvas conversion would flatten them to a single frame.
function convertToWebP(file, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(objectUrl);
                    if (!blob) {
                        reject(new Error("WebP conversion failed"));
                        return;
                    }
                    const newName =
                        file.name.replace(/\.[^./\\]+$/, "") + ".webp";
                    resolve(new File([blob], newName, { type: "image/webp" }));
                },
                "image/webp",
                quality,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Could not load image for conversion"));
        };

        img.src = objectUrl;
    });
}

// Only these raster formats get re-encoded to WebP. GIFs are skipped to
// keep animation, SVGs are already tiny vector text, and everything that
// isn't an image (video, audio, documents, archives, etc.) is uploaded as-is.
const WEBP_CONVERTIBLE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/tiff",
]);

function extFromFilename(name) {
    const match = /\.([a-zA-Z0-9]+)$/.exec(name);
    return match ? match[1].toLowerCase() : "bin";
}

export async function uploadFile(file, onProgress) {
    const shouldConvert = WEBP_CONVERTIBLE_TYPES.has(file.type);
    const outFile = shouldConvert ? await convertToWebP(file) : file;
    const ext = shouldConvert ? "webp" : extFromFilename(file.name);
    const { pathname } = await reserveSlug(ext);
    const blob = await upload(pathname, outFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: onProgress
            ? (event) => onProgress(event.percentage)
            : undefined,
    });
    return blob;
}

// A short link under our own domain (e.g. https://vault.mydomain.com/i/v/foo.webp)
// instead of the raw *.public.blob.vercel-storage.com URL. Strips a leading
// "www." so links stay consistent no matter which host the visitor used.
export function toShareUrl(pathname) {
    const origin = window.location.origin.replace(/^(https?:\/\/)www\./, "$1");
    return `${origin}/i/${pathname}`;
}
