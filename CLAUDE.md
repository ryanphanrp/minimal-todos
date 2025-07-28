# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "minimal-todo", a simple todo application inspired by the iOS SyncTask app. It's built with Next.js 15, React 19, and uses shadcn/ui components with Tailwind CSS for styling. The app features smooth animations using Motion (formerly Framer Motion) and stores data in localStorage.

## Development Commands

**Use bun instead of npm/yarn/pnpm for all commands:**

- `bun dev` - Start development server on port 3000
- `bun run build` - Build the production application
- `bun start` - Start production server
- `bun lint` - Run ESLint to check code quality

## Architecture Overview

### Core Structure
- **Pages Router**: Uses Next.js Pages Router (not App Router)
- **React 19**: Latest React version with modern features
- **Component Library**: Uses shadcn/ui components extensively
- **State Management**: React Context API with custom TodoProvider
- **Styling**: Tailwind CSS v4 with custom CSS variables

### Key Files
- `src/pages/index.tsx` - Main todo application component
- `src/lib/store.tsx` - React Context provider for todo state management
- `src/types/todo.ts` - TypeScript interface for Todo items
- `src/pages/_app.tsx` - Next.js app wrapper with TodoProvider and global styles
- `components.json` - shadcn/ui configuration file
- `tailwind.config.ts` - Tailwind CSS v4 configuration

### Data Flow
- Todos are stored as `TodoWithDate[]` which extends the base `Todo` interface with `createdAt`
- Data persists in localStorage with key `"todos-next-app"`
- State managed through React Context with TodoProvider wrapper
- Custom hooks: `useTodoStore()` provides access to todo state and actions
- No external database or API - purely client-side

### UI Components
The app uses shadcn/ui components in the "new-york" style:
- Custom path aliases configured: `@/components`, `@/lib`, `@/hooks`
- Tailwind CSS v4 with simplified configuration (no PostCSS needed)
- Tailwind config uses zinc as base color with CSS variables
- Lucide React for icons
- DM Sans Google Font for typography

### Key Features
- Add todos by typing and pressing Enter or blurring input
- Edit todos by clicking on the text
- Toggle completion with checkboxes
- Delete todos with trash icon
- Smooth animations for add/remove/edit operations
- Responsive design with centered layout
- Date display showing current date

## Development Notes

- The app uses `"use client"` directive but runs in Pages Router (not App Router)
- Animation system uses Motion library with AnimatePresence for enter/exit animations
- Input handling supports both Enter key and blur events
- Todo IDs generated using `Date.now()` for simplicity
- All todos are stored with creation timestamps but only used internally