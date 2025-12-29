
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Cloud, RefreshCw, Lock, Unlock, ShieldCheck, ChevronRight } from 'lucide-react';
import { 
  User, InventoryItem, Sale, Customer, MetalRates, AppState, 
  MetalType, UserRole, ThemeMode, ShopData, SubscriptionTier
} from './types';
import { NAV_ITEMS, INITIAL_RATES, MOCK_INVENTORY, PLAN_LIMITS } from './constants';
import { fetchLiveRates } from './services/geminiService';

// Screens
import HomeView from './screens/HomeView';
import InventoryView from './screens/InventoryView';
import CalculatorView from './screens/CalculatorView';
import SalesView from './screens/SalesView';
import DashboardView from './screens/DashboardView';
import SettingsView from './screens/SettingsView';
import AuthView from './screens/AuthView';
import AssistantView from './screens/AssistantView';
import CRMView from './screens/CRMView';

interface AppContextType {
  user: User | null;
  inventory: InventoryItem[];
  sales: Sale[];
  customers: Customer[];
  rates: MetalRates;
  settings: ShopData['settings'];
  isSyncing: boolean;
  isLocked: boolean;
  login: (employeeId: string, password: string) => { success: boolean; message: string };
  registerOwner: (userData: any) => { success: boolean; message: string };
  logout: () => void;
  addItem: (item: any) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  addSale: (sale: any) => void;
  updateRates: (rates: Partial<MetalRates>) => void;
  toggleLock: (pin?: string) => void;
  setPlan: (plan: SubscriptionTier) => void;
  incrementAIUsage: () => boolean;
  // Added setThemeMode to fix the error in SettingsView
  setThemeMode: (mode: ThemeMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aurumlogix_v1_prod');
    if (saved) return { ...JSON.parse(saved), isSyncing: false };
    return { currentUser: null, userRegistry: [], shopsData: {}, isSyncing: false };
  });

  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    localStorage.setItem('aurumlogix_v1_prod', JSON.stringify(state));
  }, [state]);

  const currentShopData = useMemo(() => {
    if (!state.currentUser) return null;
    return state.shopsData[state.currentUser.brandId] || null;
  }, [state.currentUser, state.shopsData]);

  const updateShopData = (updater: (prev: ShopData) => ShopData) => {
    if (!state.currentUser) return;
    const bid = state.currentUser.brandId;
    setState(prev => ({
      ...prev,
      isSyncing: true,
      shopsData: { ...prev.shopsData, [bid]: updater(prev.shopsData[bid]) }
    }));
    setTimeout(() => setState(prev => ({ ...prev, isSyncing: false })), 600);
  };

  const login = (employeeId: string, password: string) => {
    const user = state.userRegistry.find(u => u.employeeId === employeeId && u.password === password);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return { success: true, message: "Welcome to your vault." };
    }
    return { success: false, message: "Invalid credentials." };
  };

  const registerOwner = (data: any) => {
    const brandId = 'BID-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const newUser: User = { ...data, id: 'UID-' + Date.now(), brandId, role: 'OWNER', plan: 'FREE' };
    const initialShop: ShopData = {
      inventory: MOCK_INVENTORY,
      sales: [],
      customers: [],
      rates: INITIAL_RATES,
      aiUsageCount: 0,
      settings: {
        themeMode: 'SYSTEM',
        useLiveRates: true,
        currency: 'INR',
        weightUnit: 'grams',
        manualGoldRate: INITIAL_RATES.gold,
        manualSilverRate: INITIAL_RATES.silver,
        assistantName: 'AurumLogix',
        isLocked: false
      }
    };
    setState(prev => ({
      ...prev,
      currentUser: newUser,
      userRegistry: [...prev.userRegistry, newUser],
      shopsData: { ...prev.shopsData, [brandId]: initialShop }
    }));
    return { success: true, message: "Infrastructure Initialized." };
  };

  const incrementAIUsage = () => {
    const plan = state.currentUser?.plan || 'FREE';
    const currentUsage = currentShopData?.aiUsageCount || 0;
    if (currentUsage >= PLAN_LIMITS[plan].aiQueries) return false;
    
    updateShopData(prev => ({ ...prev, aiUsageCount: prev.aiUsageCount + 1 }));
    return true;
  };

  const setPlan = (plan: SubscriptionTier) => {
    setState(prev => ({
      ...prev,
      currentUser: prev.currentUser ? { ...prev.currentUser, plan } : null,
      userRegistry: prev.userRegistry.map(u => u.id === prev.currentUser?.id ? { ...u, plan } : u)
    }));
  };

  const contextValue: AppContextType = {
    user: state.currentUser,
    inventory: currentShopData?.inventory || [],
    sales: currentShopData?.sales || [],
    customers: currentShopData?.customers || [],
    rates: currentShopData?.rates || INITIAL_RATES,
    settings: currentShopData?.settings || { themeMode: 'SYSTEM', useLiveRates: true, currency: 'INR', weightUnit: 'grams', manualGoldRate: INITIAL_RATES.gold, manualSilverRate: INITIAL_RATES.silver, assistantName: 'AurumLogix', isLocked: false },
    isSyncing: state.isSyncing,
    isLocked,
    login,
    registerOwner,
    logout: () => setState(prev => ({ ...prev, currentUser: null })),
    addItem: (item) => updateShopData(prev => ({ ...prev, inventory: [{...item, id: 'ITM-'+Date.now(), addedAt: Date.now()}, ...prev.inventory] })),
    updateItem: (id, ups) => updateShopData(prev => ({ ...prev, inventory: prev.inventory.map(i => i.id === id ? {...i, ...ups} : i) })),
    deleteItem: (id) => updateShopData(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) })),
    addSale: (sale) => updateShopData(prev => ({ ...prev, sales: [{...sale, id: 'SLE-'+Date.now(), soldAt: Date.now()}, ...prev.sales] })),
    updateRates: (r) => updateShopData(prev => ({ ...prev, rates: {...prev.rates, ...r, lastUpdated: Date.now()} })),
    toggleLock: (pin) => {
      if (!isLocked) setIsLocked(true);
      else if (pin === (state.currentUser?.pin || '1234')) setIsLocked(false);
    },
    setPlan,
    incrementAIUsage,
    // Implementation for setThemeMode using updateShopData
    setThemeMode: (mode: ThemeMode) => updateShopData(prev => ({ ...prev, settings: { ...prev.settings, themeMode: mode } }))
  };

  const isDarkMode = currentShopData?.settings.themeMode === 'DARK' || (currentShopData?.settings.themeMode === 'SYSTEM' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
          <HashRouter>
            {!state.currentUser ? <AuthView /> : isLocked ? <VaultLockScreen /> : <Layout />}
          </HashRouter>
        </div>
      </div>
    </AppContext.Provider>
  );
};

