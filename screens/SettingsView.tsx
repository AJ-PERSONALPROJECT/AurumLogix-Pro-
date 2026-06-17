
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { 
  User as UserIcon, Moon, Sun, Monitor, Camera, LogOut, Shield, 
  CreditCard, Key, Smartphone, ChevronRight, CheckCircle2, Star, Gem, Crown,
  TrendingUp, TrendingDown, Laptop, Wifi, Usb, RefreshCw, Layers
} from 'lucide-react';
import { SubscriptionTier, ThemeMode } from '../types';

const SettingsView: React.FC = () => {
  const { user, settings, logout, setThemeMode, setPlan, updateSettings, rates, inventory } = useApp();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'RATES' | 'DEVICES' | 'BILLING' | 'SECURITY'>('PROFILE');

  const isOwner = user?.role === 'OWNER';

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Settings Navigation */}
      <div className="flex gap-4 p-2 bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-50 dark:border-slate-700 shadow-sm overflow-x-auto">
        <TabBtn active={activeTab === 'PROFILE'} label="Profile" icon={<UserIcon size={18}/>} onClick={() => setActiveTab('PROFILE')} />
        <TabBtn active={activeTab === 'RATES'} label="Market Overrides" icon={<TrendingUp size={18}/>} onClick={() => setActiveTab('RATES')} />
        <TabBtn active={activeTab === 'DEVICES'} label="Device Sync" icon={<Smartphone size={18}/>} onClick={() => setActiveTab('DEVICES')} />
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

      {activeTab === 'RATES' && (
        <section className="space-y-8 animate-in slide-in-from-bottom-2 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-[56px] p-12 border-2 border-slate-50 dark:border-slate-700 shadow-sm space-y-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Emergency Rates Override</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                Manually control valuation rates in case of live API disconnection, network failure, or custom store tariff overrides.
              </p>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

            {/* Rate Source Select Toggle */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Valuation Rate Source</label>
              <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                <button 
                  type="button" 
                  onClick={() => updateSettings({ useLiveRates: true })} 
                  className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 ${settings.useLiveRates ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${settings.useLiveRates ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
                  Live Market Rates
                </button>
                <button 
                  type="button" 
                  onClick={() => updateSettings({ useLiveRates: false })} 
                  className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 ${!settings.useLiveRates ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${!settings.useLiveRates ? 'bg-white' : 'bg-slate-400'}`}></span>
                  Manual Override
                </button>
              </div>
            </div>

            {/* Active Rates Status Box */}
            <div className={`p-6 rounded-3xl border-2 flex items-center justify-between ${settings.useLiveRates ? 'bg-green-550/5 bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'}`}>
              <div className="text-left space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 block">Active Engine Status</span>
                <span className="font-black text-xs uppercase tracking-wider">
                  {settings.useLiveRates ? 'CONNECTED • Live API Active' : 'DISCONNECTED • Manual Override Active'}
                </span>
              </div>
              <span className="font-extrabold text-xs uppercase px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                Gold: ₹{rates.gold.toLocaleString()}/g • Silver: ₹{rates.silver.toLocaleString()}/g
              </span>
            </div>

            {/* Editing Manual Rates Fields */}
            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-705">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Manual Tariff Controls (INR)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gold Rate (24K, per gram)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-yellow-500 font-bold"
                      value={settings.manualGoldRate}
                      onChange={e => updateSettings({ manualGoldRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                      placeholder="Gold rate per gram..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Silver Rate (per gram)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-yellow-500 font-bold"
                      value={settings.manualSilverRate}
                      onChange={e => updateSettings({ manualSilverRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                      placeholder="Silver rate per gram..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual reassurance footer */}
            <div className="text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em]">
               Changes take environmental effect immediately.
            </div>
          </div>
        </section>
      )}

      {activeTab === 'DEVICES' && (
        <section className="space-y-10 animate-in slide-in-from-bottom-2 max-w-4xl mx-auto">
          {/* Header Description */}
          <div className="bg-white dark:bg-slate-800 rounded-[56px] p-8 md:p-12 border-2 border-slate-50 dark:border-slate-700 shadow-sm space-y-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Cross-Device Terminal Bridge</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                Connect secondary camera-taking hardware, tablet units, or wireless barcode scanner guns to sync items directly with your vault.
              </p>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

            {/* Selector: WIRED vs WIRELESS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Wireless WiFi Pairing Setup */}
              <div className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                      <Wifi size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Wireless Sync (WiFi/QR)</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect handheld smartphones</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Open the camera app on your phone or inventory scanner device and scan the QR code beneath to initiate a persistent secure websockets channel to the PC.
                  </p>
                </div>

                {/* Simulated QR Code */}
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-150 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="relative p-2 bg-slate-50 dark:bg-white rounded-2xl border-4 border-yellow-500/20">
                    <svg width="128" height="128" viewBox="0 0 128 128" className="text-slate-900 dark:text-slate-100">
                      <rect x="0" y="0" width="32" height="32" fill="currentColor" />
                      <rect x="8" y="8" width="16" height="16" fill="white" />
                      <rect x="12" y="12" width="8" height="8" fill="currentColor" />
                      <rect x="96" y="0" width="32" height="32" fill="currentColor" />
                      <rect x="104" y="8" width="16" height="16" fill="white" />
                      <rect x="108" y="12" width="8" height="8" fill="currentColor" />
                      <rect x="0" y="96" width="32" height="32" fill="currentColor" />
                      <rect x="8" y="104" width="16" height="16" fill="white" />
                      <rect x="12" y="108" width="8" height="8" fill="currentColor" />
                      <rect x="48" y="12" width="12" height="12" fill="currentColor" />
                      <rect x="68" y="24" width="16" height="8" fill="currentColor" />
                      <rect x="40" y="48" width="20" height="20" fill="currentColor" />
                      <rect x="76" y="48" width="12" height="32" fill="currentColor" />
                      <rect x="12" y="48" width="16" height="12" fill="currentColor" />
                      <rect x="104" y="80" width="16" height="16" fill="currentColor" />
                      <rect x="48" y="96" width="32" height="12" fill="currentColor" />
                      <rect x="88" y="104" width="20" height="12" fill="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-1.5 bg-yellow-500 rounded-lg text-white font-black text-[8px] uppercase tracking-tighter">
                        AURUM
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">Pairing Address</span>
                    <span className="font-mono text-xs font-black text-yellow-650 dark:text-yellow-500">https://aurumlogix.pro/scan/sync-4129</span>
                  </div>
                </div>
              </div>

              {/* Wired USB Connection Setup */}
              <div className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                      <Usb size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Wired Hookup (USB Cable)</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect direct scanner guns</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Connect your tablet device or portable CCD/laser scanner gun to the PC terminal via a solid USB-C cable. Ensure serial emulation is checked.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interface Instructions</h4>
                  <ol className="text-xs space-y-2 font-bold text-slate-500 dark:text-slate-400 list-decimal pl-4">
                    <li>Plug USB cable firmly into device and main register.</li>
                    <li>Toggle scanner to carriage return payload mode.</li>
                    <li>Click <strong className="text-purple-600 dark:text-purple-400 font-bold">Verify Port Connection</strong> to test serial driver sync.</li>
                  </ol>
                  <button 
                    type="button" 
                    onClick={() => {
                      alert("Successfully initialized USB Serial COM3 Port. Verified baudrate 9600. Terminal ready for barcode keyboard emulation input.");
                    }}
                    className="w-full mt-2 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Verify Port Connection
                  </button>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DEVICE VERIFICATION SANDBOX */}
            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

            <InteractiveDeviceTunnel />
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

const InteractiveDeviceTunnel = () => {
  const [deviceAction, setDeviceAction] = useState<'SCAN' | 'PHOTO'>('SCAN');
  const [selectedItemName, setSelectedItemName] = useState('Glorious Royal Kada');
  const [selectedItemWeight, setSelectedItemWeight] = useState('18.5');
  const [selectedPhoto, setSelectedPhoto] = useState('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80');
  
  const [transferring, setTransferring] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System: Peer listener registered on UDP subnet port 5353.',
    'System: Waiting for wireless handset or USB Laser scanner input signal...'
  ]);

  const [scannedResults, setScannedResults] = useState<{
    type: 'SCAN' | 'PHOTO';
    timestamp: string;
    payload: string;
    previewUrl?: string;
  } | null>(null);

  const mockPreciousPhotos = [
    { name: 'Kada / Royal Bangle', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bridal Solitaire Set', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Traditional Mughal Choker', url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=500&q=80' }
  ];

  const handleTransmit = () => {
    setTransferring(true);
    setTerminalLogs(prev => [...prev, `Handheld: Transmitting payload package via Local Peer Bridge...`]);
    
    setTimeout(() => {
      setTransferring(false);
      const timeStr = new Date().toLocaleTimeString();
      
      if (deviceAction === 'SCAN') {
        const barcodeId = 'BAR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setScannedResults({
          type: 'SCAN',
          timestamp: timeStr,
          payload: `${barcodeId} - ${selectedItemName} (${selectedItemWeight}g)`
        });
        setTerminalLogs(prev => [
          ...prev, 
          `[${timeStr}] Sync Success: Intercepted raw barcode scanner package '${barcodeId}'`,
          `[${timeStr}] Decrypted Metadata: Purity matched (22K Gold), Weight detected (${selectedItemWeight}g)`
        ]);
      } else {
        setScannedResults({
          type: 'PHOTO',
          timestamp: timeStr,
          payload: `COMPRESSED_ASSET_METADATA_JPEG`,
          previewUrl: selectedPhoto
        });
        setTerminalLogs(prev => [
          ...prev, 
          `[${timeStr}] Camera Sync Success: Recieved image stream (415 KB jpeg payload from iPhone Lens)`,
          `[${timeStr}] Decoded Resolution: 2048 x 2048. File validated for upload.`
        ]);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <span className="p-1 px-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-lg text-[9px] font-black uppercase tracking-widest">Diagnostic Sandbox</span>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pairing Handset & Upload Simulator</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
        Verify your mobile device connections! Test barcode scanning signal relays or picture capture triggers wirelessly below:
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left pane: Paired Device Emulator */}
        <div className="p-8 bg-slate-900 text-slate-100 rounded-[40px] border-4 border-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Status strip */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 text-[9px] font-black uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5"><Smartphone size={12} className="text-yellow-500" /> Handset Emulator</span>
            <span className="flex items-center gap-1.5 text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Sync Ready
            </span>
          </div>

          {/* Action selection toggle */}
          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-800 rounded-2xl">
              <button 
                type="button"
                onClick={() => setDeviceAction('SCAN')}
                className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${deviceAction === 'SCAN' ? 'bg-yellow-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Scan Barcode
              </button>
              <button 
                type="button"
                onClick={() => setDeviceAction('PHOTO')}
                className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${deviceAction === 'PHOTO' ? 'bg-yellow-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Camera Photo
              </button>
            </div>

            {deviceAction === 'SCAN' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Select Mock Jewelry Barcode</label>
                  <select 
                    value={selectedItemName} 
                    onChange={e => setSelectedItemName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-yellow-500"
                  >
                    <option value="Glorious Royal Kada">Glorious Royal Kada (22K Gold)</option>
                    <option value="Traditional Mughal Choker">Mughal Collar Choker (24K Gold)</option>
                    <option value="Emerald Crest Ring">Emerald Silver Crest Ring (925 Sterling)</option>
                    <option value="Diamond Stud Deluxe">Certified Solitaire Stud Diamond</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans">Adjust Weight (Grams)</label>
                  <input 
                    type="number"
                    value={selectedItemWeight}
                    onChange={e => setSelectedItemWeight(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-705 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Choose Jewelry Picture to Snap</label>
                <div className="grid grid-cols-3 gap-3">
                  {mockPreciousPhotos.map(p => (
                    <button 
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPhoto(p.url)}
                      className={`aspect-square rounded-2xl overflow-hidden relative border-2 ${selectedPhoto === p.url ? 'border-yellow-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={p.url} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-2">
                  Ready to stream high-definition image asset wirelessly.
                </p>
              </div>
            )}
          </div>

          {/* Trigger button */}
          <button 
            type="button"
            onClick={handleTransmit}
            disabled={transferring}
            className="w-full mt-6 py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-800 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {transferring ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Transmitting Peer Package...
              </>
            ) : (
              <>
                <Layers size={14} />
                {deviceAction === 'SCAN' ? 'Emit Handheld Barcode Signal' : 'Stream Camera Photo Draft'}
              </>
            )}
          </button>
        </div>

        {/* Right pane: PC Desktop Receiver Buffer */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] border border-slate-200 dark:border-slate-700 flex flex-col justify-between min-h-[420px]">
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Terminal Live Interceptor</span>
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-yellow-500/10 text-yellow-650 rounded">
                SECURE KEY: AUR-4129
              </span>
            </div>

            {/* Simulated Live Terminal output stream */}
            <div className="bg-slate-950 p-4 rounded-2xl font-mono text-[9px] text-green-400 space-y-1.5 h-32 overflow-y-auto border-2 border-slate-900 shadow-inner">
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-relaxed whitespace-pre-wrap">{log}</div>
              ))}
            </div>

            {/* Received assets block */}
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Incoming Register / Buffer</span>
              
              {scannedResults ? (
                <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-green-500/10 flex items-center gap-4 animate-in zoom-in-95">
                  {scannedResults.type === 'PHOTO' && scannedResults.previewUrl ? (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img src={scannedResults.previewUrl} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-650 flex items-center justify-center shrink-0 border border-yellow-550/20">
                      <Layers size={18} />
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block">Received {scannedResults.type} ({scannedResults.timestamp})</span>
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block break-all leading-tight">
                      {scannedResults.payload}
                    </span>
                    <span className="text-[9px] mt-1 font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Verified Integrity Handshake
                    </span>
                  </div>
                  
                  {/* Button to verify & apply */}
                  <button 
                    type="button"
                    onClick={() => {
                      alert(`Successfully synchronized! Received content has been verified and registered on the terminal buffers.`);
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                  >
                    Apply Sync
                  </button>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-slate-150 dark:border-slate-700/60 rounded-3xl text-center text-slate-305">
                  <span className="text-[9px] font-black uppercase tracking-widest block">Buffer Empty</span>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Emit a wireless signal to verify camera chunk delivery.</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mt-4">
            Supports USB laser inputs and IEEE 802.11 WiFi handshakes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
