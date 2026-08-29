import { FileText, FileArchive, FileSpreadsheet, Presentation, FileVideo, FileAudio, File as FileIcon, type LucideIcon } from 'lucide-react';

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'tiff', 'avif']);
const VIDEO_EXTS = new Set(['mp4', 'webm', 'mov', 'mkv', 'm4v']);
const AUDIO_EXTS = new Set(['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac']);

const FILE_ICONS: Record<string, LucideIcon> = {
  pdf: FileText,
  zip: FileArchive,
  rar: FileArchive,
  '7z': FileArchive,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  ppt: Presentation,
  pptx: Presentation,
  txt: FileText,
  md: FileText,
  csv: FileSpreadsheet,
};

export function extOf(name: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(name || '');
  return match ? match[1].toLowerCase() : '';
}

export type FileKind = 'image' | 'video' | 'audio' | 'other';

export function fileKind(name: string): FileKind {
  const ext = extOf(name);
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (VIDEO_EXTS.has(ext)) return 'video';
  if (AUDIO_EXTS.has(ext)) return 'audio';
  return 'other';
}

export function fileIconComponent(name: string): LucideIcon {
  const ext = extOf(name);
  if (VIDEO_EXTS.has(ext)) return FileVideo;
  if (AUDIO_EXTS.has(ext)) return FileAudio;
  return FILE_ICONS[ext] || FileIcon;
}
