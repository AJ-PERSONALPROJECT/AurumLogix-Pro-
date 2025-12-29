
import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ShoppingCart, 
  Package, 
  ArrowRight,
  Clock,
  Sparkles,
  User as UserIcon,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSalesAdvice } from '../services/geminiService';

const HomeView: React.FC = () => {
  const { user, rates, inventory, sales, settings } = useApp();
  const [advice, setAdvice] = useState<string | null>(null);

  useEffect(() => {
    getSalesAdvice(inventory.length, sales.length).then(setAdvice);
  }, [inventory.length, sales.length]);

  const totalSalesToday = sales
    .filter(s => new Date(s.soldAt).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.finalPrice, 0);

  const isOwner = user?.role === 'OWNER';
  
  // Real-time calculation of low stock
  const lowStockItems = inventory.filter(i => (i.stockLevel ?? 0) < 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Notifications Bar */}
      {lowStockItems.length > 0 && isOwner && (
        <div className="bg-red-500/10 border-2 border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-[24px] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white p-2 rounded-xl">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">Inventory Alert</p>
              <p className="text-xs opacity-80">{lowStockItems.length} items are running low. Replenish soon.</p>
            </div>
          </div>
          <Link to="/inventory" className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
            Restock <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-[40px] p-8 md:p-12 text-white shadow-xl shadow-yellow-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-80 uppercase tracking-widest text-xs font-bold">
            <UserIcon size={14} /> ID: {user?.employeeId || user?.id}
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Welcome back, {user?.name}!</h2>
          <p className="opacity-90 max-w-xl text-lg mb-8 font-medium">
            Manage {user?.brandName}'s operations with {settings.assistantName}. Market Gold at ₹{rates.gold.toLocaleString()}/g.
          </p>
          
          <div className="flex flex-wrap gap-4">
            {isOwner && (
              <Link to="/inventory" className="bg-white/20 backdrop-blur-md hover:bg-white/30 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold">
                <Plus size={20} /> Add Item
              </Link>
            )}
            <Link to="/sales" className="bg-white text-yellow-600 font-black px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95">
              <ShoppingCart size={20} /> New Transaction
            </Link>
          </div>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Rates Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RateCard title="Gold Rate (24K)" rate={rates.gold} unit="per gram" trend={rates.trend} type="GOLD" updatedAt={rates.lastUpdated} />
        <RateCard title="Silver Rate" rate={rates.silver} unit="per gram" trend={rates.trend} type="SILVER" updatedAt={rates.lastUpdated} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={18} /> 
              Pulse Intelligence
            </h3>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm italic text-lg leading-relaxed text-slate-600 dark:text-slate-300 relative overflow-hidden group cursor-pointer hover:border-yellow-500 transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500"></div>
              "{advice || "Analyzing market velocity..."}"
              <Link to="/assistant" className="absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-widest text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">Deep Analysis →</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-2">Replenish Alerts</span>
                <span className={`text-4xl font-black ${lowStockItems.length > 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{lowStockItems.length}</span>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Items needing attention</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-2">Global Sales</span>
                <span className="text-4xl font-black">₹{totalSalesToday.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Daily turnover metrics</p>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-black mb-6 flex items-center justify-between text-lg tracking-tight">
            Live Stream
            <Link to="/sales" className="text-yellow-600 text-xs font-bold uppercase">View Logs</Link>
          </h3>
          <div className="space-y-5">
            {sales.slice(0, 5).map(sale => (
              <div key={sale.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${sale.metalType === 'GOLD' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
                    {sale.metalType === 'GOLD' ? 'G' : 'S'}
                  </div>
                  <div>
                    <div className="font-bold text-sm truncate max-w-[140px]">{sale.itemName}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(sale.soldAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sale.customerName}</div>
                  </div>
                </div>
                <div className="text-sm font-black">₹{sale.finalPrice.toLocaleString()}</div>
              </div>
            ))}
            {sales.length === 0 && <div className="text-center py-16 text-slate-400 text-sm italic">Waiting for first transaction...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const RateCard = ({ title, rate, unit, trend, type, updatedAt }: any) => (
  <div className="p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm relative overflow-hidden group transition-all">
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div>
        <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{title}</h4>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black tracking-tight">₹{rate.toLocaleString()}</span>
          <span className="text-slate-400 text-xs mb-1.5 font-bold uppercase">{unit}</span>
        </div>
      </div>
      <div className={`p-4 rounded-[20px] ${trend === 'UP' ? 'bg-green-100 text-green-600' : trend === 'DOWN' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
        {trend === 'UP' ? <TrendingUp size={28} /> : <ArrowRight size={28} />}
      </div>
    </div>
    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
      <Clock size={12} className="inline mr-1" /> {new Date(updatedAt).toLocaleTimeString()}
    </div>
  </div>
);

export default HomeView;
