function calculate() {
    const desiredSnap = document.getElementById('desired-snap').value;
    const baseSnap = document.getElementById('base-snap').value;
    const bpm = document.getElementById('bpm').value;

    if (bpm && desiredSnap && baseSnap) {
        const result = (bpm * desiredSnap) / baseSnap;
        document.getElementById('result').textContent = result.toFixed(2) + ' BPM';
    } else {
        alert('Please fill in all fields!');
    }
}

function generateBBCode() {
    let text = document.getElementById('text').value;
    let effect = document.getElementById('effect').value;
    let startColor = document.getElementById('startColor').value;
    let middleColor = document.getElementById('middleColor').value;
    let endColor = document.getElementById('endColor').value;
    let font = document.getElementById('font').value;
    let size = document.getElementById('size').value;
    let bold = document.getElementById('bold').checked;
    let italic = document.getElementById('italic').checked;

    let code = '';
    if (effect === 'horizontal') {
        code = applyGradient(text, startColor, endColor);
    } else if (effect === 'three-color') {
        code = applyThreeColorGradient(text, startColor, middleColor, endColor);
    } else if (effect === 'solid') {
        code = `[color=${startColor}]${text}[/color]`;
    }

    if (font !== 'Default') code = `[font=${font}]${code}[/font]`;
    if (size !== 'Default') code = `[size=${size}]${code}[/size]`;
    if (bold) code = `[b]${code}[/b]`;
    if (italic) code = `[i]${code}[/i]`;

    document.getElementById('bbcode').value = code;
    updatePreview(code);
}

function applyGradient(text, startColor, endColor) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let color = interpolateColor(startColor, endColor, i / (text.length - 1));
        result += `[color=${color}]${text[i]}[/color]`;
    }
    return result;
}

function applyThreeColorGradient(text, startColor, middleColor, endColor) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let color;
        if (i < text.length / 2) {
            color = interpolateColor(startColor, middleColor, i / (text.length / 2 - 1));
        } else {
            color = interpolateColor(middleColor, endColor, (i - text.length / 2) / (text.length / 2 - 1));
        }
        result += `[color=${color}]${text[i]}[/color]`;
    }
    return result;
}

function interpolateColor(color1, color2, factor) {
    let result = "#";
    for (let i = 1; i <= 3; i++) {
        let c1 = parseInt(color1.substr(i*2-1, 2), 16);
        let c2 = parseInt(color2.substr(i*2-1, 2), 16);
        let c = Math.round(c1 + factor * (c2 - c1));
        result += c.toString(16).padStart(2, '0');
    }
    return result;
}

function updatePreview(bbcode) {
    let preview = bbcode
        .replace(/\[color=(#[A-Fa-f0-9]{6})\]/g, '<span style="color: $1">')
        .replace(/\[\/color\]/g, '</span>')
        .replace(/\[font=([^\]]+)\]/g, '<span style="font-family: $1">')
        .replace(/\[\/font\]/g, '</span>')
        .replace(/\[size=([^\]]+)\]/g, `<span style="font-size: 25px">`)
        .replace(/\[\/size\]/g, '</span>')
        .replace(/\[b\]/g, '<strong>')
        .replace(/\[\/b\]/g, '</strong>')
        .replace(/\[i\]/g, '<em>')
        .replace(/\[\/i\]/g, '</em>');

    document.getElementById('preview').innerHTML = preview;
}

function updateColorInputs() {
    let effect = document.getElementById('effect').value;
    document.getElementById('middleColor').style.display = 
        (effect === 'three-color') ? 'inline' : 'none';
    document.getElementById('endColor').style.display = 
        (effect !== 'solid') ? 'inline' : 'none';
}

// Add event listeners
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', generateBBCode);
});
document.getElementById('effect').addEventListener('change', () => {
    updateColorInputs();
    generateBBCode();
});

// Initial generation
updateColorInputs();
generateBBCode();