
import React from 'react';
import { 
  Home, 
  Package, 
  Calculator, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  MessageSquareText,
  Users
} from 'lucide-react';
import { InventoryItem, MetalRates } from './types';

export const NAV_ITEMS = [
  { label: 'Home', icon: <Home size={20} />, path: '/' },
  { label: 'Inventory', icon: <Package size={20} />, path: '/inventory' },
  { label: 'Customers', icon: <Users size={20} />, path: '/customers' }, // New CRM entry
  { label: 'Assistant', icon: <MessageSquareText size={20} />, path: '/assistant' },
  { label: 'Calculator', icon: <Calculator size={20} />, path: '/calculator' },
  { label: 'Sales', icon: <ShoppingCart size={20} />, path: '/sales' },
  { label: 'Dashboard', icon: <BarChart2 size={20} />, path: '/dashboard' },
  { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

export const PLAN_LIMITS = {
  FREE: { inventory: 15, aiQueries: 5, features: ['Basic Analytics', 'Manual Rates'] },
  PRO: { inventory: 500, aiQueries: 100, features: ['Live Rates', 'AI Assistant', 'CSV Export', 'Receipt Printing'] },
  ENTERPRISE: { inventory: 10000, aiQueries: Infinity, features: ['Multi-User', 'Priority AI', 'Full CRM', 'Custom Branding'] }
};

export const METAL_CATEGORIES = [
  'Ring', 'Necklace', 'Earrings', 'Bracelet', 'Bangle', 'Pendant', 'Chain', 'Other'
];

export const GOLD_PURITIES = ['24K', '22K', '18K', '14K'];
export const SILVER_PURITIES = ['999', '925', '900'];

export const INITIAL_RATES: MetalRates = {
  gold: 7200,
  silver: 95,
  lastUpdated: Date.now(),
  trend: 'UP' as const,
};

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    sku: 'G-RING-001',
    name: 'Classic Gold Ring',
    category: 'Ring',
    metalType: 'GOLD',
    purity: '22K',
    weight: 4.5,
    wastage: 2,
    makingCharges: 450,
    gst: 3,
    purchasePrice: 32000,
    finalPrice: 34500,
    markupPercent: 7.8,
    description: 'Beautifully crafted 22K gold wedding band.',
    stockLevel: 12,
    addedAt: Date.now() - 86400000 * 5
  },
  {
    id: '2',
    sku: 'S-BRAC-001',
    name: 'Silver Bracelet',
    category: 'Bracelet',
    metalType: 'SILVER',
    purity: '925',
    weight: 25,
    wastage: 5,
    makingCharges: 1200,
    gst: 3,
    purchasePrice: 3500,
    finalPrice: 4200,
    markupPercent: 20,
    description: 'Elegant sterling silver linked bracelet.',
    stockLevel: 1,
    addedAt: Date.now() - 86400000 * 2
  }
];
