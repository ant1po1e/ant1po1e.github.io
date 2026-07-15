import React, { useState } from "react";
import { login } from "../lib/api.js";

export default function Login({ onSuccess }) {
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
        <div className="min-h-screen flex items-center justify-center px-6 bg-paper">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <span
                        className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"
                        aria-hidden="true"
                    />
                    <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                        Locked
                    </span>
                </div>

                <div className="bg-paper border border-rule rounded-xl p-8 shadow-xl">
                    <h1 className="font-display text-3xl italic text-ink mb-1">
                        Vault
                    </h1>
                    <p className="text-muted text-sm mb-6">
                        Private image archive. Enter the password to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-mono text-[11px] tracking-widest text-muted uppercase mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-paper border border-rule rounded-sm px-4 py-3 text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm font-mono">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-ink hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-paper font-mono text-xs uppercase tracking-wide rounded-sm py-3 transition-colors duration-300">
                            {loading ? "Checking…" : "Unlock Vault"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-muted text-xs font-mono mt-6">
                    Private access
                </p>
            </div>
        </div>
    );
}
