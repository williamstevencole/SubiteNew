# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` (Expo development server)
- **Platform-specific development**:
  - Android: `npm run android`
  - iOS: `npm run ios`
  - Web: `npm run web`

## Project Architecture

This is a React Native application built with Expo Router and styled using NativeWind (TailwindCSS for React Native).

### Key Technologies
- **Expo Router**: File-based routing system with tab navigation structure
- **NativeWind**: TailwindCSS integration for React Native styling
- **TypeScript**: Strict typing enabled with path aliases (`@/*` maps to root)

### Project Structure
- `app/`: File-based routing directory
  - `(tabs)/`: Tab-based navigation group containing main app screens
  - `_layout.tsx`: Root layout with theme provider and navigation setup
  - `modal.tsx`: Modal screen accessible via navigation
- `components/`: Shared UI components with barrel exports via `index.ts`
- `constants/`: App constants including custom color palette
- `global.css`: TailwindCSS imports for global styling

### Styling System
Uses NativeWind with a custom color palette defined in `tailwind.config.js`:
- Primary: `#3B82F6` (blue)
- Secondary: `#8B5CF6` (purple)
- Text: `#F8FAFC` (light)
- Muted text: `#94A3B8`
- Status colors for error, success, warning states

### Component Architecture
- Components use TypeScript interfaces for props
- NativeWind classes applied via `className` prop
- Barrel exports from `components/index.ts` for clean imports
- Button component demonstrates pattern: variant-based styling with size options

### Navigation Setup
- Uses Dark Theme as default
- Tab navigation with FontAwesome icons
- Modal presentation support
- Error boundaries configured via Expo Router

### TypeScript Configuration
- Extends Expo's base tsconfig
- Strict mode enabled
- Path alias `@/*` configured for clean imports
- Includes NativeWind type definitions