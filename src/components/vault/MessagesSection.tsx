import React, { useEffect, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { fetchMessages, type AnonMessage } from '../../lib/vaultApi';
import { RefreshCw, MessageSquare, Quote, Clock, Download } from 'lucide-react';

const EXPORT_WIDTH = 1080;
const EXPORT_SCALE = 1.7;

function formatDate(iso: string | null) {
  if (!iso) return 'Unknown date';
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

const CardFace: React.FC<{ message: AnonMessage; scale?: number }> = ({ message, scale = 1 }) => {
  const px = (n: number) => `${n * scale}px`;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#111114] shadow-sm overflow-hidden" style={{ padding: px(24) }}>
      <Quote className="absolute text-white/10" style={{ top: px(20), right: px(20), width: px(26), height: px(26) }} />

      <div className="flex items-center gap-2" style={{ marginBottom: px(14), paddingRight: px(44) }}>
        <span className="font-display uppercase tracking-wide text-white truncate" style={{ fontSize: px(17) }}>
          ASK ME SOMETHING!
        </span>
      </div>

      <p className="font-sans text-white/80 whitespace-pre-wrap break-words" style={{ fontSize: px(15), lineHeight: 1.6 }}>
        {message.message || <span className="text-white/30 italic">(no message content)</span>}
      </p>

      <div className="border-t border-white/10 flex items-center gap-1.5 text-white/40" style={{ marginTop: px(18), paddingTop: px(12) }}>
        <Clock style={{ width: px(11), height: px(11) }} />
        <span className="font-mono" style={{ fontSize: px(11) }}>{formatDate(message.timestamp)}</span>
      </div>
    </div>
  );
};

const MessageCard: React.FC<{ message: AnonMessage }> = ({ message }) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadCard = async () => {
    if (!exportRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toJpeg(exportRef.current, { cacheBust: true, pixelRatio: 2, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `message-${message.id}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative">
      <CardFace message={message} />

      <button
        onClick={downloadCard}
        disabled={downloading}
        title="Download as JPG"
        className={`absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm border border-white/10 transition-colors duration-300 hover:text-[#7B68EE] hover:border-[#7B68EE]/40 disabled:opacity-50 ${
          downloading ? 'text-[#7B68EE]' : 'text-white/40'
        }`}
      >
        {downloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      </button>

      {/* Off-screen higher-res render used for the actual JPG export */}
      <div aria-hidden="true" style={{ position: 'fixed', left: '-99999px', top: 0 }}>
        <div
          ref={exportRef}
          style={{
            width: `${EXPORT_WIDTH}px`,
            padding: '90px 80px',
            boxSizing: 'border-box',
            background:
              'radial-gradient(circle at 15% 15%, rgba(123,104,238,0.35), transparent 55%), radial-gradient(circle at 85% 90%, rgba(139,133,119,0.25), transparent 55%), linear-gradient(150deg, #050505, #16132b 65%, #050505)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '36px',
          }}
        >
          <div style={{ width: '100%' }}>
            <CardFace message={message} scale={EXPORT_SCALE} />
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '2px', color: 'rgba(245,245,245,0.3)', margin: 0 }}>
            antipole
          </p>
        </div>
      </div>
    </div>
  );
};

export const MessagesSection: React.FC = () => {
  const [messages, setMessages] = useState<AnonMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { messages } = await fetchMessages();
      setMessages(messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = messages.filter(m => {
    if (!query.trim()) return true;
    return m.message.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search messages..."
          className="flex-1 bg-black/60 border border-white/15 text-white text-xs font-mono px-3.5 py-2 rounded focus:outline-none focus:border-[#7B68EE] placeholder:text-white/20 transition-colors"
        />
        <button
          onClick={load}
          title="Refresh"

          className="shrink-0 w-9 h-9 flex items-center justify-center rounded border border-white/15 text-white/40 hover:text-[#7B68EE] hover:border-[#7B68EE]/40 transition-colors duration-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="w-6 h-6 text-white/30 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <MessageSquare className="w-7 h-7 mx-auto" />
          <p className="mt-2 text-xs font-mono">{messages.length === 0 ? 'No messages yet' : 'No messages match your search'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto custom-scrollbar pr-1 border-t border-white/10 pt-3">
          {filtered.map(message => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};
