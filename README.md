# RoombaNet UI

A modern Vue.js frontend application for the [RoombaNET](https://github.com/imilosk/roomba-net) project, built with Vue 3, TypeScript, and Vite.

> **Backend Repository:** [imilosk/roomba-net](https://github.com/imilosk/roomba-net) - .NET backend API for controlling Roomba vacuum robots

<div align="center">
  <video src="https://github.com/user-attachments/assets/8d1f3984-3693-4a35-b24f-1fc014206548" width="400" />
</div>

## Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Axios** - HTTP client for API requests

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
