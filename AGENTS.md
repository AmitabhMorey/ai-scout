# AI Scout — Development Guidelines

This project is built as an independent, multi-page intelligence platform using **Astro v7 + Vue 3 Islands** and **Tailwind CSS v4**.

## Architecture Principles
- **Astro Pages (`src/pages/`)**: Use Astro for zero-JS static publishing, layouts, and server endpoints.
- **Vue 3 Islands (`src/components/**/*.vue`)**: Use Vue Single File Components with `<script setup>` for interactive client widgets (`client:load`, `client:idle`).
- **Styling**: Tailwind CSS v4 with OKLCH editorial color tokens and Newsreader / IBM Plex typography in `src/styles/globals.css`.
