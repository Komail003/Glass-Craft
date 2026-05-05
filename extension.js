const vscode = require('vscode');

function activate(context) {
    const disposable = vscode.commands.registerCommand('glasscraft.open', () => {
        const panel = vscode.window.createWebviewPanel(
            'glasscraft',
            'GlassCraft Pro',
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        panel.webview.html = getWebview();

        panel.webview.onDidReceiveMessage((msg) => {
            if (msg.command === 'copy') {
                vscode.env.clipboard.writeText(msg.text);
                vscode.window.showInformationMessage('Copied!');
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebview() {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
    :root {
        --bg-aurora: radial-gradient(circle at top left, rgba(255, 140, 105, 0.35), transparent 30%),
                     radial-gradient(circle at top right, rgba(72, 166, 255, 0.28), transparent 35%),
                     linear-gradient(135deg, #111827, #0b1020);
        --bg-ocean: radial-gradient(circle at top left, rgba(0, 240, 255, 0.22), transparent 30%),
                    radial-gradient(circle at bottom right, rgba(255, 0, 153, 0.18), transparent 35%),
                    linear-gradient(135deg, #06121f, #0f172a);
        --bg-slate: linear-gradient(135deg, #1f2937, #111827);
        --bg-night: radial-gradient(circle at 20% 20%, rgba(122, 92, 255, 0.3), transparent 30%),
                    radial-gradient(circle at 80% 30%, rgba(0, 200, 255, 0.18), transparent 35%),
                    linear-gradient(135deg, #0b1020, #111827);
        --bg-light: linear-gradient(135deg, #d9e2ec, #f1f5f9);
    }

    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 20px;
        font-family: Arial, sans-serif;
        background: #1e1e1e;
        color: #fff;
    }

    h2 {
        margin: 0 0 10px;
        font-size: 24px;
    }

    .status {
        margin: 0 0 14px;
        font-size: 12px;
        opacity: 0.75;
    }

    .layout {
        display: grid;
        grid-template-columns: minmax(280px, 420px) minmax(320px, 1fr);
        gap: 24px;
        align-items: start;
    }

    .preview-shell,
    .controls {
        border-radius: 20px;
        padding: 16px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
    }

    .stage {
        min-height: 420px;
        border-radius: 18px;
        position: relative;
        overflow: hidden;
        background: var(--bg-aurora);
        display: grid;
        place-items: center;
        perspective: 1400px;
        border: 1px solid rgba(255,255,255,0.08);
    }

    .stage-label {
        position: absolute;
        left: 16px;
        top: 14px;
        font-size: 12px;
        opacity: 0.8;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .card {
        width: 260px;
        height: 260px;
        border-radius: 24px;
        position: relative;
        overflow: hidden;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 18px;
        transition: transform 0.12s ease, background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease;
        will-change: transform;
        border: 1px solid rgba(255,255,255,0.2);
    }

    .card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.22), transparent 45%, rgba(255,255,255,0.06));
        pointer-events: none;
    }

    .card-content {
        position: relative;
        z-index: 1;
    }

    .card h3 {
        margin: 0;
        font-size: 22px;
    }

    .card p {
        margin: 8px 0 0;
        opacity: 0.85;
        line-height: 1.45;
    }

    .controls {
        display: grid;
        gap: 14px;
    }

    .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .field {
        display: grid;
        gap: 6px;
    }

    label {
        font-size: 13px;
        opacity: 0.92;
    }

    select, input[type="range"], button {
        width: 100%;
    }

    select {
        background: #111827;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.14);
        padding: 10px 12px;
        border-radius: 10px;
        outline: none;
    }

    input[type="range"] {
        accent-color: #ff6b35;
    }

    .value {
        font-size: 12px;
        opacity: 0.75;
    }

    .toggle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        user-select: none;
    }

    .toggle-row input {
        width: auto;
    }

    .buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    button {
        background: #ff6b35;
        color: #fff;
        border: none;
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
    }

    button.secondary {
        background: #2a2f3a;
    }

    button:hover {
        filter: brightness(1.05);
    }

    .section-title {
        margin: 2px 0 -2px;
        font-size: 12px;
        opacity: 0.7;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    pre {
        margin: 0;
        padding: 12px;
        border-radius: 14px;
        background: #0b0f17;
        border: 1px solid rgba(255,255,255,0.08);
        color: #d8e1f0;
        white-space: pre-wrap;
        word-break: break-word;
        min-height: 140px;
        overflow: auto;
        line-height: 1.5;
    }

    .hidden {
        display: none !important;
    }

    @media (max-width: 980px) {
        .layout {
            grid-template-columns: 1fr;
        }

        .stage {
            min-height: 360px;
        }
    }
</style>
</head>
<body>
    <h2>GlassCraft Pro</h2>
    <div class="status" id="status">Webview loading...</div>

    <div class="layout">
        <div class="preview-shell">
            <div id="stage" class="stage">
                <div class="stage-label" id="stageLabel">Background Preview</div>
                <div id="card" class="card">
                    <div class="card-content">
                        <h3 id="cardTitle">GlassCraft</h3>
                        <p id="cardText">Use the controls to generate glass, neumorphism, or 3D styles.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="controls">
            <div class="grid-2">
                <div class="field">
                    <label for="mode">Mode</label>
                    <select id="mode">
                        <option value="glass">Glass</option>
                        <option value="neo">Neumorphism</option>
                        <option value="3d">3D Glass</option>
                    </select>
                </div>

                <div class="field">
                    <label for="preset">Preset</label>
                    <select id="preset">
                        <option value="default">Default</option>
                        <option value="soft">Soft</option>
                        <option value="strong">Strong</option>
                        <option value="neon">Neon</option>
                        <option value="minimal">Minimal</option>
                        <option value="floating">Floating</option>
                    </select>
                </div>
            </div>

            <div class="field">
                <label for="background">Background</label>
                <select id="background">
                    <option value="aurora">Aurora</option>
                    <option value="ocean">Ocean</option>
                    <option value="slate">Slate</option>
                    <option value="night">Night</option>
                    <option value="light">Light</option>
                </select>
            </div>

            <div class="field">
                <label for="blur">Blur <span class="value" id="blurValue"></span></label>
                <input id="blur" type="range" min="0" max="40" value="22">
            </div>

            <div class="field">
                <label for="opacity">Opacity <span class="value" id="opacityValue"></span></label>
                <input id="opacity" type="range" min="0" max="1" step="0.01" value="0.13">
            </div>

            <div class="field">
                <label for="glow">Glow <span class="value" id="glowValue"></span></label>
                <input id="glow" type="range" min="0" max="80" value="26">
            </div>

            <div class="field">
                <label for="borderWidth">Border Width <span class="value" id="borderWidthValue"></span></label>
                <input id="borderWidth" type="range" min="0" max="8" value="1">
            </div>

            <div class="field">
                <label for="shadowX">Shadow X <span class="value" id="shadowXValue"></span></label>
                <input id="shadowX" type="range" min="-40" max="40" value="0">
            </div>

            <div class="field">
                <label for="shadowY">Shadow Y <span class="value" id="shadowYValue"></span></label>
                <input id="shadowY" type="range" min="-40" max="40" value="10">
            </div>

            <div class="field">
                <label for="shadowBlur">Shadow Blur <span class="value" id="shadowBlurValue"></span></label>
                <input id="shadowBlur" type="range" min="0" max="100" value="30">
            </div>

            <div class="field">
                <label for="shadowSpread">Shadow Spread <span class="value" id="shadowSpreadValue"></span></label>
                <input id="shadowSpread" type="range" min="-30" max="30" value="0">
            </div>

            <div class="field">
                <label for="radius">Radius <span class="value" id="radiusValue"></span></label>
                <input id="radius" type="range" min="0" max="60" value="24">
            </div>

            <div id="threeDPanel" class="grid-2">
                <div class="field">
                    <label for="rotateX">Rotate X <span class="value" id="rotateXValue"></span></label>
                    <input id="rotateX" type="range" min="-35" max="35" value="0">
                </div>

                <div class="field">
                    <label for="rotateY">Rotate Y <span class="value" id="rotateYValue"></span></label>
                    <input id="rotateY" type="range" min="-35" max="35" value="0">
                </div>

                <div class="field">
                    <label for="depth">Depth <span class="value" id="depthValue"></span></label>
                    <input id="depth" type="range" min="0" max="80" value="18">
                </div>

                <div class="field">
                    <label class="toggle-row" style="margin-top: 26px;">
                        <input id="mouseFollow" type="checkbox" checked>
                        Mouse-follow tilt
                    </label>
                </div>
            </div>

            <div class="section-title">Actions</div>
            <div class="buttons">
                <button id="copyCssBtn">Copy CSS</button>
                <button id="copyTailwindBtn" class="secondary">Copy Tailwind</button>
            </div>

            <div class="section-title">Generated CSS</div>
            <pre id="css"></pre>

            <div class="section-title">Generated Tailwind</div>
            <pre id="tailwind"></pre>
        </div>
    </div>

<script>
const vscode = acquireVsCodeApi();

const status = document.getElementById('status');
const stage = document.getElementById('stage');
const card = document.getElementById('card');
const css = document.getElementById('css');
const tailwind = document.getElementById('tailwind');
const stageLabel = document.getElementById('stageLabel');
const cardTitle = document.getElementById('cardTitle');
const cardText = document.getElementById('cardText');

const mode = document.getElementById('mode');
const preset = document.getElementById('preset');
const background = document.getElementById('background');

const blur = document.getElementById('blur');
const opacity = document.getElementById('opacity');
const glow = document.getElementById('glow');
const borderWidth = document.getElementById('borderWidth');
const shadowX = document.getElementById('shadowX');
const shadowY = document.getElementById('shadowY');
const shadowBlur = document.getElementById('shadowBlur');
const shadowSpread = document.getElementById('shadowSpread');
const radius = document.getElementById('radius');
const rotateX = document.getElementById('rotateX');
const rotateY = document.getElementById('rotateY');
const depth = document.getElementById('depth');
const mouseFollow = document.getElementById('mouseFollow');

const blurValue = document.getElementById('blurValue');
const opacityValue = document.getElementById('opacityValue');
const glowValue = document.getElementById('glowValue');
const borderWidthValue = document.getElementById('borderWidthValue');
const shadowXValue = document.getElementById('shadowXValue');
const shadowYValue = document.getElementById('shadowYValue');
const shadowBlurValue = document.getElementById('shadowBlurValue');
const shadowSpreadValue = document.getElementById('shadowSpreadValue');
const radiusValue = document.getElementById('radiusValue');
const rotateXValue = document.getElementById('rotateXValue');
const rotateYValue = document.getElementById('rotateYValue');
const depthValue = document.getElementById('depthValue');

const copyCssBtn = document.getElementById('copyCssBtn');
const copyTailwindBtn = document.getElementById('copyTailwindBtn');
const threeDPanel = document.getElementById('threeDPanel');

const themes = {
    aurora: 'radial-gradient(circle at top left, rgba(255, 140, 105, 0.35), transparent 30%), radial-gradient(circle at top right, rgba(72, 166, 255, 0.28), transparent 35%), linear-gradient(135deg, #111827, #0b1020)',
    ocean: 'radial-gradient(circle at top left, rgba(0, 240, 255, 0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(255, 0, 153, 0.18), transparent 35%), linear-gradient(135deg, #06121f, #0f172a)',
    slate: 'linear-gradient(135deg, #1f2937, #111827)',
    night: 'radial-gradient(circle at 20% 20%, rgba(122, 92, 255, 0.3), transparent 30%), radial-gradient(circle at 80% 30%, rgba(0, 200, 255, 0.18), transparent 35%), linear-gradient(135deg, #0b1020, #111827)',
    light: 'linear-gradient(135deg, #d9e2ec, #f1f5f9)'
};

const presets = {
    default:  { blur: 22, opacity: 0.13, glow: 26, borderWidth: 1, shadowX: 0, shadowY: 10, shadowBlur: 30, shadowSpread: 0, radius: 24, rotateX: 0, rotateY: 0, depth: 18 },
    soft:     { blur: 28, opacity: 0.18, glow: 18, borderWidth: 1, shadowX: 0, shadowY: 8,  shadowBlur: 24, shadowSpread: 0, radius: 26, rotateX: 0, rotateY: 0, depth: 14 },
    strong:   { blur: 18, opacity: 0.10, glow: 44, borderWidth: 1, shadowX: 0, shadowY: 14, shadowBlur: 36, shadowSpread: 0, radius: 22, rotateX: 0, rotateY: 0, depth: 22 },
    neon:     { blur: 14, opacity: 0.12, glow: 52, borderWidth: 1, shadowX: 0, shadowY: 18, shadowBlur: 28, shadowSpread: 0, radius: 24, rotateX: 0, rotateY: 0, depth: 26 },
    minimal:  { blur: 12, opacity: 0.08, glow: 12, borderWidth: 1, shadowX: 0, shadowY: 10, shadowBlur: 18, shadowSpread: 0, radius: 18, rotateX: 0, rotateY: 0, depth: 10 },
    floating: { blur: 20, opacity: 0.14, glow: 30, borderWidth: 1, shadowX: 0, shadowY: 16, shadowBlur: 42, shadowSpread: 0, radius: 28, rotateX: 0, rotateY: 0, depth: 24 }
};

let mouseX = 0;
let mouseY = 0;

function setValue(el, value) {
    el.value = value;
}

function syncLabels() {
    blurValue.textContent = blur.value + 'px';
    opacityValue.textContent = opacity.value;
    glowValue.textContent = glow.value + 'px';
    borderWidthValue.textContent = borderWidth.value + 'px';
    shadowXValue.textContent = shadowX.value + 'px';
    shadowYValue.textContent = shadowY.value + 'px';
    shadowBlurValue.textContent = shadowBlur.value + 'px';
    shadowSpreadValue.textContent = shadowSpread.value + 'px';
    radiusValue.textContent = radius.value + 'px';
    rotateXValue.textContent = rotateX.value + 'deg';
    rotateYValue.textContent = rotateY.value + 'deg';
    depthValue.textContent = depth.value + 'px';
}

function applyPreset(name) {
    const p = presets[name] || presets.default;
    setValue(blur, p.blur);
    setValue(opacity, p.opacity);
    setValue(glow, p.glow);
    setValue(borderWidth, p.borderWidth);
    setValue(shadowX, p.shadowX);
    setValue(shadowY, p.shadowY);
    setValue(shadowBlur, p.shadowBlur);
    setValue(shadowSpread, p.shadowSpread);
    setValue(radius, p.radius);
    setValue(rotateX, p.rotateX);
    setValue(rotateY, p.rotateY);
    setValue(depth, p.depth);
    syncLabels();
}

function glowColorForMode(modeValue) {
    if (modeValue === 'neo') return 'rgba(0, 0, 0, 0.55)';
    if (modeValue === '3d') return 'rgba(0, 0, 0, 0.28)';
    return 'rgba(0, 0, 0, 0.30)';
}

function borderColorForMode(modeValue) {
    if (modeValue === 'neo') return 'rgba(255,255,255,0.06)';
    return 'rgba(255,255,255,0.20)';
}

function updatePreview() {
    const modeValue = mode.value;
    const themeValue = background.value;

    stage.style.background = themes[themeValue] || themes.aurora;

    if (modeValue === 'neo') {
        stageLabel.textContent = 'Neumorphism Preview';
        cardTitle.textContent = 'Neo UI';
        cardText.textContent = 'Soft extruded depth with paired highlights and shadows.';
    } else if (modeValue === '3d') {
        stageLabel.textContent = '3D Glass Preview';
        cardTitle.textContent = 'GlassCraft 3D';
        cardText.textContent = 'Mouse-follow tilt with perspective depth.';
    } else {
        stageLabel.textContent = 'Glass Preview';
        cardTitle.textContent = 'GlassCraft';
        cardText.textContent = 'Frosted glass with blur, glow, and border controls.';
    }

    if (modeValue === 'neo') {
        card.style.background = '#e6e6e6';
        card.style.backdropFilter = 'none';
        card.style.webkitBackdropFilter = 'none';
        card.style.boxShadow = glow.value + 'px ' + glow.value + 'px ' + glow.value + 'px rgba(0,0,0,0.18), ' +
                               '-' + glow.value + 'px -' + glow.value + 'px ' + glow.value + 'px rgba(255,255,255,0.85)';
    } else {
        card.style.background = 'rgba(255,255,255,' + opacity.value + ')';
        card.style.backdropFilter = 'blur(' + blur.value + 'px)';
        card.style.webkitBackdropFilter = 'blur(' + blur.value + 'px)';
        card.style.boxShadow = shadowX.value + 'px ' + shadowY.value + 'px ' + shadowBlur.value + 'px ' + shadowSpread.value + 'px ' + glowColorForMode(modeValue);
    }

    card.style.border = borderWidth.value + 'px solid ' + borderColorForMode(modeValue);
    card.style.borderRadius = radius.value + 'px';

    if (modeValue === '3d') {
        card.style.transform = 'perspective(1200px) rotateX(' + rotateX.value + 'deg) rotateY(' + rotateY.value + 'deg) translateZ(' + depth.value + 'px)';
    } else {
        card.style.transform = 'none';
    }
}

function generateCss() {
    const modeValue = mode.value;

    if (modeValue === 'neo') {
        return [
            'background: ' + card.style.background + ';',
            'box-shadow: ' + card.style.boxShadow + ';',
            'border: ' + card.style.border + ';',
            'border-radius: ' + card.style.borderRadius + ';',
            'transform: ' + card.style.transform + ';'
        ].join('\\n');
    }

    return [
        'background: ' + card.style.background + ';',
        'backdrop-filter: ' + card.style.backdropFilter + ';',
        'border: ' + card.style.border + ';',
        'box-shadow: ' + card.style.boxShadow + ';',
        'border-radius: ' + card.style.borderRadius + ';',
        'transform: ' + card.style.transform + ';'
    ].join('\\n');
}

function generateTailwind() {
    const modeValue = mode.value;

    if (modeValue === 'neo') {
        const g = Number(glow.value);
        return [
            'rounded-[' + radius.value + 'px]',
            'bg-[#e6e6e6]',
            'shadow-[' + g + 'px_' + g + 'px_' + g + 'px_rgba(0,0,0,0.18),_-' + g + 'px_-' + g + 'px_' + g + 'px_rgba(255,255,255,0.85)]'
        ].join(' ');
    }

    return [
        'rounded-[' + radius.value + 'px]',
        'bg-white/' + Math.round(Number(opacity.value) * 100),
        'backdrop-blur-[' + blur.value + 'px]',
        'border',
        borderWidth.value > 0 ? 'border-white/20' : 'border-transparent'
    ].join(' ');
}

function renderOutputs() {
    css.textContent = generateCss();

    let tailwindText = generateTailwind();
    if (mode.value === '3d') {
        tailwindText += '\\n/* 3D transform uses inline CSS in the live preview */';
    }
    tailwind.textContent = tailwindText;
}

function updateAll() {
    syncLabels();
    updatePreview();
    renderOutputs();
}

function applyMouseTilt(clientX, clientY) {
    if (mode.value !== '3d' || !mouseFollow.checked) return;

    const rect = stage.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    const nextX = (0.5 - py) * 24;
    const nextY = (px - 0.5) * 24;

    rotateX.value = Math.max(-35, Math.min(35, nextX.toFixed(0)));
    rotateY.value = Math.max(-35, Math.min(35, nextY.toFixed(0)));

    updateAll();
}

stage.addEventListener('mousemove', function (e) {
    applyMouseTilt(e.clientX, e.clientY);
});

stage.addEventListener('mouseleave', function () {
    if (mode.value === '3d' && mouseFollow.checked) {
        rotateX.value = 0;
        rotateY.value = 0;
        updateAll();
    }
});

preset.addEventListener('change', function () {
    applyPreset(preset.value);
    updateAll();
});

mode.addEventListener('change', function () {
    threeDPanel.classList.toggle('hidden', mode.value !== '3d');
    if (mode.value === '3d') {
        mouseFollow.checked = true;
    }
    updateAll();
});

background.addEventListener('change', updateAll);

[blur, opacity, glow, borderWidth, shadowX, shadowY, shadowBlur, shadowSpread, radius, rotateX, rotateY, depth, mouseFollow].forEach(function (el) {
    el.addEventListener('input', updateAll);
    el.addEventListener('change', updateAll);
});

copyCssBtn.addEventListener('click', function () {
    vscode.postMessage({
        command: 'copy',
        text: css.textContent
    });
});

copyTailwindBtn.addEventListener('click', function () {
    vscode.postMessage({
        command: 'copy',
        text: tailwind.textContent
    });
});

threeDPanel.classList.toggle('hidden', mode.value !== '3d');
status.textContent = 'GlassCraft ready';
applyPreset(preset.value);
updateAll();
</script>
</body>
</html>
`;
}

module.exports = { activate };