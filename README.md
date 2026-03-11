# Kanban Task Manager

A modern Kanban board application built with React, TypeScript, and Tailwind CSS.

## Features

- Drag and drop tasks between columns
- Task priority levels (Low, Medium, High)
- Task filtering and search
- Responsive design
- Dark/light theme support

## Technologies Used

- **Vite** - Build tool
- **React** - UI framework  
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn-ui** - UI components
- **@hello-pangea/dnd** - Drag and drop functionality

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:8080](http://localhost:8080) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure

```
src/
├── components/
│   ├── kanban/          # Kanban board components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
├── services/            # API services
└── types/               # TypeScript type definitions
```