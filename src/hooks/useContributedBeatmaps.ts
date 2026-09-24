import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface ContributedBeatmapSet {
  link: string;
  title: string;
  artist: string;
  badges?: string[];
}

// Reads the contributed-beatmaps list straight from the public `beatmaps`
// table (see supabase/schema.sql) using the anon key — Row Level Security
// on that table only allows SELECT, so this is safe to call from the
// browser. Replaces the old Google Apps Script spreadsheet feed.
export function useContributedBeatmaps() {
  const [beatmaps, setBeatmaps] = useState<ContributedBeatmapSet[]>([]);
  const [loading, setLoading] = useState<boolean>(!!supabase);
  const [error, setError] = useState<string | null>(null);

  const fetchBeatmaps = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('beatmaps')
        .select('link, title, artist, badges')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const sorted = [...(data || [])].sort(
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
    // Whether Supabase env vars are configured at all — lets the UI hide
    // the whole section gracefully instead of showing a permanent error.
    configured: !!supabase,
  };
}

export function extractBeatmapsetId(link: string): string {
  const parts = link.split('/beatmapsets/');
  return parts[1]?.split('/')[0] || '';
}
