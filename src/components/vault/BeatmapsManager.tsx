import React, { useEffect, useState } from 'react';
import {
  fetchAdminBeatmaps,
  fetchBeatmapMeta,
  createBeatmap,
  deleteBeatmap,
  type AdminBeatmap,
} from '../../lib/vaultApi';
import { RefreshCw, Music, Wand2, Plus, Trash2, ExternalLink } from 'lucide-react';

// Keep in sync with BADGE_STYLE in src/pages/BeatmapsPage.tsx and
// KNOWN_BADGES in api/beatmaps.ts.
const KNOWN_BADGES = ['ranked', 'tournaments', 'contest', 'hs', 'collab', 'gd'];

export const BeatmapsManager: React.FC = () => {
  const [beatmaps, setBeatmaps] = useState<AdminBeatmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { beatmaps } = await fetchAdminBeatmaps();
      setBeatmaps(beatmaps);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFetchMeta = async () => {
    if (!link.trim() || fetchingMeta) return;
    setFetchingMeta(true);
    setError('');
    try {
      const meta = await fetchBeatmapMeta(link.trim());
      setTitle(meta.title);
      setArtist(meta.artist);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setFetchingMeta(false);
    }
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev => (prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim() || !title.trim() || !artist.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const { beatmap } = await createBeatmap({
        link: link.trim(),
        title: title.trim(),
        artist: artist.trim(),
        badges: selectedBadges,
      });
      setBeatmaps(prev => [beatmap, ...prev]);
      setLink('');
      setTitle('');
      setArtist('');
      setSelectedBadges([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBeatmap(id);
      setBeatmaps(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="https://osu.ppy.sh/beatmapsets/..."
            required
            className="flex-1 min-w-0 bg-black/60 border border-white/15 text-white text-xs font-mono px-3.5 py-2 rounded focus:outline-none focus:border-[#7B68EE] placeholder:text-white/20 transition-colors"
          />
          <button
            type="button"
            onClick={handleFetchMeta}
            disabled={!link.trim() || fetchingMeta}
            title="Fetch title & artist from osu!"
            className="shrink-0 flex items-center gap-1.5 px-3.5 h-9 rounded border border-white/15 font-mono text-[12px] uppercase tracking-wide text-white/70 hover:text-[#7B68EE] hover:border-[#7B68EE]/40 transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none"
          >
            {fetchingMeta ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Fetch</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="flex-1 min-w-0 bg-black/60 border border-white/15 text-white text-xs font-mono px-3.5 py-2 rounded focus:outline-none focus:border-[#7B68EE] placeholder:text-white/20 transition-colors"
          />
          <input
            type="text"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            placeholder="Artist"
            required
            className="flex-1 min-w-0 bg-black/60 border border-white/15 text-white text-xs font-mono px-3.5 py-2 rounded focus:outline-none focus:border-[#7B68EE] placeholder:text-white/20 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {KNOWN_BADGES.map(badge => (
            <button
              key={badge}
              type="button"
              onClick={() => toggleBadge(badge)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-colors border ${
                selectedBadges.includes(badge)
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10'
              }`}
            >
              {badge}
            </button>
          ))}

          <button
            type="submit"
            disabled={!link.trim() || !title.trim() || !artist.trim() || submitting}
            className="ml-auto shrink-0 flex items-center gap-1.5 px-3.5 h-8 rounded border border-white/15 font-mono text-[12px] uppercase tracking-wide text-white/70 hover:text-[#7B68EE] hover:border-[#7B68EE]/40 transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none"
          >
            {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add
          </button>
        </div>
      </form>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="w-6 h-6 text-white/30 animate-spin" />
        </div>
      ) : beatmaps.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <Music className="w-7 h-7 mx-auto" />
          <p className="mt-2 text-xs font-mono">No beatmaps yet</p>
        </div>
      ) : (
        <div className="border-t border-white/10 pt-3 max-h-[38vh] overflow-y-auto custom-scrollbar pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                <th className="pb-2 font-normal">Title</th>
                <th className="pb-2 font-normal">Artist</th>
                <th className="pb-2 font-normal w-8"></th>
              </tr>
            </thead>
            <tbody>
              {beatmaps.map(b => (
                <tr key={b.id} className="border-t border-white/5 group">
                  <td className="py-2 pr-2 max-w-[160px]">
                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-[12px] text-white/80 hover:text-[#7B68EE] transition-colors"
                    >
                      <span className="truncate">{b.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="py-2 pr-2 max-w-[120px]">
                    <span className="block truncate font-mono text-[12px] text-white/50">{b.artist}</span>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      title="Delete"
                      className="w-6 h-6 inline-flex items-center justify-center rounded border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/40 transition-colors duration-300 disabled:opacity-40"
                    >
                      {deletingId === b.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
