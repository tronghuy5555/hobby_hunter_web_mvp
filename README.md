# HobbyHunter - Card Pack Store MVP

A React + TypeScript frontend application for a digital card pack opening store experience. This MVP simulates purchasing card packs, opening them with engaging animations, managing collected cards, and handling user transactions.

## Features

- 🎴 Interactive pack opening with Framer Motion animations
- 🗂️ Card collection with expiry countdown and auto-conversion to credits
- 💳 Credit-based purchasing with PayPal payment integration mockup
- 📱 Responsive mobile-first design with touch gestures
- 🎯 Mock Service Worker (MSW) for realistic API simulation

## Technology Stack

- **React 18** - Component-based UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for pack reveals
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **MSW** - API mocking layer

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone and navigate to the project
cd hobby_hunter_web_mvp

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Navigation, Footer
│   ├── cards/           # CardDisplay, CardList, TopCardsCarousel
│   ├── packs/           # PackCard, PackGrid, PackRevealAnimation
│   ├── ui/              # Button, Modal, LoadingSpinner, CountdownTimer
│   └── forms/           # PaymentForm, ShippingForm
├── pages/               # Home, OpenPack, MyCards, Shipping, Account, About
├── store/               # Zustand stores (useAppStore)
├── services/            # API service layer with Axios
├── hooks/               # Custom React hooks
├── types/               # TypeScript interfaces and enums
├── mocks/               # MSW handlers and mock data
├── utils/               # Helper functions and constants
└── assets/              # Images, icons, static files
```

## Key Features

### Card Rarity System
- Common (Gray) - Base cards with standard value
- Uncommon (Green) - Slightly enhanced cards
- Rare (Blue) - Valuable cards with special effects
- Epic (Purple) - Highly sought-after cards
- Legendary (Gold) - Extremely rare and valuable
- Mythic (Red) - Ultimate rarity with maximum value

### Pack Opening Experience
- Animated pack opening with Framer Motion
- Sequential card reveals sorted by rarity
- Skip to rare cards functionality
- Touch gestures for mobile devices

### Card Management
- Automatic expiry countdown (30 days)
- Auto-conversion to credits when expired
- Bulk shipping to physical address
- Filter and sort by rarity, value, expiry

## Mock Data

The application uses MSW to simulate a complete backend. All API calls are intercepted and return realistic mock data for:
- User authentication and profiles
- Pack purchasing and opening
- Card collection management
- Payment processing simulation
- Shipping and tracking

## Mobile Features

- Touch gestures for pack opening
- Swipe navigation for card browsing
- Responsive design for all screen sizes
- Mobile-optimized animations

## Future Enhancements

- Real backend API integration
- User authentication system
- PayPal payment gateway
- Push notifications
- Trading system between users
