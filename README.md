# 🌟 AurumLogix Pro

 AurumLogix Pro, an AI-powered jewelry retail management app with inventory, pricing, sales, and CRM features.

[![Vite Build](https://img.shields.io/badge/Build-Vite%20%2F%20React%2019-yellow.svg)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide--React-orange.svg)](https://lucide.dev/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-magenta.svg)](#-assistant-and-ai-intelligence)

**AurumLogix Pro** is a professional-grade jewelry store management system designed for modern luxury retail. Combining intelligent material valuation, extensive inventory management, advanced sales tracking, customer relationship management (CRM), and AI-powered analytics, it streamlines gold and silver retail administration with real-time insights and precision pricing.

Built with React 19, TypeScript, Vite, and powered by Google's Gemini AI, it delivers instant response times, responsive layouts, and multi-device capabilities wrapped in an elegant, user-friendly interface.

---

## ✨ Key Features

### 💎 Advanced Jewelry Pricing Calculator
- **Multi-Metal Valuation**: Configure Gold (24K, 22K, 18K, 14K) and Silver (999 Pure, 925 Sterling) standards with custom rates
- **Flexible Pricing Models**: Support percentage, per-gram, and flat fee workmanship/making charges
- **Detailed Breakdowns**: View itemized costs including material, wastage, workmanship, and taxes (GST/VAT)
- **Built-in Calculator**: Quick access to a fully functional calculator for on-the-fly computations

### 📦 Inventory Management
- **Smart Stock Ledger**: Search, filter, and classify inventory items with advanced sorting options
- **Low Stock Alerts**: Automatic notifications when items fall below 5 units in stock
- **Real-time Tracking**: Monitor stock levels, material weights, and pricing across your catalog

### 👤 Customer Relationship Manager (CRM)
- **VIP Customer Identification**: Flag loyal, high-value customers for personalized service
- **Purchase History**: Track lifetime customer value, transaction history, and purchase patterns
- **Quick Transaction Drafts**: Create invoices pre-populated with customer information

### 📊 Sales & Analytics Dashboard
- **Revenue Tracking**: View daily, weekly, and monthly sales metrics
- **Business KPIs**: Monitor inventory turnover, average transaction value, and trend analysis
- **Visual Charts**: Interactive revenue and trends visualization powered by Recharts

### 🤖 AI-Powered Assistant
- **Gemini Integration**: Real-time AI assistance for business insights and recommendations
- **Live Market Rates**: Automatic updates on gold and silver prices using AI predictions
- **Smart Advice**: Get AI-generated business tips and sales recommendations

### ⚙️ Advanced Settings
- **Manual Rate Override**: Set custom rates when internet is unavailable or for store-specific margins
- **Multi-User Support**: Role-based access for owners and employees with secure login
- **Theme Customization**: Choose between light, dark, or system themes for comfortable viewing
- **Terminal Lock**: Security features to lock down registers when stepping away

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [Vite](https://vite.dev/) for ultra-fast development and optimized production builds
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) for type-safe code and better developer experience
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive, utility-first design with dark mode support
- **UI Icons**: [Lucide React](https://lucide.dev/) for flexible, customizable SVG icons
- **Charts & Visualization**: [Recharts](https://recharts.org/) for interactive data visualization
- **Routing**: [React Router v7](https://reactrouter.com/) for client-side navigation
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/) for intelligent insights and market rate predictions

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **[Node.js](https://nodejs.org/)**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **[Google Gemini API Key](https://aistudio.google.com/app/apikey)**: Required for AI features

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_REPO_URL/JewelTrack.git
   cd JewelTrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root (or use `.env.local`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

5. **Build for production**:
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `/dist` directory.

6. **Preview production build** (optional):
   ```bash
   npm run preview
   ```

### Quick Start Example

1. Open http://localhost:3000 in your browser
2. Register as an owner with your shop details
3. Navigate to **Calculator** to set up your gold/silver rates
4. Add inventory items in **Inventory** section
5. Create sales transactions in **Sales** section
6. View business insights in the **Dashboard**
7. Chat with the **AI Assistant** for business recommendations

---

## 📂 Project Structure

```
JewelTrack/
├── src/
│   ├── screens/                  # Main application views
│   │   ├── HomeView.tsx         # Dashboard landing with shortcuts
│   │   ├── CalculatorView.tsx   # Jewelry pricing calculator
│   │   ├── InventoryView.tsx    # Stock management and tracking
│   │   ├── SalesView.tsx        # Invoice and transaction management
│   │   ├── CRMView.tsx          # Customer relationship management
│   │   ├── DashboardView.tsx    # Analytics and KPI insights
│   │   ├── AssistantView.tsx    # AI-powered business assistant
│   │   ├── AuthView.tsx         # Multi-user login system
│   │   └── SettingsView.tsx     # Configuration and preferences
│   │
│   ├── services/                 # External service integrations
│   │   └── geminiService.ts     # Google Gemini AI integration
│   │
│   ├── App.tsx                  # Context provider and main routing
│   ├── types.ts                 # TypeScript type definitions
│   ├── constants.tsx            # Default values and static data
│   ├── index.tsx                # Application entry point
│   └── index.css                # Global styles with Tailwind
│
├── index.html                   # HTML template
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies
├── metadata.json                # App metadata and permissions
└── README.md                    # This file
```

### Key Screens

- **Home**: Quick dashboard with daily metrics, shortcuts, and low-stock alerts
- **Calculator**: Advanced jewelry pricing with multi-metal support and detailed breakdowns
- **Inventory**: Full stock management with search, filter, and sorting capabilities
- **Sales**: Create and track invoices, transactions, and customer orders
- **CRM**: Manage customer profiles, loyalty status, and purchase history
- **Dashboard**: Interactive charts showing revenue trends and business KPIs
- **Assistant**: AI-powered business assistant leveraging Google Gemini for insights
- **Settings**: Configuration for rates, themes, security, and user management

---

## 🧑‍💻 Development & Contributing

We welcome contributions from the community! Here's how to contribute:

### Development Workflow

1. **Fork the repository** on GitHub
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-amazing-feature
   ```
3. **Make your changes** and ensure code quality:
   ```bash
   npm run dev    # Test your changes locally
   npm run build  # Verify production build works
   ```
4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: Add invoiceSharing feature"
   git commit -m "fix: Resolve CRM filter bug"
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/your-amazing-feature
   ```
6. **Submit a Pull Request** with a clear description of your changes

### Contribution Guidelines

- Follow the existing code style and TypeScript conventions
- Ensure all features are type-safe with proper TypeScript types
- Test your changes in both development and production builds
- Update documentation if adding new features
- Keep commits focused and logical

### Areas for Contribution

- UI/UX improvements and accessibility enhancements
- Performance optimization and bug fixes
- New features and integrations
- Documentation and examples
- Test coverage improvements
- Language/localization support

---

## � Support & Documentation

### Getting Help

- **GitHub Issues**: Found a bug or have a feature request? [Create an issue](https://github.com/YOUR_REPO_URL/issues)
- **In-App Assistant**: Use the AI Assistant feature for real-time business advice and troubleshooting
- **Documentation**: Check the workspace docs and code comments for detailed information
- **Email Support**: Reach out to the maintenance team

### Common Questions

**Q: How do I get my Gemini API key?**  
A: Visit [Google AI Studio](https://aistudio.google.com/app/apikey), sign in with your Google account, and create a new API key.

**Q: Can I use this offline?**  
A: Most features work offline. AI features (live rates, assistant) require internet connectivity.

**Q: How do I export sales data?**  
A: Currently, the app stores data in browser storage. Future versions will support data export to CSV/JSON.

**Q: Is there a mobile app?**  
A: The app is responsive and works well on mobile browsers. Native mobile apps may be added in future versions.

---

## 👥 Maintainers & Contributors

**Original Developer**: [Your Name/Organization]  
**Repository**: [GitHub Link]  
**Project Status**: Active Development

### How to Report Issues

When reporting issues, please include:
- Step-by-step reproduction instructions
- Expected behavior vs. actual behavior
- Browser and OS information
- Screenshots or error messages if applicable

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [React 19](https://react.dev/) and [Vite](https://vite.dev/)
- Icons by [Lucide React](https://lucide.dev/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Recharts](https://recharts.org/)

---

**Happy coding! 🚀**
