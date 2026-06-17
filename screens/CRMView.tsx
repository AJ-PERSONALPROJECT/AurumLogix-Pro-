import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Phone, Mail, Award, Calendar, ChevronRight, X, User } from 'lucide-react';

const CRMView: React.FC = () => {
  const { customers, sales, addCustomer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-all" size={20} />
          <input 
            type="text" 
            placeholder="Search clients by name, phone, email..." 
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] pl-16 pr-6 py-5 outline-none focus:border-yellow-500 shadow-sm font-black text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 px-10 rounded-[24px] flex items-center gap-3 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95 ml-auto"
        >
          <UserPlus size={22} /> New Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-450 text-slate-500 dark:text-slate-350 font-black text-2xl group-hover:bg-yellow-500 group-hover:text-white transition-all">
                  {customer.name.charAt(0)}
                </div>
                {customer.isLoyal && (
                  <div className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 animate-pulse">Loyal Client</div>
                )}
              </div>
              
              <h3 className="text-xl font-black mb-1 text-slate-900 dark:text-white">{customer.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Phone size={12} /> {customer.phone}
              </p>
              {customer.email && (
                <p className="text-slate-400 text-[10px] font-semibold tracking-wide mb-6 flex items-center gap-2 truncate">
                  <Mail size={12} className="opacity-80" /> {customer.email}
                </p>
              )}

              <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-700">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Value</span>
                   <span className="font-black text-sm text-yellow-600 dark:text-yellow-500">₹{customer.totalSpent.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</span>
                   <span className="font-black text-[10px] uppercase text-slate-700 dark:text-slate-300">{new Date(customer.lastPurchaseAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCustomer(customer)}
              className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-2"
            >
              Purchase History <ChevronRight size={14} />
            </button>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-300">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mb-6">
               <User size={32} className="opacity-20" />
             </div>
             <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">No Clients Found</h4>
             <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Start building your relationship infrastructure today.</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddCustomerModal 
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data) => {
            addCustomer(data);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {selectedCustomer && (
        <CustomerDetailsModal 
          customer={selectedCustomer}
          sales={sales}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

const AddCustomerModal: React.FC<{ onClose: () => void; onSubmit: (data: any) => void }> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    isLoyal: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[40px] border-2 border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden p-8 md:p-12 space-y-8">
        <div className="flex justify-between items-center border-b border-indigo-50 dark:border-slate-700 pb-6">
          <h3 className="text-2xl font-black uppercase tracking-tight text-slate-905 text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus size={24} className="text-yellow-500" /> New Client
          </h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <input 
              required 
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-bold" 
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
            <input 
              required 
              type="tel" 
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-bold" 
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-bold" 
              placeholder="e.g. ramesh@gmail.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
            <textarea 
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-bold resize-none" 
              placeholder="Preferences, wedding date, custom sizes..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 bg-yellow-50/50 dark:bg-yellow-500/10 p-4 rounded-2xl border border-yellow-250 border-yellow-200 dark:border-yellow-500/25">
            <input 
              type="checkbox" 
              id="isLoyal" 
              className="w-5 h-5 rounded accent-yellow-500 cursor-pointer"
              checked={formData.isLoyal}
              onChange={e => setFormData({ ...formData, isLoyal: e.target.checked })}
            />
            <label htmlFor="isLoyal" className="text-xs font-black text-yellow-700 dark:text-yellow-400 cursor-pointer uppercase tracking-wider">
              Mark as VIP / Loyal Client
            </label>
          </div>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-yellow-500/20 active:scale-95 uppercase tracking-wider text-xs">
            Save Client Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const CustomerDetailsModal: React.FC<{ customer: any; sales: any[]; onClose: () => void }> = ({ customer, sales, onClose }) => {
  const navigate = useNavigate();
  const customerSales = useMemo(() => {
    return sales.filter(s => 
      (customer.phone && s.customerPhone === customer.phone) || 
      (s.customerName && s.customerName.toLowerCase() === customer.name.toLowerCase())
    );
  }, [customer, sales]);

  const stats = useMemo(() => {
    const totalTransactions = customerSales.length;
    const avgSpend = totalTransactions > 0 ? customer.totalSpent / totalTransactions : 0;
    return { totalTransactions, avgSpend };
  }, [customerSales, customer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 h-full w-full max-w-xl shadow-2xl overflow-y-auto p-8 md:p-12 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-500 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-xl shadow-yellow-500/20">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-850 dark:text-white uppercase tracking-tight text-slate-900">{customer.name}</h3>
                {customer.isLoyal && (
                  <span className="inline-block mt-1 px-3 py-1 bg-yellow-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Loyal Client</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-xl hover:text-red-500 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="h-px bg-slate-105 bg-slate-100 dark:bg-slate-700"></div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-3">
                <Phone className="text-slate-400" size={18} />
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">Phone</p>
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{customer.phone}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-3">
                <Mail className="text-slate-400" size={18} />
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">Email Address</p>
                  <p className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[150px]">{customer.email || 'None Provided'}</p>
                </div>
              </div>
            </div>
            {customer.notes && (
              <div className="p-4 bg-yellow-50/20 dark:bg-slate-900/50 border border-yellow-100/30 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-yellow-600 dark:text-yellow-400 mb-1">Internal Notes</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic">{customer.notes}</p>
              </div>
            )}
          </div>

          {/* Sales Stats Summary */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Relationship Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Total Spent</p>
                <p className="font-black text-lg text-yellow-600 dark:text-yellow-500">₹{customer.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Invoices</p>
                <p className="font-black text-lg text-slate-805 text-slate-800 dark:text-white">{stats.totalTransactions}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Avg. Ticket</p>
                <p className="font-black text-lg text-slate-800 dark:text-white">₹{Math.round(stats.avgSpend).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Past Purchases */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Award size={16} className="text-yellow-500" /> Historic Purchases ({customerSales.length})
            </h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {customerSales.map((sale: any) => (
                <div key={sale.id} className="p-4 bg-white dark:bg-slate-905 dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex justify-between items-center hover:border-yellow-500/40 transition-all">
                  <div>
                    <p className="font-black text-sm text-slate-800 dark:text-white">{sale.itemName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                      {sale.weight}g {sale.purity || ''} {sale.metalType} • {new Date(sale.soldAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-slate-800 dark:text-white">₹{sale.finalPrice.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">INV-{sale.id.slice(-6)}</p>
                  </div>
                </div>
              ))}
              {customerSales.length === 0 && (
                <div className="text-center py-10 text-slate-300 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No past transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 mt-8 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => {
              onClose();
              navigate('/sales', { state: { openNewSaleModal: true, prefillCustomer: { name: customer.name, phone: customer.phone } } });
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/10"
          >
            Create New Transaction / Invoice
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-black py-4 rounded-xl uppercase tracking-widest text-[10px] transition-all"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRMView;
