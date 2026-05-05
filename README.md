https://github.com/user-attachments/assets/522f4555-2572-4b68-9b88-91f4364b731e

# GlassCraft Pro 🎨✨

A Visual Studio Code extension for generating modern UI styles including:

- Glassmorphism
- Neumorphism
- 3D Glass UI
- Tailwind CSS output
- Live interactive preview with mouse tilt

---

## 🚀 Features

### 🎛 Live UI Builder
- Real-time visual editor for UI components
- Adjustable sliders for:
  - Blur
  - Opacity
  - Glow
  - Border width
  - Shadows (X, Y, blur, spread)
  - Border radius
  - 3D rotation & depth

### 🧊 Glass Mode
- Frosted glass effects using `backdrop-filter`
- Adjustable transparency and blur
- Soft glow shadows

### 🪟 Neumorphism Mode
- Soft UI with inner/outer shadows
- Smooth raised / pressed look

### 🧊 3D Glass Mode
- Perspective-based tilt
- Mouse-follow interaction
- Depth translation effects

---

## 📦 Installation

### From VSIX (recommended for development)

```bash
npx @vscode/vsce package
code --install-extension glasscraft-pro.vsix
🧑‍💻 Usage
Open Command Palette:
Ctrl + Shift + P
Run:
GlassCraft: Open
Use the panel to:
Adjust sliders
Switch modes
Preview UI in real-time
Copy CSS or Tailwind output
🧠 Output Types
CSS Output Example
background: rgba(255,255,255,0.13);
backdrop-filter: blur(22px);
border: 1px solid rgba(255,255,255,0.2);
box-shadow: 0 10px 30px rgba(0,0,0,0.3);
border-radius: 24px;
transform: perspective(1200px) rotateX(10deg) rotateY(-12deg);
Tailwind Output Example
rounded-[24px] bg-white/13 backdrop-blur-[22px] border border-white/20 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.3)]
🎯 Modes
Mode	Description
Glass	Frosted glass UI using blur + transparency
Neumorphism	Soft shadow UI with depth illusion
3D Glass	Interactive tilt-based UI with perspective
⚙️ Controls
Control	Function
Blur	Glass blur strength
Opacity	Transparency of glass layer
Glow	Shadow intensity
Shadow X/Y	Position of shadow
Radius	Border rounding
Rotate X/Y	3D tilt angles
Depth	Z-axis translation
🧩 Tech Stack
VS Code Webview API
Vanilla JavaScript
CSS Variables
No external dependencies
🛠 Development

Clone repository:

git clone https://github.com/your-username/glasscraft-pro
cd glasscraft-pro

Run packaging:

npx @vscode/vsce package
🐛 Known Issues
Tailwind shadows are approximate (CSS-in-JS style strings)
3D transform is not directly converted to Tailwind utilities
Webview requires enableScripts: true
📌 Future Improvements
Preset library save/load
Export as React components
Image-based glass background generator
Figma plugin version
Animation keyframe generator
📄 License

MIT License
