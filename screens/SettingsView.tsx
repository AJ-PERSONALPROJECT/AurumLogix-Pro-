
import React, { useState } from 'react';
import { useApp } from '../App';
import { 
  User as UserIcon, Moon, Sun, Monitor, Camera, LogOut, Shield, 
  CreditCard, Key, Smartphone, ChevronRight, CheckCircle2, Star, Gem, Crown
} from 'lucide-react';
import { SubscriptionTier, ThemeMode } from '../types';

const SettingsView: React.FC = () => {
  const { user, settings, logout, setThemeMode, setPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BILLING' | 'SECURITY'>('PROFILE');

  const isOwner = user?.role === 'OWNER';

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Settings Navigation */}
      <div className="flex gap-4 p-2 bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-50 dark:border-slate-700 shadow-sm overflow-x-auto">
        <TabBtn active={activeTab === 'PROFILE'} label="Profile" icon={<UserIcon size={18}/>} onClick={() => setActiveTab('PROFILE')} />
        {isOwner && <TabBtn active={activeTab === 'BILLING'} label="Billing & Plans" icon={<CreditCard size={18}/>} onClick={() => setActiveTab('BILLING')} />}
        <TabBtn active={activeTab === 'SECURITY'} label="Security" icon={<Shield size={18}/>} onClick={() => setActiveTab('SECURITY')} />
      </div>

      {activeTab === 'PROFILE' && (
        <section className="space-y-8 animate-in slide-in-from-bottom-2">
          <div className="bg-white dark:bg-slate-800 rounded-[56px] p-12 border-2 border-slate-50 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-12">
            <div className="relative group">
              <div className="w-44 h-44 bg-slate-100 dark:bg-slate-900 rounded-[48px] flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-6xl font-black text-slate-300">{user?.name?.charAt(0)}</span>}
              </div>
              <div className="absolute -bottom-2 -right-2 p-4 bg-yellow-500 text-white rounded-2xl shadow-xl border-4 border-white dark:border-slate-800">
                <Camera size={20} />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h2 className="text-4xl font-black tracking-tight uppercase">{user?.brandName}</h2>
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{user?.plan}</span>
              </div>
              <p className="text-slate-400 font-bold text-lg mb-8 uppercase tracking-widest">{user?.name} • <span className="text-yellow-600 font-black">{user?.role}</span></p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <InfoChip label="Shop ID" val={user?.brandId} />
                <InfoChip label="Employee ID" val={user?.employeeId} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-[48px] p-10 border-2 border-slate-50 dark:border-slate-700">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Appearance</h3>
               <div className="space-y-4">
                 <ThemeBtn active={settings.themeMode === 'SYSTEM'} label="System Dynamic" icon={<Monitor size={20}/>} onClick={() => setThemeMode('SYSTEM')} />
                 <ThemeBtn active={settings.themeMode === 'LIGHT'} label="Solar Light" icon={<Sun size={20}/>} onClick={() => setThemeMode('LIGHT')} />
                 <ThemeBtn active={settings.themeMode === 'DARK'} label="Abyssal Dark" icon={<Moon size={20}/>} onClick={() => setThemeMode('DARK')} />
               </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-[48px] p-10 border-2 border-slate-50 dark:border-slate-700 flex flex-col justify-between">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Session Control</h3>
               <p className="text-slate-500 text-xs mb-10 leading-relaxed font-bold uppercase tracking-widest">Terminate all active connections and secure your data infrastructure.</p>
               <button onClick={logout} className="w-full py-6 bg-red-500 hover:bg-red-600 text-white font-black rounded-3xl transition-all shadow-2xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-3">
                 <LogOut size={20} /> Terminate Session
               </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'BILLING' && (
        <section className="space-y-12 animate-in slide-in-from-bottom-2">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tight">Scale Your Infrastructure</h2>
            <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">Select a plan tailored for your jewelry business growth</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PlanCard 
              name="Free Tier" 
              price="₹0" 
              active={user?.plan === 'FREE'} 
              icon={<Star className="text-slate-400" />}
              features={['15 Inventory Items', '5 AI Queries / mo', 'Standard Calculator']}
              onSelect={() => setPlan('FREE')}
            />
            <PlanCard 
              name="Gold Pro" 
              price="₹2,499" 
              popular 
              active={user?.plan === 'PRO'} 
              icon={<Gem className="text-yellow-500" />}
              features={['500 Inventory Items', '100 AI Queries / mo', 'Live Market Rates', 'Digital Receipts', 'CRM Directory']}
              onSelect={() => setPlan('PRO')}
            />
            <PlanCard 
              name="Diamond" 
              price="₹9,999" 
              active={user?.plan === 'ENTERPRISE'} 
              icon={<Crown className="text-indigo-500" />}
              features={['Unlimited Inventory', 'Unlimited AI Intelligence', 'Multi-User Management', 'Priority Support', 'Custom Branding']}
              onSelect={() => setPlan('ENTERPRISE')}
            />
          </div>
        </section>
      )}

      {activeTab === 'SECURITY' && (
        <section className="bg-white dark:bg-slate-800 rounded-[56px] p-12 border-2 border-slate-50 dark:border-slate-700 shadow-sm animate-in slide-in-from-bottom-2 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[40px] flex items-center justify-center text-slate-400">
              <Smartphone size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Vault Lock PIN</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-sm">Set a 4-digit PIN to secure your business data during quick tablet handovers.</p>
            </div>
            
            <div className="w-full space-y-6 pt-10 border-t border-slate-50 dark:border-slate-700">
              <div className="grid grid-cols-1 gap-6">
                <input type="password" placeholder="Current PIN" className="form-input text-center text-3xl tracking-[1em]" maxLength={4}/>
                <input type="password" placeholder="New PIN" className="form-input text-center text-3xl tracking-[1em]" maxLength={4}/>
              </div>
              <button className="w-full py-6 bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-900 font-black rounded-3xl hover:scale-105 transition-all shadow-xl active:scale-95">Update Security</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${active ? 'bg-slate-900 text-white dark:bg-yellow-500 dark:text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} {label}
  </button>
);

const InfoChip = ({ label, val }: any) => (
  <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{label}</span>
    <span className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200">{val}</span>
  </div>
);

const ThemeBtn = ({ active, label, icon, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all border-2 ${active ? 'bg-yellow-500/5 border-yellow-500/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${active ? 'bg-yellow-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>{icon}</div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{label}</span>
    </div>
    {active && <CheckCircle2 size={20} className="text-yellow-500" />}
  </button>
);

const PlanCard = ({ name, price, active, features, popular, icon, onSelect }: any) => (
  <div className={`p-10 rounded-[48px] border-4 transition-all flex flex-col relative overflow-hidden ${active ? 'border-yellow-500 bg-yellow-500/5' : 'border-slate-50 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-200 shadow-sm'}`}>
    {popular && <div className="absolute top-8 right-[-30px] bg-yellow-500 text-white font-black text-[10px] uppercase py-2 px-12 rotate-45 shadow-lg">Popular</div>}
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-inner">{icon}</div>
    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{name}</h3>
    <div className="flex items-baseline gap-1 mb-10">
      <span className="text-4xl font-black tracking-tighter">{price}</span>
      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ Month</span>
    </div>
    <ul className="space-y-4 mb-12 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">
          <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" /> {f}
        </li>
      ))}
    </ul>
    <button onClick={onSelect} disabled={active} className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${active ? 'bg-green-500 text-white cursor-default' : 'bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-900 hover:scale-105 active:scale-95'}`}>
      {active ? 'Current Plan' : 'Select Infrastructure'}
    </button>
  </div>
);

export default SettingsView;
