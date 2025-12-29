
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { Search, UserPlus, Phone, Mail, Award, Calendar, ChevronRight, X, User } from 'lucide-react';

const CRMView: React.FC = () => {
  const { customers, sales } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-all" size={20} />
          <input 
            type="text" 
            placeholder="Search clients by name or phone..." 
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] pl-16 pr-6 py-5 outline-none focus:border-yellow-500 shadow-sm font-black text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 px-10 rounded-[24px] flex items-center gap-3 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95 ml-auto">
          <UserPlus size={22} /> New Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 font-black text-2xl group-hover:bg-yellow-500 group-hover:text-white transition-all">
                {customer.name.charAt(0)}
              </div>
              {customer.isLoyal && (
                <div className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20">Loyal Client</div>
              )}
            </div>
            
            <h3 className="text-xl font-black mb-1">{customer.name}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Phone size={12} /> {customer.phone}
            </p>

            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-700">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Value</span>
                 <span className="font-black text-sm">₹{customer.totalSpent.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</span>
                 <span className="font-black text-[10px] uppercase">{new Date(customer.lastPurchaseAt).toLocaleDateString()}</span>
               </div>
            </div>

            <button className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              Purchase History <ChevronRight size={14} />
            </button>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-300">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mb-6">
               <User size={32} className="opacity-20" />
             </div>
             <h4 className="text-sm font-black uppercase tracking-[0.2em]">No Clients Found</h4>
             <p className="text-xs font-bold text-slate-400 mt-2">Start building your relationship infrastructure today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRMView;