const VaultLockScreen = () => {
  const [pin, setPin] = useState('');
  const { toggleLock, user } = useApp();

  const handleInput = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          toggleLock(newPin);
          setPin('');
        }, 300);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-10 z-[999] animate-in fade-in zoom-in-95">
      <div className="w-20 h-20 bg-yellow-500 rounded-[32px] flex items-center justify-center text-white mb-10 shadow-2xl shadow-yellow-500/20 border-4 border-yellow-400">
        <Lock size={32} />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-4">Vault Secure</h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-12">Enter PIN to unlock {user?.brandName}</p>
      
      <div className="flex gap-4 mb-16">
        {[1,2,3,4].map(i => (
          <div key={i} className={`w-6 h-6 rounded-full border-2 border-slate-700 transition-all ${pin.length >= i ? 'bg-yellow-500 border-yellow-500 scale-125 shadow-lg shadow-yellow-500/50' : ''}`}></div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-xs w-full">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="h-20 rounded-3xl bg-slate-900 hover:bg-slate-800 text-2xl font-black transition-all active:scale-90">{n}</button>
        ))}
        <div />
        <button onClick={() => handleInput('0')} className="h-20 rounded-3xl bg-slate-900 hover:bg-slate-800 text-2xl font-black transition-all active:scale-90">0</button>
        <button onClick={() => setPin('')} className="h-20 rounded-3xl bg-red-900/20 text-red-500 text-sm font-black uppercase tracking-widest">CLR</button>
      </div>
    </div>
  );
};

const Layout: React.FC = () => {
  const { user, isSyncing, toggleLock } = useApp();
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 sticky top-0 h-screen p-6">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-white font-black overflow-hidden shadow-xl">
            {user?.logo ? <img src={user.logo} className="w-full h-full object-cover" /> : user?.brandName?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter">{user?.brandName}</span>
              {user?.plan !== 'FREE' && <span className="text-[8px] bg-yellow-500 text-white px-1.5 py-0.5 rounded font-black uppercase">PRO</span>}
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{user?.role} Portal</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-slate-900 text-white dark:bg-yellow-500 dark:text-slate-900 shadow-xl translate-x-1' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              {item.icon}
              <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 space-y-4 border-t border-slate-100 dark:border-slate-700">
          <button onClick={() => toggleLock()} className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-slate-100 transition-all group">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lock Vault</span>
            <Lock size={16} className="text-slate-400 group-hover:text-yellow-500" />
          </button>
          <div className="flex items-center justify-between px-4 py-2 opacity-50">
             <div className="flex items-center gap-2">
               {isSyncing ? <RefreshCw size={12} className="animate-spin text-yellow-500" /> : <Cloud size={12} className="text-green-500" />}
               <span className="text-[9px] font-black uppercase tracking-widest">{isSyncing ? 'Syncing...' : 'Secure Cloud'}</span>
             </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
           <div className="flex items-center gap-4 md:hidden">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-white font-black overflow-hidden">{user?.logo ? <img src={user.logo} className="w-full h-full object-cover" /> : user?.brandName?.charAt(0)}</div>
           </div>
           <h1 className="text-xl font-black uppercase tracking-tighter">
             {NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Boutique'}
           </h1>
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black">{user?.name}</p>
                <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">{user?.plan} PLAN</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-black uppercase">{user?.name?.charAt(0)}</div>}
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/customers" element={<CRMView />} />
            <Route path="/calculator" element={<CalculatorView />} />
            <Route path="/sales" element={<SalesView />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/assistant" element={<AssistantView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <nav className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around py-4">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? 'text-yellow-500' : 'text-slate-400'}`}>
              {item.icon}
              <span className="text-[8px] font-black uppercase">{item.label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default App;
