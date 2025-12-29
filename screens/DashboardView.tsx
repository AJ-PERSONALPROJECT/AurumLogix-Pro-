
import React, { useMemo } from 'react';
import { useApp } from '../App';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, 
  ArrowUpRight, ArrowDownRight, AlertTriangle, Gem,
  Target, CreditCard, Activity
} from 'lucide-react';

const COLORS = ['#EAB308', '#94A3B8', '#F59E0B', '#64748B', '#D97706', '#475569'];

const DashboardView: React.FC = () => {
  const { sales, inventory } = useApp();

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.finalPrice, 0);
    const totalInventoryValue = inventory.reduce((acc, i) => acc + i.finalPrice, 0);
    const totalSalesCount = sales.length;
    const inventoryCount = inventory.length;
    const estimatedProfit = sales.reduce((acc, s) => acc + (s.profit || s.finalPrice * 0.15), 0);
    const margin = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0;
    return { totalRevenue, totalInventoryValue, totalSalesCount, inventoryCount, estimatedProfit, margin };
  }, [sales, inventory]);

  const salesDistribution = useMemo(() => {
    const distribution: Record<string, number> = { 'GOLD': 0, 'SILVER': 0 };
    sales.forEach(s => {
      distribution[s.metalType] = (distribution[s.metalType] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    sales.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [sales]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, amount: 0 }));
    sales.forEach(s => {
      const dayIndex = new Date(s.soldAt).getDay();
      data[dayIndex].amount += s.finalPrice;
    });
    const today = new Date().getDay();
    return [...data.slice(today + 1), ...data.slice(0, today + 1)];
  }, [sales]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Market Turnover" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} trend="+15%" color="bg-green-500" />
        <StatCard title="Estimated ROI" value={`₹${Math.round(stats.estimatedProfit).toLocaleString()}`} icon={<Target size={20} />} trend="+12%" color="bg-yellow-500" />
        <StatCard title="Shop Margin" value={`${stats.margin.toFixed(1)}%`} icon={<Activity size={20} />} trend="STABLE" color="bg-blue-500" />
        <StatCard title="Asset Liquidity" value={`₹${stats.totalInventoryValue.toLocaleString()}`} icon={<Gem size={20} />} trend="+5%" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-12 rounded-[56px] border-2 border-slate-50 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={160} />
          </div>
          <h3 className="text-xl font-black tracking-tight mb-12 flex items-center gap-4 uppercase">
             <TrendingUp className="text-yellow-500" size={24} /> Capital Growth Velocity
          </h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: '900'}} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold', fontSize: '12px' }} />
                <Area type="monotone" dataKey="amount" stroke="#EAB308" strokeWidth={6} fill="url(#flow)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-12 rounded-[56px] border-2 border-slate-50 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-xl font-black tracking-tight mb-12 uppercase">Revenue Mix</h3>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {salesDistribution.map((_, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-12 space-y-6">
            {salesDistribution.map((item, i) => (
              <div key={item.name} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-lg shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.name}</span>
                </div>
                <span className="font-black text-xl">{item.value} Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-slate-800 p-12 rounded-[64px] shadow-2xl">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-4 uppercase">
            <Activity className="text-yellow-500" size={24} /> Performance Breakdown
          </h3>
          <span className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Real-time Intelligence</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryDistribution.map((cat, i) => (
            <div key={cat.name} className="p-8 rounded-[32px] bg-white/5 border border-white/10 transition-transform hover:-translate-y-2 group cursor-pointer">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-3 group-hover:text-yellow-500 transition-colors">{cat.name}</span>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-white">{cat.value}</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Trx</span>
              </div>
            </div>
          ))}
          {categoryDistribution.length === 0 && <p className="col-span-full py-20 text-center text-slate-500 italic font-black uppercase tracking-widest text-xs">Waiting for infrastructure data points...</p>}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }: any) => (
  <div className="p-10 rounded-[48px] border-2 border-slate-50 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 group">
    <div className="flex justify-between items-start mb-10">
      <div className={`p-5 rounded-[24px] ${color} text-white shadow-2xl shadow-${color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className={`flex items-center gap-1 text-[10px] font-black ${trend.startsWith('+') ? 'text-green-500' : 'text-slate-400'} uppercase tracking-widest`}>
        {trend.startsWith('+') ? <ArrowUpRight size={16}/> : <Activity size={16}/>} {trend}
      </div>
    </div>
    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">{title}</span>
    <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default DashboardView;
