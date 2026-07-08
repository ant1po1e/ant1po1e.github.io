import { useCallback, useEffect, useRef, useState } from "react";
import {
    checkSession,
    deleteImage,
    fetchImages,
    login,
    logout,
    toShareUrl,
    uploadImage,
} from "../lib/api.js";

function LoginForm({ onSuccess }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(password);
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto py-10 text-center">
            <i className="bi bi-lock-fill text-3xl text-black/60" />
            <p className="text-black/60 text-sm mt-3 mb-6">
                This gallery is private. Enter the password to continue.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/70 border border-black/15 rounded-lg px-4 py-2.5 text-black text-center placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg py-2.5 transition">
                    {loading ? "Checking…" : "Unlock"}
                </button>
            </form>
        </div>
    );
}

function UploadZone({ onUploaded }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [queue, setQueue] = useState([]); // [{name, progress, error}]

    const handleFiles = useCallback(
        async (fileList) => {
            const files = Array.from(fileList).filter((f) =>
                f.type.startsWith("image/"),
            );
            if (files.length === 0) return;

            setQueue((q) => [
                ...q,
                ...files.map((f) => ({
                    name: f.name,
                    progress: 0,
                    error: null,
                })),
            ]);

            for (const file of files) {
                try {
                    const blob = await uploadImage(file, (pct) => {
                        setQueue((q) =>
                            q.map((item) =>
                                item.name === file.name
                                    ? { ...item, progress: pct }
                                    : item,
                            ),
                        );
                    });
                    onUploaded(blob);
                    setQueue((q) =>
                        q.filter((item) => item.name !== file.name),
                    );
                } catch (err) {
                    setQueue((q) =>
                        q.map((item) =>
                            item.name === file.name
                                ? { ...item, error: err.message }
                                : item,
                        ),
                    );
                }
            }
        },
        [onUploaded],
    );

    return (
        <div className="mb-6">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition ${
                    dragging
                        ? "border-blue-400 bg-blue-400/5"
                        : "border-black/20 hover:border-black/40"
                }`}>
                <i className="bi bi-cloud-arrow-up text-2xl text-black/50" />
                <p className="font-semibold text-black mt-2">
                    Drop images here
                </p>
                <p className="text-black/50 text-sm mt-1">
                    or click to choose files · auto-converted to WebP
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                    }}
                />
            </div>

            {queue.length > 0 && (
                <div className="mt-3 space-y-2">
                    {queue.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-3 bg-white/60 border border-black/10 rounded-lg px-3 py-2 text-xs">
                            <span className="truncate flex-1 text-black/60">
                                {item.name}
                            </span>
                            {item.error ? (
                                <span className="text-red-500">
                                    {item.error}
                                </span>
                            ) : (
                                <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-400 transition-all"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function QuickCopyButton({ pathname }) {
    const [copied, setCopied] = useState(false);

    async function handleClick(e) {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(toShareUrl(pathname));
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore — user can still open the lightbox and copy from there
        }
    }

    return (
        <button
            onClick={handleClick}
            className={`absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded backdrop-blur bg-white/80 border transition opacity-0 group-hover:opacity-100 flex items-center gap-1 ${
                copied
                    ? "border-blue-400 text-blue-400"
                    : "border-black/10 text-black hover:text-blue-400"
            }`}>
            <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"}`} />
            {copied ? "Copied" : "Copy link"}
        </button>
    );
}

