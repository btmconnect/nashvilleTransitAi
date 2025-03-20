# Nashville Transit AI

A transit application that provides real-time updates, route information, and an interactive map for Nashville's public transportation system.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Nashville-Transit-AI.git
cd Nashville-Transit-AI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Troubleshooting

If you encounter issues with the server not starting properly, modify the server configuration in `server/index.ts`:

```typescript
const port = process.env.PORT || 3000; // Use environment variable or fallback to 3000
server.listen({
  port,
  host: "127.0.0.1", // Change to localhost instead of 0.0.0.0
  // Remove reusePort: true as it's causing problems
}, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

## Features
- Real-time transit updates
- Interactive map interface
- Route planning
- Digital wallet integration
- Service alerts

## Technologies
- React
- TypeScript
- Express
- Leaflet for maps
- Tailwind CSS
- Radix UI components