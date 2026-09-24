import { toUnicodeFont, type UnicodeFontKey } from './unicodeFonts';

export type BBCodeEffect = 'horizontal' | 'three-color' | 'solid';

interface GenerateBBCodeOptions {
  text: string;
  effect: BBCodeEffect;
  startColor: string;
  middleColor: string;
  endColor: string;
  font: UnicodeFontKey;
  size: string; // "None" | "50" | "85" | "100" | "150"
  bold: boolean;
  italic: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const value = parseInt(full, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(start: string, end: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(start);
  const [r2, g2, b2] = hexToRgb(end);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export function generateBBCode(opts: GenerateBBCodeOptions): string {
  const { text, effect, startColor, middleColor, endColor, font, size, bold, italic } = opts;
  if (!text) return '';

  const transformed = toUnicodeFont(text, font);
  const chars = Array.from(transformed);
  const n = chars.length;

  const colored = chars
    .map((ch, i) => {
      if (ch.trim() === '') return ch; // don't wrap whitespace in color tags

      let color: string;
      if (effect === 'solid' || n <= 1) {
        color = startColor;
      } else if (effect === 'three-color') {
        const t = i / (n - 1);
        color = t <= 0.5
          ? interpolateColor(startColor, middleColor, t / 0.5)
          : interpolateColor(middleColor, endColor, (t - 0.5) / 0.5);
      } else {
        const t = i / (n - 1);
        color = interpolateColor(startColor, endColor, t);
      }

      return `[color=${color}]${ch}[/color]`;
    })
    .join('');

  let result = colored;
  if (italic) result = `[i]${result}[/i]`;
  if (bold) result = `[b]${result}[/b]`;
  if (size !== 'None') result = `[size=${size}]${result}[/size]`;

  return result;
}

// Converts the BBCode this module generates into an HTML preview. Since the
// tag vocabulary here is fully controlled (only color/size/b/i, always
// well-nested), a straight sequential tag swap is safe — no need for a real
// BBCode parser.
export function generatePreviewHTML(bbcode: string): string {
  return bbcode
    .replace(/\[color=(#[0-9a-fA-F]{6})\]/g, '<span style="color:$1">')
    .replace(/\[\/color\]/g, '</span>')
    .replace(/\[size=(\d+)\]/g, '<span style="font-size:$1%">')
    .replace(/\[\/size\]/g, '</span>')
    .replace(/\[b\]/g, '<strong>')
    .replace(/\[\/b\]/g, '</strong>')
    .replace(/\[i\]/g, '<em>')
    .replace(/\[\/i\]/g, '</em>');
}
