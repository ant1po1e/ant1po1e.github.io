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
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="w-2 h-2 rounded-full bg-vault-safelight safelight-dot" />
                    <span className="font-mono text-xs tracking-[0.3em] text-vault-mute uppercase">
                        Locked
                    </span>
                </div>

                <div className="bg-vault-panel border border-vault-hairline rounded-2xl p-8 shadow-glow">
                    <h1 className="font-display text-3xl italic text-vault-ink mb-1">
                        Vault
                    </h1>
                    <p className="text-vault-mute text-sm mb-6">
                        Private image archive. Enter the password to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-mono text-[11px] tracking-widest text-vault-mute uppercase mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-vault-panel2 border border-vault-hairline rounded-lg px-4 py-3 text-vault-ink placeholder:text-vault-mute/60 focus:outline-none focus:ring-2 focus:ring-vault-safelight/60 focus:border-vault-safelight transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-vault-safelight text-sm font-mono">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-vault-safelight hover:bg-vault-safelight/90 disabled:opacity-50 disabled:cursor-not-allowed text-vault-bg font-semibold rounded-lg py-3 transition">
                            {loading ? "Checking…" : "Unlock Vault"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-vault-mute/60 text-xs font-mono mt-6">
                    Private access
                </p>
            </div>
        </div>
    );
}