function ImageGrid({ images, onSelect }) {
    if (images.length === 0) {
        return (
            <div className="text-center py-16 border border-dashed border-black/15 rounded-lg">
                <i className="bi bi-images text-3xl text-black/25" />
                <p className="font-semibold text-black/60 mt-2">
                    The vault is empty
                </p>
                <p className="text-black/40 text-sm mt-1">
                    Upload your first image above
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {images.map((img) => (
                <div
                    key={img.url}
                    onClick={() => onSelect(img)}
                    className="group relative aspect-square bg-black/5 rounded-lg overflow-hidden cursor-pointer border border-black/10">
                    <img
                        src={img.url}
                        alt={img.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <QuickCopyButton pathname={img.pathname} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                        <span className="text-[10px] text-white truncate">
                            {img.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function buildSnippets(image) {
    const url = toShareUrl(image.pathname);
    return {
        Link: url,
        HTML: `<img src="${url}" alt="${image.name}" />`,
        Markdown: `![${image.name}](${url})`,
        BBCode: `[img]${url}[/img]`,
    };
}

function CopyRow({ label, value }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard API blocked — select-all fallback isn't worth the complexity here
        }
    }

    return (
        <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-[10px] font-semibold tracking-wide text-black/50 uppercase">
                {label}
            </span>
            <code className="flex-1 truncate bg-white/70 border border-black/10 rounded px-2 py-1.5 text-[11px] text-black/70">
                {value}
            </code>
            <button
                onClick={handleCopy}
                className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded border transition ${
                    copied
                        ? "border-blue-400 text-blue-400"
                        : "border-black/15 text-black/60 hover:text-black hover:border-black/30"
                }`}>
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
}

function ImageLightbox({ image, onClose, onDelete }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    if (!image) return null;

    const snippets = buildSnippets(image);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto"
            onClick={onClose}>
            <div
                className="max-w-3xl w-full bg-white rounded-lg shadow-lg flex flex-col items-center py-6 px-6"
                onClick={(e) => e.stopPropagation()}>
                <img
                    src={image.url}
                    alt={image.name}
                    className="max-h-[50vh] w-auto object-contain rounded-lg border border-black/10"
                />

                <div className="w-full flex items-center justify-between mt-4 text-xs text-black/50">
                    <span className="truncate">{image.name}</span>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                        <a
                            href={image.url}
                            download={image.name}
                            className="hover:text-blue-400 transition flex items-center gap-1">
                            <i className="bi bi-download" /> Download
                        </a>
                        <button
                            onClick={() => onDelete(image)}
                            className="hover:text-red-500 transition flex items-center gap-1">
                            <i className="bi bi-trash" /> Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="hover:text-black transition flex items-center gap-1">
                            <i className="bi bi-x-lg" /> Close
                        </button>
                    </div>
                </div>

                <div className="w-full mt-5 bg-black/5 border border-black/10 rounded-lg p-4 space-y-2.5">
                    <p className="text-[10px] font-semibold tracking-wide text-black/50 uppercase mb-1">
                        Link &amp; embed
                    </p>
                    {Object.entries(snippets).map(([label, value]) => (
                        <CopyRow key={label} label={label} value={value} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export const VaultSection = () => {
    const [authState, setAuthState] = useState("checking"); // checking | out | in
    const [images, setImages] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState("");

    const loadImages = useCallback(async () => {
        try {
            const { images } = await fetchImages();
            setImages(images);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        checkSession()
            .then(({ authenticated }) => {
                setAuthState(authenticated ? "in" : "out");
                if (authenticated) loadImages();
            })
            .catch(() => setAuthState("out"));
    }, [loadImages]);

    async function handleLogout() {
        await logout();
        setAuthState("out");
        setImages([]);
    }

    function handleUploaded(blob) {
        setImages((prev) => [
            {
                url: blob.url,
                name: blob.pathname.split("/").pop(),
                pathname: blob.pathname,
                uploadedAt: new Date().toISOString(),
            },
            ...prev,
        ]);
    }

    async function handleDelete(image) {
        try {
            await deleteImage(image.url);
            setImages((prev) => prev.filter((i) => i.url !== image.url));
            setSelected(null);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <section className="w-full px-4 md:px-24 flex justify-center items-center">
            <div className="w-full px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
                <div className="w-full px-4">
                    <div className="mx-auto text-center flex items-center justify-center gap-3">
                        <h1 className="font-bold text-black text-xl md:text-3xl">
                            Vault
                        </h1>
                        {authState === "in" && (
                            <span className="text-black/40 text-sm md:text-base">
                                {images.length}{" "}
                                {images.length === 1 ? "image" : "images"}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-5 w-full px-4 py-4 border-t-2 border-t-black">
                    {authState === "checking" && (
                        <div className="flex justify-center py-16">
                            <i className="bi bi-arrow-repeat animate-spin text-2xl text-black/40" />
                        </div>
                    )}

                    {authState === "out" && (
                        <LoginForm
                            onSuccess={() => {
                                setAuthState("in");
                                loadImages();
                            }}
                        />
                    )}

                    {authState === "in" && (
                        <>
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-semibold uppercase tracking-wide text-black/50 hover:text-blue-400 transition flex items-center gap-1">
                                    <i className="bi bi-box-arrow-right" /> Log
                                    out
                                </button>
                            </div>

                            <UploadZone onUploaded={handleUploaded} />

                            {error && (
                                <p className="text-red-500 text-sm mb-4">
                                    {error}
                                </p>
                            )}

                            <ImageGrid images={images} onSelect={setSelected} />
                        </>
                    )}
                </div>
            </div>

            <ImageLightbox
                image={selected}
                onClose={() => setSelected(null)}
                onDelete={handleDelete}
            />
        </section>
    );
};
