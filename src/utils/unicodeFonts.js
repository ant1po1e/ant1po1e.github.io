const transformByOffset = (text, upperStart, lowerStart, digitStart = null) => {
    return [...text]
        .map((char) => {
            const code = char.charCodeAt(0);

            // A-Z
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(upperStart + (code - 65));
            }

            // a-z
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(lowerStart + (code - 97));
            }

            // 0-9
            if (digitStart !== null && code >= 48 && code <= 57) {
                return String.fromCodePoint(digitStart + (code - 48));
            }

            return char;
        })
        .join("");
};

/* =========================
   BOLD
========================= */

export const toBold = (text) =>
    transformByOffset(text, 0x1d400, 0x1d41a, 0x1d7ce);

/* =========================
   ITALIC
========================= */

export const toItalic = (text) => transformByOffset(text, 0x1d434, 0x1d44e);

/* =========================
   BOLD ITALIC
========================= */

export const toBoldItalic = (text) => transformByOffset(text, 0x1d468, 0x1d482);

/* =========================
   FULL WIDTH
========================= */

export const toFullWidth = (text) => {
    return [...text]
        .map((char) => {
            if (char === " ") return "　";

            const code = char.charCodeAt(0);

            if (code >= 33 && code <= 126) {
                return String.fromCharCode(code + 65248);
            }

            return char;
        })
        .join("");
};

/* =========================
   SMALL CAPS
========================= */

const SMALL_CAPS_MAP = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "s",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ",
};

export const toSmallCaps = (text) =>
    [...text]
        .map((char) => {
            const lower = char.toLowerCase();
            return SMALL_CAPS_MAP[lower] || char;
        })
        .join("");

/* =========================
   CIRCLED
========================= */

export const toCircled = (text) => {
    return [...text]
        .map((char) => {
            const code = char.charCodeAt(0);

            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x24b6 + (code - 65));
            }

            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x24d0 + (code - 97));
            }

            return char;
        })
        .join("");
};

/* =========================
   SCRIPT
========================= */

const SCRIPT_MAP = {
    A: "𝒜",
    B: "𝐵",
    C: "𝒞",
    D: "𝒟",
    E: "𝐸",
    F: "𝐹",
    G: "𝒢",
    H: "𝐻",
    I: "𝐼",
    J: "𝒥",
    K: "𝒦",
    L: "𝐿",
    M: "𝑀",
    N: "𝒩",
    O: "𝒪",
    P: "𝒫",
    Q: "𝒬",
    R: "𝑅",
    S: "𝒮",
    T: "𝒯",
    U: "𝒰",
    V: "𝒱",
    W: "𝒲",
    X: "𝒳",
    Y: "𝒴",
    Z: "𝒵",

    a: "𝒶",
    b: "𝒷",
    c: "𝒸",
    d: "𝒹",
    e: "𝑒",
    f: "𝒻",
    g: "𝑔",
    h: "𝒽",
    i: "𝒾",
    j: "𝒿",
    k: "𝓀",
    l: "𝓁",
    m: "𝓂",
    n: "𝓃",
    o: "𝑜",
    p: "𝓅",
    q: "𝓆",
    r: "𝓇",
    s: "𝓈",
    t: "𝓉",
    u: "𝓊",
    v: "𝓋",
    w: "𝓌",
    x: "𝓍",
    y: "𝓎",
    z: "𝓏",
};

export const toScript = (text) =>
    [...text].map((char) => SCRIPT_MAP[char] || char).join("");

/* =========================
   FRAKTUR
========================= */

export const toFraktur = (text) => transformByOffset(text, 0x1d56c, 0x1d586);

/* =========================
   MAIN API
========================= */

export const applyUnicodeFont = (text, font) => {
    switch (font) {
        case "bold":
            return toBold(text);

        case "italic":
            return toItalic(text);

        case "boldItalic":
            return toBoldItalic(text);

        case "script":
            return toScript(text);

        case "fraktur":
            return toFraktur(text);

        case "fullWidth":
            return toFullWidth(text);

        case "smallCaps":
            return toSmallCaps(text);

        case "circled":
            return toCircled(text);

        default:
            return text;
    }
};
