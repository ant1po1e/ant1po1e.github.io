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

export async function uploadImage(file, onProgress) {
    const uploadFile =
        file.type === "image/gif" ? file : await convertToWebP(file);
    const ext = uploadFile.type === "image/gif" ? "gif" : "webp";
    const { pathname } = await reserveSlug(ext);
    const blob = await upload(pathname, uploadFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: onProgress
            ? (event) => onProgress(event.percentage)
            : undefined,
    });
    return blob;
}

// A short link under our own domain (e.g. https://vault.mydomain.com/i/v/foo.webp)
// instead of the raw *.public.blob.vercel-storage.com URL. Nicer to share/embed,
// and becomes properly "branded" once a custom domain is attached to the project.
export function toShareUrl(pathname) {
    return `${window.location.origin}/i/${pathname}`;
}
