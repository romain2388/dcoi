# DevOps Carbon Offset Initiative (DCOI)

A GitHub App that connects DevOps practices with environmental sustainability by tracking CI/CD usage and enabling carbon offsetting through verified carbon credit projects.

## 🌱 What is DCOI?

DCOI bridges the gap between software development and environmental responsibility. By installing this GitHub App, development teams can:

- **Track their CI/CD carbon footprint** from GitHub Actions workflows
- **Earn carbon credits** through marketplace subscriptions
- **Support verified carbon offset projects** worldwide
- **Contribute to community carbon goals** through shared credits

## 🚀 Features

### GitHub Integration

- **Workflow Tracking**: Monitors GitHub Actions workflow runs and jobs
- **Repository Sync**: Automatically syncs installed repositories
- **Webhook Processing**: Real-time updates from GitHub events

### Carbon Credit System

- **Marketplace Plans**: Multiple subscription tiers with carbon credit allocations
- **Dual Wallets**: Individual user credits + community contribution pool
- **Credit Management**: Track balances and offset history

### Carbon Offset Registry

- **Verified Projects**: Curated list of certified carbon offset initiatives
- **Global Reach**: Projects from multiple countries and standards
- **Transparent Tracking**: Complete project documentation and proof of retirement

### Admin Interface

- **Project Management**: Add and manage carbon offset projects
- **User Oversight**: Monitor installations and marketplace subscriptions
- **Analytics**: Track carbon credit distribution and usage

## 🛠️ Tech Stack

- **Frontend**: React 19, TanStack Router, Grommet UI, Styled Components
- **Backend**: TanStack Start (Vite-based full-stack framework)
- **Database**: MongoDB with Mongoose
- **GitHub Integration**: Octokit for GitHub API and webhooks
- **Validation**: Zod schemas
- **TypeScript**: Strict type checking enabled

## 📋 Prerequisites

- Node.js 18+
- MongoDB database
- GitHub App credentials (App ID, private key, webhook secret)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dcoi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/dcoi

   # GitHub App
   GITHUB_APP_ID=your_app_id
   GITHUB_PRIVATE_KEY=your_private_key
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   VITE_GITHUB_APP_SLUG=your_app_slug

   # Admin
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Layered Architecture

- **Routes**: Client and API route definitions
- **Controller**: Business logic with input validation
- **Server**: Database operations and external API calls
- **Client**: React components and UI logic

### Key Components

- **GitHub Webhooks**: Process installation, marketplace, and workflow events
- **Carbon Calculator**: Allocate credits based on subscription plans
- **Project Registry**: Manage and display carbon offset projects
- **Wallet System**: Track user and community carbon credits

## 🌍 Carbon Credit Plans

| Plan ID | Monthly Credits         | Yearly Credits            | Description          |
| ------- | ----------------------- | ------------------------- | -------------------- |
| 2       | 0 user, 100 community   | 0 user, 1200 community    | Community supporter  |
| 3       | 0 user, 200 community   | 0 user, 2400 community    | Team contributor     |
| 4       | 0 user, 500 community   | 0 user, 6000 community    | Organization partner |
| 5       | 80 user, 20 community   | 1000 user, 200 community  | Developer plan       |
| 6       | 160 user, 40 community  | 2000 user, 500 community  | Team plan            |
| 7       | 400 user, 100 community | 5000 user, 1500 community | Enterprise plan      |

## 🔒 Security

- Environment variables for all sensitive data
- Input validation with Zod schemas
- Restricted imports by architectural layer
- GitHub webhook signature verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

ISC License

## 🌱 Environmental Impact

Every CI/CD pipeline run consumes energy. DCOI helps development teams:

- **Measure** their carbon footprint from automated testing and deployment
- **Offset** emissions through verified carbon credit projects
- **Contribute** to global climate goals through community credits
- **Educate** teams about sustainable software development practices

Join the movement to make DevOps environmentally sustainable! 🌍♻️
