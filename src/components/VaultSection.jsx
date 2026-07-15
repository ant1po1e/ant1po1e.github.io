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

const fieldClass =
    "w-full bg-paper border border-rule text-ink text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-muted transition-colors duration-300";

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
            <i className="bi bi-lock-fill text-3xl text-muted" />
            <p className="text-muted text-sm mt-3 mb-6">
                This gallery is private. Enter the password to continue.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`${fieldClass} text-center`}
                />
                {error && (
                    <p className="font-mono text-xs text-red-600">{error}</p>
                )}
                <div className="text-center flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="font-mono text-xs uppercase tracking-wide px-6 py-2.5 rounded-sm bg-ink text-paper hover:bg-accent transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? "Checking…" : "Unlock"}
                    </button>
                </div>
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
                className={`cursor-pointer rounded-sm border-2 border-dashed px-6 py-8 text-center transition-colors duration-300 ${
                    dragging
                        ? "border-accent bg-accent/5"
                        : "border-rule hover:border-ink/40"
                }`}>
                <i className="bi bi-cloud-arrow-up text-2xl text-muted" />
                <p className="font-medium text-ink mt-2">Drop images here</p>
                <p className="font-mono text-xs text-muted mt-1">
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
                            className="flex items-center gap-3 bg-paper border border-rule rounded-sm px-3 py-2 text-xs font-mono">
                            <span className="truncate flex-1 text-muted">
                                {item.name}
                            </span>
                            {item.error ? (
                                <span className="text-red-600">
                                    {item.error}
                                </span>
                            ) : (
                                <div className="w-24 h-1.5 bg-rule rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent transition-all"
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

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

function TableRow({ image, onSelect, onDelete }) {
    const [copied, setCopied] = useState(false);

    async function copyLink(e) {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(toShareUrl(image.pathname));
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    }

    return (
        <tr
            onClick={() => onSelect(image)}
            className="border-b border-rule last:border-b-0 hover:bg-rule/20 transition-colors duration-200 cursor-pointer">
            <td className="px-2 py-2 w-14">
                <img
                    src={image.url}
                    alt={image.name}
                    className="w-10 h-10 object-cover rounded-sm border border-rule"
                />
            </td>
            <td className="px-3 py-2 text-ink/80 text-sm truncate max-w-[160px] sm:max-w-[260px]">
                {image.name}
            </td>
            <td className="px-3 py-2 text-muted text-xs font-mono whitespace-nowrap hidden sm:table-cell">
                {formatDate(image.uploadedAt)}
            </td>
            <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-3 text-muted">
                    <button
                        onClick={copyLink}
                        title="Copy link"
                        className={`transition-colors duration-300 hover:text-accent ${copied ? "text-accent" : ""}`}>
                        <i
                            className={`bi ${copied ? "bi-check2" : "bi-clipboard"}`}
                        />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(image);
                        }}
                        title="Delete"
                        className="hover:text-red-600 transition-colors duration-300">
                        <i className="bi bi-trash" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function ImageListModal({ images, onClose, onSelect, onDelete, maxHeight }) {
    return (
        <div
            className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-paper border border-rule rounded-xl shadow-xl flex flex-col overflow-hidden"
                style={{ maxHeight: maxHeight ? `${maxHeight}px` : "80vh" }}
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-rule shrink-0">
                    <h2 className="font-display italic text-lg text-ink">
                        All images{" "}
                        <span className="font-sans not-italic text-muted text-sm">
                            ({images.length})
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-accent transition-colors duration-300">
                        <i className="bi bi-x-lg text-lg" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {images.length === 0 ? (
                        <div className="text-center py-16 text-muted">
                            <i className="bi bi-images text-3xl" />
                            <p className="mt-2 text-sm font-mono">
                                No images yet
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="sticky top-0 bg-paper border-b border-rule text-muted font-mono text-[10px] uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-2 w-14" />
                                    <th className="text-left font-semibold px-3 py-2">
                                        Name
                                    </th>
                                    <th className="text-left font-semibold px-3 py-2 hidden sm:table-cell">
                                        Uploaded
                                    </th>
                                    <th className="text-right font-semibold px-4 py-2">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map((img) => (
                                    <TableRow
                                        key={img.url}
                                        image={img}
                                        onSelect={onSelect}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
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
            <span className="w-16 shrink-0 font-mono text-[10px] tracking-wide text-muted uppercase">
                {label}
            </span>
            <code className="flex-1 truncate bg-paper border border-rule rounded-sm px-2 py-1.5 text-[11px] text-ink/80 font-mono">
                {value}
            </code>
            <button
                onClick={handleCopy}
                className={`shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-sm border transition-colors duration-300 ${
                    copied
                        ? "border-accent text-accent"
                        : "border-rule text-muted hover:text-ink hover:border-ink/30"
                }`}>
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
}

function ImageLightbox({ image, onClose, onDelete, maxHeight }) {
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
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={onClose}>
            <div
                className="max-w-3xl w-full bg-paper border border-rule rounded-xl shadow-xl flex flex-col items-center py-6 px-6 overflow-y-auto"
                style={{ maxHeight: maxHeight ? `${maxHeight}px` : "80vh" }}
                onClick={(e) => e.stopPropagation()}>
                <img
                    src={image.url}
                    alt={image.name}
                    className="max-h-[50vh] w-auto object-contain rounded-sm border border-rule"
                />

                <div className="w-full flex items-center justify-between mt-4 text-xs font-mono text-muted">
                    <span className="truncate">{image.name}</span>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                        <a
                            href={image.url}
                            download={image.name}
                            className="hover:text-accent transition-colors duration-300 flex items-center gap-1">
                            <i className="bi bi-download" /> Download
                        </a>
                        <button
                            onClick={() => onDelete(image)}
                            className="hover:text-red-600 transition-colors duration-300 flex items-center gap-1">
                            <i className="bi bi-trash" /> Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="hover:text-ink transition-colors duration-300 flex items-center gap-1">
                            <i className="bi bi-x-lg" /> Close
                        </button>
                    </div>
                </div>

                <div className="w-full mt-5 bg-rule/20 border border-rule rounded-sm p-4 space-y-2.5">
                    <p className="font-mono text-[10px] tracking-wide text-muted uppercase mb-1">
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
    const [listOpen, setListOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState("");
    const cardRef = useRef(null);
    const [cardHeight, setCardHeight] = useState(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const update = () => setCardHeight(el.offsetHeight);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

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
        setListOpen(false);
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
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="Vault Section">
            <div
                ref={cardRef}
                className="mx-auto w-full max-w-xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                <div className="text-center flex items-center justify-center gap-3">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Vault
                    </h2>
                    {authState === "in" && (
                        <span className="font-mono text-muted text-sm md:text-base">
                            {images.length}{" "}
                            {images.length === 1 ? "image" : "images"}
                        </span>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-rule">
                    {authState === "checking" && (
                        <div className="flex justify-center py-16">
                            <i className="bi bi-arrow-repeat animate-spin text-2xl text-muted" />
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
                                    className="font-mono text-xs uppercase tracking-wide text-muted hover:text-accent transition-colors duration-300 flex items-center gap-1">
                                    <i className="bi bi-box-arrow-right" /> Log
                                    out
                                </button>
                            </div>

                            <UploadZone onUploaded={handleUploaded} />

                            {error && (
                                <p className="font-mono text-xs text-red-600 mb-4">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={() => setListOpen(true)}
                                className="w-full flex items-center justify-center gap-2 bg-paper hover:border-accent hover:text-accent border border-rule rounded-sm py-3 font-mono text-xs uppercase tracking-wide text-ink transition-colors duration-300">
                                <i className="bi bi-collection" />
                                View images ({images.length})
                            </button>
                        </>
                    )}
                </div>
            </div>

            {listOpen && (
                <ImageListModal
                    images={images}
                    onClose={() => setListOpen(false)}
                    onSelect={setSelected}
                    onDelete={handleDelete}
                    maxHeight={cardHeight}
                />
            )}

            <ImageLightbox
                image={selected}
                onClose={() => setSelected(null)}
                onDelete={handleDelete}
                maxHeight={cardHeight}
            />
        </section>
    );
};
