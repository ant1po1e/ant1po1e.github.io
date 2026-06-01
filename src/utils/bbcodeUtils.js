import { applyUnicodeFont } from "./unicodeFonts";

/* =====================================
   COLOR HELPERS
===================================== */

export const interpolateColor = (color1, color2, factor) => {
    let result = "#";

    for (let i = 1; i <= 3; i++) {
        const c1 = parseInt(color1.substr(i * 2 - 1, 2), 16);

        const c2 = parseInt(color2.substr(i * 2 - 1, 2), 16);

        const c = Math.round(c1 + factor * (c2 - c1));

        result += c.toString(16).padStart(2, "0");
    }

    return result.toUpperCase();
};

/* =====================================
   GRADIENTS
===================================== */

export const applyGradient = (text, startColor, endColor) => {
    if (!text.length) return "";

    if (text.length === 1) {
        return `[color=${startColor}]${text}[/color]`;
    }

    let result = "";

    [...text].forEach((char, index) => {
        const factor = index / (text.length - 1);

        const color = interpolateColor(startColor, endColor, factor);

        result += `[color=${color}]${char}[/color]`;
    });

    return result;
};

export const applyThreeColorGradient = (
    text,
    startColor,
    middleColor,
    endColor,
) => {
    if (!text.length) return "";

    if (text.length === 1) {
        return `[color=${startColor}]${text}[/color]`;
    }

    let result = "";

    const midpoint = Math.floor(text.length / 2);

    [...text].forEach((char, index) => {
        let color;

        if (index <= midpoint) {
            const factor = midpoint === 0 ? 0 : index / midpoint;

            color = interpolateColor(startColor, middleColor, factor);
        } else {
            const factor = (index - midpoint) / (text.length - midpoint - 1);

            color = interpolateColor(middleColor, endColor, factor);
        }

        result += `[color=${color}]${char}[/color]`;
    });

    return result;
};

/* =====================================
   PREVIEW
===================================== */

export const generatePreviewHTML = (bbcode) => {
    const pxMap = {
        50: "12px",
        85: "14px",
        100: "16px",
        150: "22px",
    };

    return bbcode
        .replace(/\[color=(#[A-Fa-f0-9]{6})\]/g, '<span style="color:$1">')

        .replace(/\[\/color\]/g, "</span>")

        .replace(
            /\[size=(\d+)\]/g,
            (_, size) => `<span style="font-size:${pxMap[size] || "16px"}">`,
        )

        .replace(/\[\/size\]/g, "</span>")

        .replace(/\[b\]/g, "<strong>")

        .replace(/\[\/b\]/g, "</strong>")

        .replace(/\[i\]/g, "<em>")

        .replace(/\[\/i\]/g, "</em>");
};

/* =====================================
   BBCODE GENERATOR
===================================== */

export const generateBBCode = ({
    text,
    effect,
    startColor,
    middleColor,
    endColor,
    font,
    size,
    bold,
    italic,
}) => {
    let processedText = applyUnicodeFont(text, font);

    let code = "";

    switch (effect) {
        case "horizontal":
            code = applyGradient(processedText, startColor, endColor);
            break;

        case "three-color":
            code = applyThreeColorGradient(
                processedText,
                startColor,
                middleColor,
                endColor,
            );
            break;

        case "solid":
            code = `[color=${startColor}]${processedText}[/color]`;
            break;

        default:
            code = processedText;
    }

    if (size !== "None") {
        code = `[size=${size}]${code}[/size]`;
    }

    if (bold) {
        code = `[b]${code}[/b]`;
    }

    if (italic) {
        code = `[i]${code}[/i]`;
    }

    return code;
};
