# 🔍 FILE DETECTIVE - Investigation Agency

A distinctive Tauri desktop application that transforms folder analysis into an immersive detective experience. Pick a folder, and watch as the app becomes your digital detective, uncovering patterns, finding suspects, and revealing the secrets hidden in your files.

## ✨ Features

- **Folder Detective Picker** - Open any folder for investigation
- **Evidence Board** - Files displayed as vintage evidence cards with dramatic pin-drop animations
- **Deep Analysis Engine** - Rust-powered folder analysis with:
  - File type distribution analysis
  - Largest files detection ("Suspects of Interest")
  - Duplicate file pattern detection
  - File age statistics and timeline
  - Naming convention analysis
  - Hidden file discovery
  - Deep folder structure detection

- **Detective Insights Panel** - Case notes with:
  - File type distribution charts
  - Timeline of oldest/newest files
  - Key findings and warnings
  - Statistics dashboard

- **Noir Aesthetic** - 1940s detective office design with:
  - Film grain overlay
  - Amber and yellow color scheme
  - Typewriter fonts
  - Spotlight effects
  - Red string connections
  - Vintage evidence card styling

## 🛠️ Prerequisites

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **Rust & Cargo** (latest stable) - [Install Rust](https://rustup.rs/)
- **Tauri CLI** - Install with: `npm install -g @tauri-apps/cli`

### System Requirements

- **Windows**: Windows 7 or newer
- **macOS**: macOS 10.5 (Leopard) or newer
- **Linux**: GTK 3 or higher

## 📦 Installation

### Clone or navigate to the project:

```bash
cd show-file-in-rust
```

### Install dependencies:

```bash
npm install
```

## 🚀 Development

### Start the development server:

```bash
npm run tauri:dev
```

This will:
1. Start the Vite development server on `http://localhost:5173`
2. Launch the Tauri app in development mode
3. Enable hot module reloading for React components

### Build for production:

```bash
npm run tauri:build
```

The compiled app will be available in `src-tauri/target/release/` directory.

## 📁 Project Structure

```
show-file-in-rust/
├── src/                           # React frontend
│   ├── App.tsx                   # Main application component
│   ├── App.module.css            # Global styles & noir theme
│   ├── main.tsx                  # React entry point
│   ├── index.html                # HTML shell
│   ├── components/
│   │   ├── FolderPicker.tsx      # Folder selection UI
│   │   ├── FolderPicker.module.css
│   │   ├── EvidenceBoard.tsx     # Main investigation board
│   │   ├── EvidenceBoard.module.css
│   │   ├── FileCard.tsx          # Individual file card
│   │   ├── FileCard.module.css
│   │   ├── AnalysisPanel.tsx     # Detective insights
│   │   └── AnalysisPanel.module.css
│   └── types/
│       └── analysis.ts           # TypeScript type definitions
├── src-tauri/                     # Rust backend
│   ├── src/
│   │   ├── main.rs              # Tauri app initialization
│   │   ├── analyzer.rs          # File analysis engine
│   │   ├── commands.rs          # Tauri command handlers
│   │   └── build.rs             # Build script
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
├── package.json                  # Node dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
└── README.md                    # This file
```

## 🎨 Design Philosophy

**File Detective** embraces a **film noir detective agency aesthetic** to make file analysis engaging and memorable:

- **Color Palette**: Deep charcoal (#1a1a1a) + warm amber (#d4a574) + crime scene yellow (#ffd93d)
- **Typography**:
  - Display: Abril Fatface for dramatic case headers
  - Body: Courier Prime for typewriter/case file feel
  - UI: Space Grotesk for modern contrast
- **Visual Effects**:
  - Film grain overlay for vintage atmosphere
  - Spotlight effects following cursor on evidence board
  - Pin-drop animations with staggered reveals
  - Red string SVG connections between related files
  - Torn-edge card styling

Every design choice is intentional—no generic "AI slop". The noir theme isn't just decoration; it transforms mundane file analysis into an immersive investigation experience.

## 🔧 Technical Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Rust with Tauri 2.0
- **Styling**: CSS Modules with CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Desktop Framework**: Tauri 2.0

## 🚀 Building for Different Platforms

### Windows (MSI Installer)
```bash
npm run tauri:build
# Creates: src-tauri/target/release/bundle/msi/
```

### macOS (DMG / App)
```bash
npm run tauri:build
# Creates: src-tauri/target/release/bundle/dmg/
```

### Linux (AppImage / Deb)
```bash
npm run tauri:build
# Creates: src-tauri/target/release/bundle/appimage/ or /deb/
```

## 📊 Analysis Data Structure

The Rust analyzer returns comprehensive analysis data:

```rust
AnalysisResult {
    total_files: usize,
    total_size: u64,
    total_folders: usize,
    file_types: HashMap<String, FileTypeInfo>,
    largest_files: Vec<FileInfo>,
    oldest_file: Option<FileInfo>,
    newest_file: Option<FileInfo>,
    avg_file_age_days: f64,
    max_depth: usize,
    hidden_file_count: usize,
    duplicate_patterns: Vec<DuplicateInfo>,
    naming_stats: NamingStats,
}
```

## 🎯 Performance Optimization

- **Lazy Loading**: File cards are rendered with staggered animations
- **Parallel Processing**: Rust analyzer uses rayon for parallel file traversal
- **Virtualization**: Large file lists are optimized for smooth scrolling
- **CSS-only Animations**: Framer Motion with GPU-accelerated transforms

## 🐛 Troubleshooting

### "Tauri CLI not found"
```bash
npm install -g @tauri-apps/cli
```

### "Cannot compile Rust"
Ensure Rust is updated:
```bash
rustup update
```

### App doesn't open folder
Check file system permissions. The app requires read access to the selected folder.

### Slow analysis on large folders
The app handles 1000+ files efficiently. For extremely large folders (10000+), analysis may take a few seconds—this is normal as the Rust analyzer thoroughly processes all files.

## 📝 Case File: Development Notes

### Adding New File Type Icons
Edit `FileCard.tsx` in the `getIcon()` function to add new file type detection.

### Customizing the Theme
Modify CSS variables in `App.module.css`:
```css
:root {
  --bg-primary: #1a1a1a;
  --accent-amber: #d4a574;
  --accent-yellow: #ffd93d;
  /* ... more variables ... */
}
```

### Extending Analysis Features
Add new analysis functions to `src-tauri/src/analyzer.rs` and expose them as Tauri commands in `commands.rs`.

## 🎬 Key Animations & Effects

1. **Film Countdown** - Page load animation (optional future feature)
2. **Spotlight Follow** - Radial gradient following cursor on evidence board
3. **Pin-Drop Effect** - Staggered card reveals with rotation
4. **Red String Draw** - Animated SVG lines connecting related files
5. **Typewriter Reveal** - Text appears character by character
6. **Hover Lift** - Cards lift with shadow on hover

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🔍 Investigation Tips

- **Large Files**: Look at "Suspects of Interest" to find space hogs
- **Duplicates**: Check duplicate patterns to find potential cleanup candidates
- **Timeline**: Review file age to understand project activity patterns
- **Hidden Files**: Note hidden file count—might indicate config files or system data
- **Deep Folders**: Max depth indicates folder nesting complexity

---

**Remember**: Every file tells a story. Every pattern reveals the truth. Now go investigate! 🕵️‍♂️
