# 🎴 Hobby Hunter Web MVP

A digital card collection platform with physical shipping capabilities, designed for hobby collectors and gamers. Combine the excitement of digital pack openings with the tangible value of physical cards.

![Hobby Hunter Banner](https://img.shields.io/badge/Hobby%20Hunter-Card%20Collection%20Platform-blue?style=for-the-badge)

## 🎯 Project Overview

Hobby Hunter is a hybrid digital-physical collectible card platform that bridges the gap between digital collecting and traditional physical card ownership. Users can purchase virtual card packs, experience exciting pack openings with randomized cards, and optionally ship their favorite pulls to receive physical copies.

### Key Features

- 🎲 **Digital Pack Opening**: Purchase and open randomized card packs with varying rarities
- 💳 **Credit-Based Economy**: Secure credit system for purchasing packs and managing transactions
- 📦 **Physical Shipping**: Convert digital cards to physical copies delivered to your door
- 🔄 **Auto-Conversion**: Cards expire after 30 days and convert to credits (50% market value)
- 🏆 **Rarity System**: Common, Uncommon, Rare, Mythic, and Legendary cards with different values
- 👤 **User Authentication**: Secure sign-up/login with email verification and Google OAuth
- 📊 **Collection Management**: View, organize, and manage your digital card collection
- 💰 **Real Market Value**: Card prices updated from MTGGoldfish and TCGPlayer

## 🛠️ Technology Stack

### Core Frameworks & Libraries

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19 for fast development and optimized builds
- **Routing**: React Router DOM v6 for client-side navigation
- **State Management**: Zustand 5.0.8 for lightweight, scalable state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth UI transitions
- **Form Handling**: React Hook Form with Zod validation

### UI Components & Design

- **Component Library**: Radix UI primitives with custom shadcn/ui implementations
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Development & Testing

- **Type Safety**: Full TypeScript coverage
- **Linting**: ESLint with React and TypeScript rules
- **Mock Data**: MSW (Mock Service Worker) for API simulation
- **Hot Reload**: Vite HMR for instant development feedback

## 🏗️ Architecture

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui component library
│   ├── CardDisplay.tsx  # Card rendering component
│   ├── Header.tsx       # Navigation header
│   ├── PackCard.tsx     # Pack display component
│   └── PackOpening.tsx  # Pack opening animation
├── controller/          # Business logic controllers
│   ├── AuthController.ts    # Authentication logic
│   ├── CardsController.ts   # Card management logic
│   ├── HomeController.ts    # Home page logic
│   └── AboutController.ts   # About page logic
├── pages/               # Route components
│   ├── Home.tsx         # Main landing page
│   ├── Cards.tsx        # Card collection page
│   ├── Auth.tsx         # Authentication flows
│   ├── About.tsx        # About page
│   └── NotFound.tsx     # 404 page
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
│   ├── store.ts         # Zustand state management
│   └── utils.ts         # Helper functions
└── App.tsx              # Main application component
```

### State Management

The application uses a dual-store architecture with Zustand:

- **`useAppStore`**: Core application state (user data, cards, packs, transactions)
- **`useUserStore`**: User preferences and UI settings with localStorage persistence

### Controller Pattern

Business logic is separated from UI components using custom controller hooks:

- **Separation of Concerns**: UI components focus purely on presentation
- **Reusability**: Controllers can be used across different UI implementations
- **Testability**: Business logic is easily testable in isolation
- **Type Safety**: Strong TypeScript typing throughout

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 16.x or later
- **npm**: 8.x or later (or yarn/pnpm equivalent)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hobby_hunter_web_mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎮 Usage Guide

### Getting Started as a User

1. **Sign Up/Login**
   - Create account with email verification
   - Or use Google OAuth for quick access
   - Complete optional profile setup

2. **Purchase Credits**
   - Add credits to your account (mock PayPal integration)
   - Credits are used to purchase card packs

3. **Buy and Open Packs**
   - Browse available packs on the home page
   - Purchase packs using your credits
   - Experience animated pack opening with card reveals

4. **Manage Your Collection**
   - View all your cards in the Cards page
   - Select cards for physical shipping
   - Monitor card expiry dates (30-day limit)

5. **Ship Physical Cards**
   - Select cards you want to keep permanently
   - Request shipping to receive physical copies
   - Track your shipping requests

### Pack Opening Mechanics

- Each pack guarantees certain rarity distributions
- Cards have real market values updated from trading platforms
- Rare pulls create exciting moments with visual feedback
- Skip animation option for experienced users

### Card Management

- **Expiry System**: Cards expire after 30 days if not shipped
- **Auto-Conversion**: Expired cards convert to 50% credit value
- **Batch Operations**: Select multiple cards for shipping
- **Value Tracking**: Real-time market value updates

## 🏢 Business Model

### Revenue Streams

1. **Pack Sales**: Primary revenue from credit purchases
2. **Shipping Fees**: Revenue from physical card delivery
3. **Premium Features**: Future subscription tiers

### Economic System

- **Credit-Based**: All transactions use internal credit system
- **Market Values**: Real card values from external sources
- **Expiry Mechanism**: Encourages engagement and shipping
- **50% Conversion**: Fair value for expired cards

## 🔮 Future Features

### Planned Enhancements

- **Trading System**: User-to-user card exchanges
- **Marketplace**: Buy/sell cards between users
- **Subscription Boxes**: Regular curated pack deliveries
- **Social Features**: Friends, leaderboards, achievements
- **Mobile App**: React Native implementation
- **Augmented Reality**: Visualize cards in physical space
- **Advanced Analytics**: Collection insights and trends

### Technical Roadmap

- **Real Backend**: Replace MSW with actual API
- **Payment Integration**: Real PayPal/Stripe integration
- **Push Notifications**: Real-time updates
- **Advanced Search**: Filter and sort collections
- **Performance Optimization**: Code splitting and caching

## 🧪 Development

### Mock Data System

The application uses MSW for API simulation during development:

- **Realistic Data**: Comprehensive mock data for all entities
- **API Simulation**: Full CRUD operations without backend
- **Development Speed**: Rapid prototyping and testing
- **Error Scenarios**: Simulated error conditions for testing

### Controller Architecture

Business logic is organized in controller hooks:

```typescript
const {
  // State
  selectedCards,
  // Data getters
  getCardsData,
  // Actions
  handleCardToggle,
  // Validations
  canShipCards
} = useCardsController();
```

### Type Safety

Full TypeScript coverage ensures:

- **Compile-time Safety**: Catch errors before runtime
- **IntelliSense**: Better developer experience
- **Refactoring Support**: Safe code modifications
- **API Contracts**: Clear interface definitions

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a private project. For development team members:

1. Follow the existing code style and patterns
2. Use the controller pattern for new business logic
3. Maintain TypeScript coverage
4. Test thoroughly with mock data
5. Follow the component architecture

## 📞 Support

For development support or questions:
- Email: abc@gmail.com
- Internal documentation in `/docs`
- Architecture diagrams in project knowledge base

---

**Built with ❤️ for collectors and gamers worldwide** 🎴