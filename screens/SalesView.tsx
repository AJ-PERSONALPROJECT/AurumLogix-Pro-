
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../App';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  User as UserIcon, 
  ShoppingCart,
  X,
  CheckCircle2,
  Calendar,
  Gem,
  FileText,
  Share2,
  Printer
} from 'lucide-react';

const SalesView: React.FC = () => {
  const { sales, inventory, addSale, rates, user } = useApp();
  const location = useLocation();
  const stateFromLocation = location.state as any;

  const [isModalOpen, setIsModalOpen] = useState(() => {
    return !!(stateFromLocation && stateFromLocation.openNewSaleModal);
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  useEffect(() => {
    if (location.state && (location.state as any).openNewSaleModal) {
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const filteredSales = useMemo(() => {
    return sales.filter(s => 
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search invoice or customer..." 
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] pl-16 pr-6 py-5 outline-none focus:border-yellow-500 shadow-sm font-black text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 px-10 rounded-[24px] flex items-center gap-3 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95 ml-auto md:ml-0"
        >
          <ShoppingCart size={22} /> New Transaction
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[40px] border-2 border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b-2 border-slate-100 dark:border-slate-700">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Client</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Piece</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Spec</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                        <UserIcon size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm tracking-tight">{sale.customerName}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(sale.soldAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-sm uppercase tracking-tight">{sale.itemName}</td>
                  <td className="px-8 py-6 text-xs font-black text-slate-400 uppercase">{sale.weight}g {sale.metalType}</td>
                  <td className="px-8 py-6 text-right font-black text-lg">₹{sale.finalPrice.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => setSelectedReceipt(sale)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-40 text-center text-slate-300 italic font-black uppercase tracking-[0.2em] text-xs">Awaiting first documentation...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <SaleModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={s => { addSale(s); setIsModalOpen(false); }}
          inventory={inventory}
          rates={rates}
          prefillCustomer={stateFromLocation?.prefillCustomer}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal 
          sale={selectedReceipt} 
          brand={user?.brandName || 'Jewelry'}
          logo={user?.logo}
          onClose={() => setSelectedReceipt(null)} 
        />
      )}
    </div>
  );
};

const ReceiptModal = ({ sale, brand, logo, onClose }: any) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden">
        <div className="p-12 space-y-8 bg-white text-slate-900 text-left">
           <div className="flex justify-between items-start">
             <div>
               <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">{brand}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Jewelry Infrastructure</p>
             </div>
             {logo && <img src={logo} className="w-16 h-16 object-cover rounded-2xl border-2 border-slate-100" />}
           </div>

           <div className="h-px bg-slate-100"></div>

           <div className="grid grid-cols-2 gap-8">
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice To</p>
               <p className="font-black text-lg">{sale.customerName}</p>
               <p className="text-xs font-bold text-slate-500">{sale.customerPhone || 'N/A'}</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt ID</p>
               <p className="font-black text-xs uppercase tracking-widest">INV-{sale.id.slice(-6)}</p>
             </div>
           </div>

           <div className="space-y-4">
             <div className="flex justify-between items-center py-4 border-b border-slate-50">
               <div>
                 <p className="font-black text-sm">{sale.itemName}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">{sale.weight}g {sale.purity || 'Standard'} {sale.metalType}</p>
               </div>
               <p className="font-black text-sm">₹{sale.finalPrice.toLocaleString()}</p>
             </div>
           </div>

           <div className="space-y-2 text-right">
             <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
               <span>Wastage & Making</span>
               <span className="text-slate-900">₹{(sale.makingCharges + (sale.rate * sale.weight * (sale.wastage/100))).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
               <span>GST (3%)</span>
               <span className="text-slate-900">₹{sale.gst.toLocaleString()}</span>
             </div>
             <div className="pt-4 flex justify-between items-end">
               <span className="font-black text-xs uppercase tracking-[0.2em] text-yellow-600">Total Paid</span>
               <span className="text-4xl font-black tracking-tighter">₹{sale.finalPrice.toLocaleString()}</span>
             </div>
           </div>

           <div className="pt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
             *** This is a digital infrastructure log ***
           </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-900 flex gap-4">
          <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-100 transition-all border border-slate-200 dark:border-slate-700">
            <Printer size={16}/> Print
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-500/20 active:scale-95 transition-all">
            <Share2 size={16}/> Share
          </button>
          <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-2xl text-slate-500 dark:text-slate-300">
            <X size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const SaleModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
  inventory: any[];
  rates: any;
  prefillCustomer?: { name: string; phone: string };
}> = ({ onClose, onSubmit, inventory, rates, prefillCustomer }) => {
  const [formData, setFormData] = useState({
    itemId: '',
    customerName: prefillCustomer?.name || '',
    customerPhone: prefillCustomer?.phone || '',
    itemName: '',
    category: '',
    metalType: 'GOLD',
    weight: '',
    wastage: '2',
    makingCharges: '500',
    gst: '3',
    manualPrice: '',
    useManualPrice: false
  });

  const selectedItem = useMemo(() => inventory.find(i => i.id === formData.itemId), [formData.itemId, inventory]);

  const calculatedPrice = useMemo(() => {
    const rate = formData.metalType === 'GOLD' ? rates.gold : rates.silver;
    const weightVal = parseFloat(formData.weight) || 0;
    const wastageVal = parseFloat(formData.wastage) || 0;
    const makingVal = parseFloat(formData.makingCharges) || 0;
    const gstVal = parseFloat(formData.gst) || 0;
    const base = (rate * weightVal) + (rate * weightVal * (wastageVal / 100)) + makingVal;
    return Math.round(base * (1 + gstVal / 100));
  }, [formData, rates]);

  const finalPrice = formData.useManualPrice ? (parseFloat(formData.manualPrice) || 0) : (selectedItem?.finalPrice || calculatedPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      itemName: selectedItem ? selectedItem.name : formData.itemName,
      category: selectedItem ? selectedItem.category : formData.category,
      metalType: selectedItem ? selectedItem.metalType : formData.metalType,
      weight: selectedItem ? selectedItem.weight : parseFloat(formData.weight),
      rate: formData.metalType === 'GOLD' ? rates.gold : rates.silver,
      finalPrice: finalPrice,
      wastage: parseFloat(formData.wastage),
      makingCharges: parseFloat(formData.makingCharges),
      gst: parseFloat(formData.gst),
      profit: finalPrice * 0.15 // Standard estimation for dummy profit
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-3xl font-black tracking-tight uppercase">New Transaction</h3>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl shadow-xl hover:text-red-500 transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</label>
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} placeholder="Full Name..."/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Contact</label>
              <input type="tel" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} placeholder="+91 ..."/>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select From Vault</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black appearance-none" value={formData.itemId} onChange={e => setFormData({...formData, itemId: e.target.value})}>
              <option value="">-- Manual Lab Input --</option>
              {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.sku || i.category})</option>)}
            </select>
          </div>

          {!formData.itemId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Piece Name</label>
                 <input required type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-black" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})}/>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</label>
                 <input required type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-black" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metal Choice</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-black" value={formData.metalType} onChange={e => setFormData({...formData, metalType: e.target.value as any})}>
                    <option value="GOLD">Gold</option>
                    <option value="SILVER">Silver</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Weight (g)</label>
                  <input required type="number" step="any" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-black" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})}/>
               </div>
            </div>
          )}

          <div className="p-10 bg-slate-900 dark:bg-yellow-500 rounded-[40px] shadow-2xl flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-900 mb-2">Final Settlement Value</span>
            <span className="text-6xl font-black text-white dark:text-slate-900 tracking-tighter">₹{finalPrice.toLocaleString()}</span>
          </div>

          <button type="submit" className="w-full bg-yellow-500 dark:bg-white text-white dark:text-slate-900 font-black py-7 rounded-[32px] hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-2xl shadow-yellow-500/20">
            <CheckCircle2 size={24} /> Authorize Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalesView;
