import React, { useState } from 'react';
import { login } from '../../lib/vaultApi';
import { Lock } from 'lucide-react';

export const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-14 text-center">
      <Lock className="w-8 h-8 text-white/30 mx-auto mb-3" />
      <p className="text-white/50 text-xs font-mono mb-6 leading-relaxed">
        This vault is private. Enter the password to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full text-center bg-black/60 border border-white/15 text-white text-sm px-4 py-2.5 rounded focus:outline-none focus:border-[#7B68EE] placeholder:text-white/20 transition-colors font-mono"
        />
        {error && <p className="font-mono text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}

          className="px-6 py-2.5 rounded bg-white hover:bg-white/90 text-black text-xs font-mono font-semibold uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
};
