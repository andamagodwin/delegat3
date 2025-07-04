# Delegat3 - Unlock Protocol Voting Delegation

A modern, user-friendly web application for delegating Unlock Protocol (UP) token voting rights on the Base network.

## 🚀 Features

- **Easy Wallet Connection**: Connect MetaMask and other Web3 wallets
- **Multiple Delegation Options**:
  - Delegate to yourself for direct voting control
  - Delegate to trusted Unlock Protocol stewards
  - Delegate to any custom Ethereum address
- **Delegation History**: Complete tracking of all delegation activities
- **Base Network Integration**: Fast, low-cost transactions
- **Cloud Data Storage**: Supabase integration for cross-device access
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dashboard Analytics**: Comprehensive analytics and reporting
- **Security First**: Your tokens never leave your wallet

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js v6
- **Routing**: React Router DOM
- **Database**: Supabase
- **Build Tool**: Vite
- **Network**: Base (Ethereum L2)

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- UP tokens on Base network
- Supabase account (for cloud data storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd delegat3
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy the project URL and anon key
   - Create a `.env` file in the root directory:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── DelegationCard.tsx
│   ├── DelegationHistory.tsx
│   └── WalletConnect.tsx
├── pages/              # Application pages
│   ├── dashboard/      # Dashboard pages
│   ├── AboutPage.tsx
│   └── LandingPage.tsx
├── hooks/              # Custom React hooks
│   ├── useDelegation.ts
│   ├── useSupabase.ts
│   └── useWallet.ts
├── lib/                # External service configurations
│   └── supabase.ts
├── data/               # Static data
│   └── stewards.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## 🗄️ Database Setup

This app uses Supabase for cloud data storage. Follow these steps to set up your database:

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) and create a new project
- Note your project URL and anon key

### 2. Configure Environment Variables
Create a `.env` file in your project root:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database Schema
Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor to create the required tables:
- `user_profiles` - Store user wallet information
- `delegation_records` - Track all delegation activities

### 4. Row Level Security (Optional)
The schema includes RLS policies for data security. If you prefer public access for development, you can disable RLS by running:
```sql
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE delegation_records DISABLE ROW LEVEL SECURITY;
```

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Switch to Base**: If not already on Base network, click "Switch to Base"
3. **Choose Delegation**:
   - **Self**: Delegate to yourself for direct voting control
   - **Stewards**: Choose from trusted Unlock Protocol community members
   - **Custom**: Enter any Ethereum address
4. **Confirm**: Approve the transaction in your wallet
5. **Track**: View your delegation history and analytics in the dashboard

## 🔐 Security

- Your UP tokens remain in your wallet at all times
- Delegation only transfers voting power, not token ownership
- All transactions are on-chain and verifiable
- You can change or remove delegation at any time
- Data is stored securely in Supabase with optional row-level security
- Local storage is used as a backup for delegation history

## 📊 Dashboard Features

The dashboard provides comprehensive insights into your delegation activities:

- **Overview**: Current delegation status and quick stats
- **History**: Complete record of all delegation activities
- **Analytics**: Charts and insights about your delegation patterns
- **Stewards**: Information about trusted Unlock Protocol delegates
- **Settings**: Account management and data export options

## 🌐 Network Information

- **Network**: Base (Chain ID: 8453)
- **UP Token Contract**: `0x82f5bF4aBfA0c41Dc8C0f7f4b3De6BB5b5ad3c4e` (placeholder)
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org

## 🤝 Trusted Stewards

The app includes a curated list of Unlock Protocol stewards:

- **Julien Genestoux** - Co-founder and protocol architect
- **Christopher Carfi** - Community and partnerships lead
- **Clément Lesaege** - Technical advisor and governance expert
- **Angela Steffens** - Growth and strategic partnerships
- **Kalidou Diagne** - Core developer and protocol contributor

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Glassmorphism**: Modern frosted glass effect components
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Interactive Elements**: Smooth hover effects and transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for iPad and similar devices
- **Desktop**: Full-featured experience on large screens
- **Touch Friendly**: Large buttons and touch targets

## 🔧 Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── data/               # Static data and configuration
└── assets/             # Images and static assets
```

### Key Components

- `useWallet`: Web3 wallet connection and state management
- `useDelegation`: Delegation logic and blockchain interactions
- `WalletConnect`: Wallet connection interface
- `DelegationCard`: Current delegation status display
- `StakeholdersList`: Trusted stewards selection
- `DelegationHistory`: Activity tracking and display

### Environment Variables

```env
# Add these to your .env file if needed
VITE_UP_TOKEN_ADDRESS=0x82f5bF4aBfA0c41Dc8C0f7f4b3De6BB5b5ad3c4e
VITE_BASE_RPC_URL=https://mainnet.base.org
```

## 🚀 Deployment

The app is ready for deployment on any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the build action
- **IPFS**: Upload the build folder for decentralized hosting

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for the Unlock Protocol community**
