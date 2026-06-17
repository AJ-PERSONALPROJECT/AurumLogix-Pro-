# 🌟 AurumLogix Pro

[![Vite Build](https://img.shields.io/badge/Build-Vite%20%2F%20React%2019-yellow.svg)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide--React-orange.svg)](https://lucide.dev/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-magenta.svg)](#assistant-and-ai-intelligence)

AurumLogix Pro is a professional-grade, high-performance web suite designed for modern luxury retail jewelry stores. [Why this title & description was chosen: The name **AurumLogix** purposefully merges *Aurum* (the noble Latin name for gold, symbol Au) with *Logix* (logic-driven material logistics). This conveys our precise financial formula engine and smart catalog bookkeeping. The *Pro* suffix signals its built-to-scale enterprise capabilities tailored for high-end retail showrooms, replacing disorganized spreadsheet systems with high-fidelity, real-time inventory assets.]

Combining intelligent material valuation trackers, extensive inventory management, a visual interactive sales desk, secure customer relationship metrics (CRM), and a dynamic jewelry pricing engine, the platform streamlines gold and silver store administration.

Developed with React 19, TypeScript, and Vite, it delivers instant response times, fluid layout transitions, and multi-device capabilities wrapped in an eye-friendly, elegant user interface.

---

## ✨ Key Features & Benefits

### 💎 Advanced Jewelry Pricing Lab
- **Multi-Metal Valuator**: Configure raw Gold (adjusted by custom purity levels: 24K, 22K, 18K, 14K) and Silver standards (999 Pure, 925 Sterling, 900 Coin).
- **Flexible Workmanship Billing**: Toggle workmanship/making rates seamlessly between percentage, per-gram, and flat pricing structures.
- **Detailed Settlement Itemization**: View precise breakdowns including material content costs, wastage allowances, workmanship charges, and tax additions (GST/VAT).
- **Standard Physical Calculator**: Quick access to a fully responsive, log-retaining financial accounting keys panel.

### 📱 Wireless/Wired Cross-Device Terminal Bridge (New!)
- **Dynamic Camera Snapshot Sync**: Scan on-screen QR codes containing dynamic parameters to link any mobile device via WiFi. Instantly snap photos on your smartphone and upload them straight into your PC register's visual asset library.
- **Keyboard Barcode Laser Emulation**: Hook up handheld CCD scanner guns via USB/serial wire interfaces. Supports automatic ASCII return parsing to instant-verify stock identities locally.
- **Real-Time Pairing Logs**: Debug using the integrated Terminal Interceptor console to inspect and verify inbound chunk packet structures before finalizing catalog uploads.

### 📦 Premium Inventory Management
- **Intelligent Stock Ledger**: Search, filter, and classify gold, silver, diamonds, and precious gemstones in individual categories.
- **Dynamic Sort Controls**: Order your inventory by price ranges, material weights, catalog names, or stock quantities.
- **Automated Reorder Warnings**: Visually inspect pieces showing low-stock statuses (less than 5 units left) to trigger instant refills.

### 👤 Customer Relationship Manager (CRM)
- **VIP Customer Highlighting**: Flag loyal high-volume clients who meet or exceed cumulative VIP investment benchmarks (e.g., ₹50,000+).
- **Lifetime Value Tracking**: View overall receipts, maximum purchases, and visit history drawers in a beautiful slidable layout.
- **Interlinked Transaction Drafts**: Directly draft new transaction receipts pre-filled with specific customer profile coordinates straight from the CRM screen.

### 📈 Instant Valuation Override (Settings)
- **Emergency Rates Override**: Switch of live precious metal price feeds in favor of manual tariffs if internet access fails, API limits are reached, or customized store margin overrides are required.
- **Interactive Global Personalizations**: Choose dark, light, or system themes; lock down terminals when stepping away; and view employee access levels.

---

## 🛠️ Architecture & Tech Stack

The application employs a highly responsive component model, capitalizing on modern client-side storage states and type-safe architectures:

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev) (for compiled speed and lightning-fast HMR simulation).
- **Style Engine**: [Tailwind CSS](https://tailwindcss.com/) (modern typography, fluid layouts, cohesive shadows, and dark mode integration).
- **Typings**: Native TypeScript (strict type tracking for inventory weights, purities, transactions, rates, and users).
- **Icons**: [Lucide React](https://lucide.dev) (flexible SVG representation).
- **Visuals**: [Recharts](https://recharts.org/) (for interactive gold/silver trends and invoice trackers).

---

## 🚀 Getting Started

### Prerequisites

Verify that you have [Node.js](https://nodejs.org/) installed on your workstation.

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation & Standalone Running

Follow these direct steps to compile and execute the system in a local server shell:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd aurumlogix-pro
   ```

2. **Install all bundle dependencies**:
   ```bash
   npm install
   ```

3. **Launch the development environment server**:
   ```bash
   npm run dev
   ```
   *The server dynamically provisions on [http://localhost:3000](http://localhost:3000) or the configured port.*

4. **Verify / Compile for production release**:
   ```bash
   npm run build
   ```
   *Compiles compressed optimal production-ready assets inside the `/dist` directory.*

---

## 📂 Project Structure

```text
├── src/
│   ├── components/            # Extracted UI containers, modals, and sidebar layouts
│   ├── screens/               # Individual functional vistas
│   │   ├── AssistantView.tsx  # Gemini-powered management chat console
│   │   ├── AuthView.tsx       # Multi-employee role-based secure login
│   │   ├── CalculatorView.tsx # Weight, wastage, making, and taxes pricing sandbox
│   │   ├── CRMView.tsx        # Customer directories, loyalty, and pre-filled invoice flows
│   │   ├── DashboardView.tsx  # Interactive revenue charts & business KPIs
│   │   ├── HomeView.tsx       # Landing desk with transaction and collection shortcuts
│   │   ├── InventoryView.tsx  # Stock logs with advanced sorting and filter bars
│   │   ├── SalesView.tsx      # Invoices, transactions history, and recipe drafts
│   │   └── SettingsView.tsx   # emergency overrides, personalizations, and theme shifts
│   │
│   ├── services/              # External integrations
│   │   └── geminiService.ts   # Model orchestration to provide intelligent insights
│   │
│   ├── App.tsx                # Context providers, routing hubs, state synchronization
│   ├── constants.tsx          # Default purities, users registry, item lists
│   ├── index.css              # Font definitions (Inter, JetBrains Mono) & Tailwind
│   ├── main.tsx               # Bootstrap entry point
│   └── types.ts               # Strict TS contracts
├── package.json               # Main bundle declaration
└── metadata.json              # App permission permissions
```

---

## 🧑‍💻 Contributing

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. **Commit** your modifications with informative, clear descriptions:
   ```bash
   git commit -m 'feat: Add elegant digital invoice sharing'
   ```
3. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
4. Submitting a **Pull Request** for approval.

---

## 🔑 Support and Help

For assistance, troubleshooting, or inquiries, review the following resources:
- Create an issue on our GitHub issues page.
- Direct documentation resources inside your local workspace.
- Chat directly with your in-store assistant in **AurumLogix AI Assistant** view on the primary sidebar navigation.
