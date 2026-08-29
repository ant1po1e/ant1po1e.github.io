import { useCallback, useEffect, useState } from 'react';

export interface ContributedBeatmapSet {
  link: string;
  title: string;
  artist: string;
  badges?: string[];
}

// Vite only exposes env vars prefixed with VITE_ to client-side code.
// Configure this in .env (copy from .env.example) with your Google Apps
// Script Web App URL — the same spreadsheet feed used by the reference
// Next.js implementation, fetched here directly from the browser instead
// of through a server API route (this project is a static Vite SPA).
const FEED_URL = import.meta.env.VITE_BEATMAP_FEED_URL;

export function useContributedBeatmaps() {
  const [beatmaps, setBeatmaps] = useState<ContributedBeatmapSet[]>([]);
  const [loading, setLoading] = useState<boolean>(!!FEED_URL);
  const [error, setError] = useState<string | null>(null);

  const fetchBeatmaps = useCallback(async () => {
    if (!FEED_URL) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(FEED_URL);
      if (!res.ok) throw new Error('Fetch failed');
      const data: ContributedBeatmapSet[] = await res.json();

      const sorted = [...data].sort(
        (a, b) => (b.badges?.length || 0) - (a.badges?.length || 0)
      );

      setBeatmaps(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to load contributed beatmaps. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBeatmaps();
  }, [fetchBeatmaps]);

  return {
    beatmaps,
    loading,
    error,
    refetch: fetchBeatmaps,
    // Whether VITE_BEATMAP_FEED_URL is set at all — lets the UI hide the
    // whole section gracefully instead of showing a permanent error.
    configured: !!FEED_URL,
  };
}

export function extractBeatmapsetId(link: string): string {
  const parts = link.split('/beatmapsets/');
  return parts[1]?.split('/')[0] || '';
}
