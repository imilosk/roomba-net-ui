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

## Docker

Build the production image:

```bash
docker build -t roomba-net-ui .
```

Run the container (serves on port 80 inside the container):

```bash
docker run --rm -p 4173:80 roomba-net-ui
```

Visit `http://localhost:4173` to access the app.

### Configure API endpoint at build time

Vite reads `VITE_` variables while building, so pass the desired backend URL as a build argument:

```bash
docker build -t roomba-net-ui \
  --build-arg VITE_API_BASE_URL=https://your-api-host/api \
  .
```

In docker-compose:

```yaml
services:
  roomba-net-ui:
    build:
      context: https://github.com/imilosk/roomba-net-ui.git
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${ROOMBA_API_URL}
```

## Install as a PWA

The app now includes a web app manifest and service worker, so you can install it on mobile/desktop browsers:

1. Build and serve the production bundle over HTTPS (or use `npm run dev` on `localhost` for testing).
2. Open the site in Safari on iOS, tap the Share icon, and choose **Add to Home Screen**.
3. On Android/Chrome, look for the install banner or open the browser menu → **Install app**.

Once installed, it launches fullscreen with offline caching for the shell.

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
