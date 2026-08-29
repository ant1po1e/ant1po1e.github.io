export type UnicodeFontKey =
  | 'None'
  | 'bold'
  | 'italic'
  | 'boldItalic'
  | 'script'
  | 'fraktur'
  | 'fullWidth'
  | 'smallCaps'
  | 'circled';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';

// Builds a map from the Unicode "Mathematical Alphanumeric Symbols" block,
// which runs in contiguous A-Z / a-z / 0-9 code point ranges for most styles.
function buildOffsetMap(startUpper: number, startLower: number, startDigit: number | null): Record<string, string> {
  const map: Record<string, string> = {};
  UPPER.split('').forEach((c, i) => (map[c] = String.fromCodePoint(startUpper + i)));
  LOWER.split('').forEach((c, i) => (map[c] = String.fromCodePoint(startLower + i)));
  if (startDigit !== null) {
    DIGITS.split('').forEach((c, i) => (map[c] = String.fromCodePoint(startDigit + i)));
  }
  return map;
}

const BOLD_MAP = buildOffsetMap(0x1d400, 0x1d41a, 0x1d7ce);

// Mathematical Italic has one legacy exception: italic "h" reuses the
// pre-existing Planck constant symbol instead of a dedicated code point.
const ITALIC_MAP: Record<string, string> = { ...buildOffsetMap(0x1d434, 0x1d44e, null), h: '\u210e' };

const BOLD_ITALIC_MAP = buildOffsetMap(0x1d468, 0x1d482, null);

const FULLWIDTH_MAP = buildOffsetMap(0xff21, 0xff41, 0xff10);

// Circled Latin letters + circled digits (digits are not contiguous with letters).
const CIRCLED_MAP: Record<string, string> = {
  ...buildOffsetMap(0x24b6, 0x24d0, null),
  '0': '\u24ea',
  '1': '\u2460',
  '2': '\u2461',
  '3': '\u2462',
  '4': '\u2463',
  '5': '\u2464',
  '6': '\u2465',
  '7': '\u2466',
  '8': '\u2467',
  '9': '\u2468',
};

// Mathematical Script is missing several code points that instead reuse
// older "Letterlike Symbols" characters (a known quirk of this Unicode block).
const SCRIPT_EXCEPTIONS: Record<string, string> = {
  E: '\u2130',
  F: '\u2131',
  H: '\u210b',
  I: '\u2110',
  L: '\u2112',
  M: '\u2133',
  R: '\u211b',
  e: '\u212f',
  g: '\u210a',
  o: '\u2134',
};
const SCRIPT_MAP: Record<string, string> = { ...buildOffsetMap(0x1d49c, 0x1d4b6, null), ...SCRIPT_EXCEPTIONS };

// Mathematical Fraktur has the same kind of legacy exceptions.
const FRAKTUR_EXCEPTIONS: Record<string, string> = {
  C: '\u212d',
  H: '\u210c',
  I: '\u2111',
  R: '\u211c',
  Z: '\u2128',
};
const FRAKTUR_MAP: Record<string, string> = { ...buildOffsetMap(0x1d504, 0x1d51e, null), ...FRAKTUR_EXCEPTIONS };

// Small Caps isn't a contiguous Unicode block — letters are scattered across
// Latin Extended / IPA Extensions, and a few (q, s, x) have no dedicated
// small-caps glyph, so they fall back to their normal lowercase form.
const SMALL_CAPS_MAP: Record<string, string> = {
  a: '\u1d00', b: '\u0299', c: '\u1d04', d: '\u1d05', e: '\u1d07', f: '\ua730',
  g: '\u0262', h: '\u029c', i: '\u026a', j: '\u1d0a', k: '\u1d0b', l: '\u029f',
  m: '\u1d0d', n: '\u0274', o: '\u1d0f', p: '\u1d18', q: 'q', r: '\u0280',
  s: 's', t: '\u1d1b', u: '\u1d1c', v: '\u1d20', w: '\u1d21', x: 'x',
  y: '\u028f', z: '\u1d22',
};

const FONT_MAPS: Partial<Record<UnicodeFontKey, Record<string, string>>> = {
  bold: BOLD_MAP,
  italic: ITALIC_MAP,
  boldItalic: BOLD_ITALIC_MAP,
  script: SCRIPT_MAP,
  fraktur: FRAKTUR_MAP,
  fullWidth: FULLWIDTH_MAP,
  smallCaps: SMALL_CAPS_MAP,
  circled: CIRCLED_MAP,
};

export function toUnicodeFont(text: string, font: UnicodeFontKey): string {
  if (font === 'None') return text;
  const map = FONT_MAPS[font];
  if (!map) return text;

  return Array.from(text)
    .map(ch => {
      if (font === 'fullWidth' && ch === ' ') return '\u3000'; // ideographic space
      return map[ch] ?? ch;
    })
    .join('');
}
