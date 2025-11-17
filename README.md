# RoombaNet UI

A modern Vue.js frontend application for the RoombaNet project, built with Vue 3, TypeScript, and Vite.

## Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Axios** - HTTP client for API requests

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable Vue components
├── views/          # Page-level components
├── router/         # Vue Router configuration
├── stores/         # Pinia state management stores
├── services/       # API service layer
├── types/          # TypeScript type definitions
└── main.ts         # Application entry point
```

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

## Development Guidelines

- Use Composition API with `<script setup>` syntax
- Follow TypeScript best practices with proper typing
- Keep components focused and reusable
- Use Pinia stores for global state management
- Centralize API calls in the `services/` directory
- Define TypeScript interfaces in `types/` directory

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## IDE Support

Recommended VS Code extensions:
- Volar (Vue Language Features)
- TypeScript Vue Plugin

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

