# Smart Folder Zen

English | [中文](README.md)

A smart folder management application built with Tauri, React, and TypeScript.

## What is Smart Folder Zen?

Smart Folder Zen is a lightweight desktop utility that automatically creates daily folders based on the current date. Perfect for users who need to organize files by date - whether it's daily work files, downloads, or project materials.

## Core Features

### 📅 **Automatic Daily Folder Creation**
- **Date-based folders**: Automatically creates folders using today's date
- **Flexible naming**: Choose between `MMDD` (e.g., "0315") or `YYYY-MM-DD` (e.g., "2024-03-15") formats
- **Smart creation**: Only creates folders when they don't already exist
- **Startup automation**: Optionally create today's folder when your computer starts

### ⚙️ **Simple Configuration**
- **Modern UI Design**: Clean, breathing interface with card-style date format selection
- **Easy setup**: Choose your base folder path where date folders will be created
- **Integrated controls**: Browse button built into the input field for streamlined experience
- **Real-time preview**: See how your selected date format will look with today's date
- **Path validation**: Ensures the selected folder exists and is writable
- **Persistent settings**: Your preferences are saved and restored automatically

### 🚀 **System Integration**
- **System tray**: Runs quietly in the background without cluttering your desktop
- **Auto-start**: Automatically starts when Windows boots up
- **Single instance**: Prevents multiple copies from running simultaneously
- **Quick access**: Click the tray icon to open settings or create folders instantly

### 📂 **Quick Actions**
- **Instant folder creation**: Create today's folder with one click
- **Open in Explorer**: Directly open the created folder in Windows Explorer
- **Smart opening**: Opens today's folder if it exists, otherwise opens the base folder

## Who is this for?

- **Daily organizers** who sort files by date (photos, documents, downloads)
- **Professionals** who need date-based project organization
- **Students** organizing coursework and assignments by date
- **Anyone** who prefers chronological file organization

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Fluent UI 2 (Microsoft's design system)
- **Backend**: Tauri v2 (Rust)
- **Build Tool**: Vite
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustup.rs/)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ljchengx/SmartFolderZen.git
   cd SmartFolderZen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will start both the Vite dev server and the Tauri development app.

## Building

To build the application for production:

```bash
npm run tauri:build
```

For debug build:

```bash
npm run tauri:build:debug
```

## Project Structure

```
smart_folder_zen/
├── src/                 # React frontend source code
├── src-tauri/          # Tauri backend (Rust)
├── public/             # Static assets
├── dist/               # Build output
└── docs/               # Documentation
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run tauri` - Run Tauri CLI commands
- `npm run tauri:build` - Build the complete application
- `npm run tauri:build:debug` - Build debug version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Support

If you have any questions or run into issues, please open an issue on GitHub.
