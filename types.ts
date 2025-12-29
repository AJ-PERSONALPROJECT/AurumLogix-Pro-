
export type MetalType = 'GOLD' | 'SILVER';
export type UserRole = 'OWNER' | 'EMPLOYEE';
export type ThemeMode = 'LIGHT' | 'DARK' | 'SYSTEM';
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface User {
  id: string;
  role: UserRole;
  plan: SubscriptionTier;
  name: string;
  brandName: string;
  brandId: string;
  logo?: string;
  avatar?: string;
  employeeId: string;
  phone?: string;
  password?: string;
  pin?: string; // 4-digit security pin
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  lastPurchaseAt: number;
  isLoyal: boolean;
  notes: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  metalType: MetalType;
  purity: string;
  weight: number;
  wastage: number;
  makingCharges: number;
  gst: number;
  purchasePrice: number;
  finalPrice: number;
  markupPercent: number;
  description: string;
  addedAt: number;
  stockLevel?: number;
  image?: string; 
}

export interface Sale {
  id: string;
  itemId?: string;
  itemName: string;
  category: string;
  customerName: string;
  customerPhone?: string;
  metalType: MetalType;
  weight: number;
  rate: number;
  wastage: number;
  makingCharges: number;
  gst: number;
  finalPrice: number;
  profit: number;
  soldAt: number;
}

export interface MetalRates {
  gold: number;
  silver: number;
  lastUpdated: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface ShopData {
  inventory: InventoryItem[];
  sales: Sale[];
  customers: Customer[];
  rates: MetalRates;
  aiUsageCount: number; // For monetization limiting
  settings: {
    themeMode: ThemeMode;
    useLiveRates: boolean;
    currency: string;
    weightUnit: string;
    manualGoldRate: number;
    manualSilverRate: number;
    assistantName: string;
    taxId?: string;
    isLocked: boolean; // For the PIN lock screen
  };
}

export interface AppState {
  currentUser: User | null;
  userRegistry: User[];
  shopsData: Record<string, ShopData>;
  isSyncing: boolean; 
}
