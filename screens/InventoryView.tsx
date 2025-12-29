
import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../App';
import { 
  Plus, Search, Edit2, Trash2, X, AlertCircle, Package, 
  ChevronRight, Gem, Camera, Image as ImageIcon 
} from 'lucide-react';
import { GOLD_PURITIES, SILVER_PURITIES } from '../constants';
import { InventoryItem } from '../types';

const InventoryView: React.FC = () => {
  const { user, inventory, addItem, updateItem, deleteItem, rates } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const isOwner = user?.role === 'OWNER';

  const categories = useMemo(() => {
    return Array.from(new Set(inventory.map(item => item.category))).sort();
  }, [inventory]);

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, categoryFilter]);

  const groupedInventory = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);
  }, [filteredItems]);

  const handleSave = (item: any) => {
    if (editingItem) {
      updateItem(editingItem.id, item);
    } else {
      addItem(item);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-[450px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category or tag..." 
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] pl-16 pr-6 py-5 outline-none focus:border-yellow-500 transition-all shadow-sm font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
             {['All', ...categories.slice(0, 3)].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategoryFilter(cat)}
                 className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
          {isOwner && (
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 px-10 rounded-[24px] flex items-center gap-3 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95 ml-auto"
            >
              <Plus size={22} /> Add Piece
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      <div className="space-y-12">
        {Object.keys(groupedInventory).sort().map(cat => (
          <section key={cat} className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                <Gem size={18} className="text-yellow-500" /> {cat}
              </h3>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700 opacity-50"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase">{groupedInventory[cat].length} In Stock</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {groupedInventory[cat].map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-[40px] overflow-hidden shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col">
                  {/* Image Container */}
                  <div className="h-56 w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden group-hover:brightness-110 transition-all">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 space-y-2 opacity-50">
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className="text-[9px] font-black uppercase tracking-widest">No Visual Record</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl backdrop-blur-md ${item.metalType === 'GOLD' ? 'bg-yellow-500/90 text-white' : 'bg-slate-600/90 text-white'}`}>
                        {item.purity} {item.metalType}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-xl tracking-tight leading-none truncate max-w-[80%]">{item.name}</h4>
                      {isOwner && (
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-yellow-600 transition-colors">
                            <Edit2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-400 text-xs mb-8 line-clamp-2 font-medium leading-relaxed">
                      {item.description || 'Exclusive handcrafted design for our boutique vault.'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Weight</div>
                          <div className="font-black text-sm">{item.weight}g</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Level</div>
                          <div className={`font-black text-sm ${item.stockLevel && item.stockLevel < 5 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                            {item.stockLevel || 0} PCS
                          </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-1">Valuation</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">₹{item.finalPrice.toLocaleString()}</span>
                      </div>
                      <button onClick={() => isOwner && deleteItem(item.id)} className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        {inventory.length === 0 && (
          <div className="py-40 flex flex-col items-center justify-center text-slate-300 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mb-8">
              <Package size={48} className="opacity-20" />
            </div>
            <p className="text-lg font-black uppercase tracking-[0.2em]">Vault is Empty</p>
            <p className="text-sm font-medium text-slate-400 mt-2">Initialize your inventory infrastructure today.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <InventoryModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
          initialData={editingItem}
          currentRates={rates}
        />
      )}
    </div>
  );
};

const InventoryModal: React.FC<{ 
  onClose: () => void; 
  onSave: (data: any) => void; 
  initialData?: InventoryItem | null;
  currentRates: any;
}> = ({ onClose, onSave, initialData, currentRates }) => {
  const [formData, setFormData] = useState<any>(initialData || {
    name: '',
    category: '',
    metalType: 'GOLD',
    purity: '',
    weight: '',
    wastage: '2',
    makingCharges: '500',
    gst: '3',
    purchasePrice: '0',
    description: '',
    stockLevel: '10',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const finalPrice = useMemo(() => {
    const rate = formData.metalType === 'GOLD' ? currentRates.gold : currentRates.silver;
    const weightVal = parseFloat(formData.weight) || 0;
    const wastageVal = parseFloat(formData.wastage) || 0;
    const makingVal = parseFloat(formData.makingCharges) || 0;
    const gstVal = parseFloat(formData.gst) || 0;
    const base = (rate * weightVal) + (rate * weightVal * (wastageVal / 100)) + makingVal;
    return Math.round(base * (1 + gstVal / 100));
  }, [formData, currentRates]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[56px] shadow-2xl overflow-hidden my-8">
        <div className="p-10 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-3xl font-black tracking-tight uppercase leading-none mb-2">{initialData ? 'Refine Record' : 'Vault Entry'}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documenting unique jewelry infrastructure</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl shadow-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"><X size={24} /></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave({ ...formData, finalPrice, stockLevel: parseInt(formData.stockLevel) }); }} className="p-12 space-y-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Image Picker */}
            <div className="w-full lg:w-72 space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Visual Asset</label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="aspect-square bg-slate-50 dark:bg-slate-900 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-all overflow-hidden relative group"
               >
                 {formData.image ? (
                   <>
                    <img src={formData.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={32} className="text-white" />
                    </div>
                   </>
                 ) : (
                   <div className="text-center p-6 space-y-3 opacity-30">
                     <Camera size={40} className="mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Capture or Upload</p>
                   </div>
                 )}
               </div>
               <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Form Content */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper label="Masterpiece Name">
                  <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Imperial Ruby Choker"/>
                </InputWrapper>
                <InputWrapper label="Classification">
                  <input required type="text" className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Necklace"/>
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper label="Infrastructure Metal">
                  <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                    <button type="button" onClick={() => setFormData({...formData, metalType: 'GOLD'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.metalType === 'GOLD' ? 'bg-yellow-500 text-white shadow-lg' : 'text-slate-400'}`}>Gold</button>
                    <button type="button" onClick={() => setFormData({...formData, metalType: 'SILVER'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.metalType === 'SILVER' ? 'bg-slate-500 text-white shadow-lg' : 'text-slate-400'}`}>Silver</button>
                  </div>
                </InputWrapper>
                <InputWrapper label="Purity Metric">
                  <input required type="text" className="form-input" value={formData.purity} onChange={e => setFormData({...formData, purity: e.target.value})} placeholder="e.g. 24K / 925"/>
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Field label="Net Weight (g)" value={formData.weight} onChange={v => setFormData({...formData, weight: v})} />
                <Field label="Wastage %" value={formData.wastage} onChange={v => setFormData({...formData, wastage: v})} />
                <Field label="Making (₹)" value={formData.makingCharges} onChange={v => setFormData({...formData, makingCharges: v})} />
                <Field label="Initial Stock" value={formData.stockLevel} onChange={v => setFormData({...formData, stockLevel: v})} />
              </div>

              <InputWrapper label="Creative Description">
                <textarea rows={3} className="form-input resize-none py-4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the craftsmanship..."/>
              </InputWrapper>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Estimated Retail Value</span>
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">₹{finalPrice.toLocaleString()}</span>
            </div>
            <button type="submit" className="w-full md:w-auto bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-900 font-black px-16 py-6 rounded-[32px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-500/20 uppercase tracking-widest text-sm">
              Finalize Record
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 1.25rem;
          padding: 1rem 1.5rem;
          outline: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .dark .form-input {
          background: #0f172a;
          border-color: #1e293b;
          color: white;
        }
        .form-input:focus {
          border-color: #eab308;
          box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1);
        }
      `}</style>
    </div>
  );
};

const InputWrapper = ({ label, children }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    {children}
  </div>
);

const Field = ({ label, value, onChange }: any) => (
  <InputWrapper label={label}>
    <input type="number" step="any" className="form-input px-4 py-3" value={value} onChange={e => onChange(e.target.value)}/>
  </InputWrapper>
);

export default InventoryView;
