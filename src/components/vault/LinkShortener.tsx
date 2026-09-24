import React, { useEffect, useState } from 'react';
import {
  fetchShortLinks,
  createShortLink,
  deleteShortLink,
  toShortUrl,
  type ShortLink,
} from '../../lib/vaultApi';
import { RefreshCw, Link2, Copy, Check, Trash2, ExternalLink } from 'lucide-react';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable/denied — silently ignore, the user can
      // still select-and-copy the text manually.
    }
  };

  return (
    <button
      onClick={copy}
      title="Copy short link"
      className={`shrink-0 w-7 h-7 flex items-center justify-center rounded border border-white/10 transition-colors duration-300 ${
        copied ? 'text-[#52B788] border-[#52B788]/40' : 'text-white/40 hover:text-[#7B68EE] hover:border-[#7B68EE]/40'
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

export const LinkShortener: React.FC = () => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { links } = await fetchShortLinks();
      setLinks(links);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const { link } = await createShortLink(longUrl.trim());
      setLinks(prev => [link, ...prev]);
      setLongUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    try {
      await deleteShortLink(slug);
      setLinks(prev => prev.filter(l => l.slug !== slug));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <input
          type="url"
          value={longUrl}
          onChange={e => setLongUrl(e.target.value)}
          placeholder="https://example.com/a-very-long-link..."
          required
          className="flex-1 min-w-0 bg-black/60 border border-white/15 text-white text-xs font-mono px-3.5 py-2 rounded focus:outline-none focus:border-[#7B68EE] placeholder:text-white/20 transition-colors"
        />
        <button
          type="submit"
          disabled={submitting || !longUrl.trim()}
          title="Shorten"
          className="shrink-0 flex items-center gap-1.5 px-3.5 h-9 rounded border border-white/15 font-mono text-[12px] uppercase tracking-wide text-white/70 hover:text-[#7B68EE] hover:border-[#7B68EE]/40 transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none"
        >
          {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Shorten</span>
        </button>
        <button
          type="button"
          onClick={load}
          title="Refresh"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded border border-white/15 text-white/40 hover:text-[#7B68EE] hover:border-[#7B68EE]/40 transition-colors duration-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </form>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="w-6 h-6 text-white/30 animate-spin" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <Link2 className="w-7 h-7 mx-auto" />
          <p className="mt-2 text-xs font-mono">No short links yet</p>
        </div>
      ) : (
        <div className="border-t border-white/10 pt-3 max-h-[42vh] overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {links.map(link => {
            const shortUrl = toShortUrl(link.slug);
            return (
              <div
                key={link.slug}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[13px] text-[#7B68EE] hover:underline truncate"
                  >
                    {shortUrl.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <div className="ml-auto flex items-center gap-1.5 shrink-0">
                    <CopyButton text={shortUrl} />
                    <button
                      onClick={() => handleDelete(link.slug)}
                      disabled={deletingSlug === link.slug}
                      title="Delete"
                      className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/40 transition-colors duration-300 disabled:opacity-40"
                    >
                      {deletingSlug === link.slug ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="font-mono text-[11px] text-white/40 truncate">{link.url}</p>

                <div className="flex items-center gap-3 font-mono text-[10px] text-white/30 pt-1">
                  <span>{formatDate(link.createdAt)}</span>
                  <span>&middot;</span>
                  <span>{link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
