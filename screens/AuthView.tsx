
import React, { useState } from 'react';
import { useApp } from '../App';
import { 
  User as UserIcon, Lock, Phone, Briefcase, ChevronRight, ShieldCheck, AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';

const AuthView: React.FC = () => {
  const { login, registerOwner } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    role: 'OWNER' as UserRole,
    employeeId: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    brandName: '',
    employeeCount: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const result = login(formData.employeeId, formData.password);
      if (!result.success) setError(result.message);
    } else {
      if (step === 1) {
        if (formData.role === 'EMPLOYEE') {
          setError("Employees cannot register directly. Please contact your shop owner.");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        setStep(2);
      } else {
        const result = registerOwner({
          employeeId: formData.employeeId,
          password: formData.password,
          phone: formData.phone,
          name: formData.name,
          brandName: formData.brandName
        });
        if (!result.success) setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-xl animate-in zoom-in-95 duration-500">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-yellow-500 rounded-[32px] mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-yellow-500/40">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white uppercase">JewelTrack Pro</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Secure Shop Infrastructure</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[64px] shadow-2xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="flex p-3 bg-slate-50 dark:bg-slate-950 m-8 rounded-[32px] border border-slate-100 dark:border-slate-800">
            <button onClick={() => { setIsLogin(true); setError(null); }} className={`flex-1 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${isLogin ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>Sign In</button>
            <button onClick={() => { setIsLogin(false); setStep(1); setError(null); }} className={`flex-1 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${!isLogin ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400'}`}>Create Shop</button>
          </div>

          <form onSubmit={handleSubmit} className="p-12 pt-4 space-y-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {isLogin ? (
              <>
                <AuthInput icon={<UserIcon size={18}/>} placeholder="Login ID" value={formData.employeeId} onChange={v => setFormData({...formData, employeeId: v})} />
                <AuthInput icon={<Lock size={18}/>} type="password" placeholder="Access Key" value={formData.password} onChange={v => setFormData({...formData, password: v})} />
              </>
            ) : (
              step === 1 ? (
                <>
                  <AuthInput icon={<UserIcon size={18}/>} placeholder="Choose Login ID" value={formData.employeeId} onChange={v => setFormData({...formData, employeeId: v})} />
                  <AuthInput icon={<Phone size={18}/>} placeholder="Phone Contact" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                  <AuthInput icon={<Lock size={18}/>} type="password" placeholder="Set Password" value={formData.password} onChange={v => setFormData({...formData, password: v})} />
                  <AuthInput icon={<Lock size={18}/>} type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={v => setFormData({...formData, confirmPassword: v})} />
                </>
              ) : (
                <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                  <AuthInput icon={<UserIcon size={18}/>} placeholder="Your Full Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                  <AuthInput icon={<Briefcase size={18}/>} placeholder="Jewelry Brand Name" value={formData.brandName} onChange={v => setFormData({...formData, brandName: v})} />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Planned Organization Size</label>
                    <input type="number" min="1" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl px-8 py-5 outline-none font-black" value={formData.employeeCount} onChange={e => setFormData({...formData, employeeCount: e.target.value})}/>
                  </div>
                </div>
              )
            )}

            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-yellow-500/40 flex items-center justify-center gap-3 active:scale-95 transition-all group">
              {isLogin ? 'Establish Session' : (step === 1 ? 'Configure Shop' : 'Initialize Infrastructure')}
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AuthInput = ({ icon, placeholder, type = "text", value, onChange }: any) => (
  <div className="relative">
    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
    <input 
      required 
      type={type} 
      placeholder={placeholder} 
      autoComplete="off"
      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-yellow-500 transition-all font-black text-sm" 
      value={value} 
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default AuthView;
