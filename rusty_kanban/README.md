# RustyKanban

A simple and efficient Kanban board built with Tauri and TypeScript.

![RustyKanban Logo](src/RustyKanban.png)

## Features
 
- Create and manage tasks in three columns: TODO, In Progress, and Done
- Multi-select tasks using Shift+Click or Ctrl/Cmd+Click
- Right-click context menu for moving tasks between columns
- Edit task text inline
- Dark mode support
- Built-in tutorial

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [pnpm](https://pnpm.io/) (v8 or later)

### Setup

1. Clone the repository
```bash
git clone https://github.com/YourUsername/rusty_kanban.git
cd rusty_kanban
```

2. Install dependencies
```bash
pnpm install
```

3. Run the development server
```bash
pnpm tauri dev
```

### Building

To create a production build:
```bash
pnpm tauri build
```

## License

MIT License - see LICENSE file for details
