# ShoshaMart Frontend

Frontend application for ShoshaMart Internal Marketplace built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Nuxt 3
- **UI Framework**: Vue 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn-vue
- **State Management**: Pinia
- **Form Validation**: VeeValidate + Zod
- **Data Fetching**: Nuxt built-in useFetch
- **Icons**: Lucide Icons

## 📋 Prerequisites

- Node.js >= 18.x
- npm or yarn or pnpm
- Backend API running (default: http://localhost:3000)

## 🛠️ Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NUXT_PUBLIC_API_BASE=http://localhost:3000
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── app/                  # Nuxt 3 app directory
├── assets/              # Static assets (CSS, images)
├── components/          # Vue components
├── composables/         # Composable functions (API calls)
├── layouts/             # Layout components
│   ├── auth.vue        # Layout for auth pages
│   ├── operator.vue    # Layout for operator dashboard
│   ├── admin.vue       # Layout for admin dashboard
│   └── buyer.vue       # Layout for buyer interface
├── middleware/          # Route middleware
│   ├── auth.global.ts  # Global auth middleware
│   └── role.ts         # Role-based access control
├── pages/               # Application pages (auto-routing)
│   ├── index.vue       # Landing/redirect page
│   ├── login.vue       # Login page
│   ├── operator/       # Operator pages
│   ├── admin/          # Admin pages
│   └── buyer/          # Buyer pages
├── stores/              # Pinia stores
│   ├── auth.ts         # Authentication store
│   └── cart.ts         # Shopping cart store
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── nuxt.config.ts       # Nuxt configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

## 👥 User Roles & Access

### Operator
- Dashboard: `/operator`
- Manage products and variants
- Manage pricing for different user codes
- Process and approve orders
- View reports

### Admin
- Dashboard: `/admin`
- View orders for specific user code
- Approve/reject orders
- Add comments to orders

### Pembeli (Buyer)
- Dashboard: `/buyer`
- Browse products with user-specific pricing
- Add items to cart
- Create orders
- Track order status

## 🔑 Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Automatic token refresh
- Persistent login state

### Operator Features
- Product management (CRUD)
- Variant management
- Price setting per user code
- Order processing workflow
- Sales reports

### Admin Features
- Order approval workflow
- Comment system
- Order status tracking

### Buyer Features
- Product browsing with personalized pricing
- Shopping cart
- Order placement
- Order history

## 🎨 Styling

The application uses Tailwind CSS with a custom color palette from shadcn-vue. The design follows a clean, modern aesthetic with:

- Primary color: Blue (#3B82F6)
- Consistent spacing and typography
- Responsive design for mobile, tablet, and desktop
- Accessible color contrasts

## 🔧 Configuration

### API Integration
- All API calls are centralized in `composables/` directory
- Base URL configurable via environment variable
- Automatic token injection for authenticated requests

### State Management
- Auth state managed by Pinia store
- Cart state persisted to localStorage
- Reactive state updates

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (< 640px)
- Tablets (640px - 1024px)
- Desktop (> 1024px)

## 🐛 Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Vue DevTools**: Vue debugging

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run typecheck
```

## 🚢 Deployment

### Using Docker

```bash
# Build Docker image
docker build -t shosamart-frontend .

# Run container
docker run -p 3001:3000 -e NUXT_PUBLIC_API_BASE=http://api.example.com shosamart-frontend
```

### Static Generation

```bash
# Generate static site
npm run generate

# Output will be in .output/public
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_BASE` | Backend API base URL | `http://localhost:3000` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, please contact the development team.
