
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../App';
import { 
  Calculator, 
  History, 
  RotateCcw, 
  Gem,
  Check,
  TrendingUp
} from 'lucide-react';

const CalculatorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'JEWELRY' | 'SIMPLE'>('JEWELRY');
  const { rates } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex p-2 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border-2 border-slate-100 dark:border-slate-700">
        <button onClick={() => setActiveTab('JEWELRY')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'JEWELRY' ? 'bg-yellow-500 text-white shadow-xl shadow-yellow-500/20' : 'text-slate-400 hover:text-slate-600'}`}>
          <Gem size={20} /> Jewelry Lab
        </button>
        <button onClick={() => setActiveTab('SIMPLE')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'SIMPLE' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/40' : 'text-slate-400 hover:text-slate-600'}`}>
          <Calculator size={20} /> Business Calc
        </button>
      </div>

      <div>
        {activeTab === 'JEWELRY' ? <JewelryCalculator rates={rates} /> : <SimpleCalculator />}
      </div>
    </div>
  );
};

const JewelryCalculator: React.FC<{ rates: any }> = ({ rates }) => {
  const [inputs, setInputs] = useState({
    type: 'GOLD',
    weight: '',
    purity: '22K',
    wastage: '2',
    making: '500',
    gst: '3',
    manualRate: rates.gold.toString()
  });

  const breakdown = useMemo(() => {
    const rate = parseFloat(inputs.manualRate) || 0;
    const weight = parseFloat(inputs.weight) || 0;
    const wastage = parseFloat(inputs.wastage) || 0;
    const making = parseFloat(inputs.making) || 0;
    const gst = parseFloat(inputs.gst) || 0;
    const metalValue = rate * weight;
    const wastageValue = metalValue * (wastage / 100);
    const subtotal = metalValue + wastageValue + making;
    const gstValue = subtotal * (gst / 100);
    const total = subtotal + gstValue;
    return { metalValue, wastageValue, subtotal, gstValue, total };
  }, [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-700 shadow-sm space-y-8">
        <div className="flex gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[24px]">
          <button onClick={() => setInputs({...inputs, type: 'GOLD', manualRate: rates.gold.toString()})} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${inputs.type === 'GOLD' ? 'bg-yellow-500 text-white shadow-lg' : 'text-slate-400'}`}>Gold</button>
          <button onClick={() => setInputs({...inputs, type: 'SILVER', manualRate: rates.silver.toString()})} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${inputs.type === 'SILVER' ? 'bg-slate-500 text-white shadow-lg' : 'text-slate-400'}`}>Silver</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CalcField label="Live Market Rate (₹/g)" value={inputs.manualRate} onChange={val => setInputs({...inputs, manualRate: val})} />
          <CalcField label="Item Weight (g)" value={inputs.weight} onChange={val => setInputs({...inputs, weight: val})} placeholder="0.000" />
          <CalcField label="Wastage (%)" value={inputs.wastage} onChange={val => setInputs({...inputs, wastage: val})} />
          <CalcField label="Making (₹)" value={inputs.making} onChange={val => setInputs({...inputs, making: val})} />
        </div>
        <CalcField label="GST (%)" value={inputs.gst} onChange={val => setInputs({...inputs, gst: val})} />
      </div>

      <div className="lg:col-span-2 bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl flex flex-col justify-between">
        <div className="space-y-8">
          <h4 className="text-yellow-500 font-black uppercase tracking-[0.2em] text-xs">Live Breakdown</h4>
          <div className="space-y-6">
            <BreakdownRow label="Metal Value" value={breakdown.metalValue} />
            <BreakdownRow label={`Wastage (${inputs.wastage}%)`} value={breakdown.wastageValue} />
            <BreakdownRow label="Workmanship" value={parseFloat(inputs.making) || 0} />
            <div className="h-px bg-white/10"></div>
            <BreakdownRow label={`GST (${inputs.gst}%)`} value={breakdown.gstValue} />
          </div>
        </div>
        <div className="mt-16 p-10 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md">
          <span className="text-yellow-500/60 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Grand Total</span>
          <span className="text-5xl font-black text-yellow-500 tracking-tight">₹{Math.round(breakdown.total).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const CalcField = ({ label, value, onChange, placeholder = "0" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input type="number" step="any" placeholder={placeholder} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black" value={value} onChange={e => onChange(e.target.value)}/>
  </div>
);

const BreakdownRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">{label}</span>
    <span className="font-black text-lg">₹{Math.round(value).toLocaleString()}</span>
  </div>
);

const SimpleCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [autoResult, setAutoResult] = useState<string | null>(null);

  useEffect(() => {
    if (display === '0' || display === '') {
      setAutoResult(null);
      return;
    }
    try {
      const sanitized = display.replace(/x/g, '*').replace(/÷/g, '/');
      const result = eval(sanitized);
      setAutoResult(result.toString());
    } catch {
      setAutoResult(null);
    }
  }, [display]);

  const handlePress = (key: string) => {
    if (key === 'AC') {
      setDisplay('0');
    } else if (key === '=') {
      if (autoResult) {
        setHistory(prev => [`${display} = ${autoResult}`, ...prev].slice(0, 10));
        setDisplay(autoResult);
      }
    } else if (key === 'DEL') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    } else if (key === '%') {
      // Logic from user requirement
      // This is a bit complex for a simple string display, but let's assume we use current display value X
      try {
        const x = parseFloat(display) || 0;
        setDisplay((x / 100).toString());
      } catch { /* ignore */ }
    } else {
      setDisplay(display === '0' ? key : display + key);
    }
  };

  const buttons = [
    ['7', '8', '9', 'DEL', 'AC'],
    ['4', '5', '6', 'x', '÷'],
    ['1', '2', '3', '-', '%'],
    ['00', '0', '.', '+', '=']
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-slate-950 p-10 rounded-[64px] shadow-2xl border-[12px] border-slate-900">
        <div className="bg-slate-900 p-8 rounded-[32px] mb-10 flex flex-col items-end justify-center min-h-[160px] shadow-inner overflow-hidden border border-white/5">
          <div className="text-slate-600 text-sm font-black mb-2 font-mono tracking-widest">{history[0]?.split('=')[0]}</div>
          <div className="text-5xl font-black text-white tracking-tighter break-all text-right font-mono">{display}</div>
          {autoResult && autoResult !== display && (
            <div className="text-yellow-500/40 text-2xl font-black mt-2 font-mono">= {autoResult}</div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {buttons.map((row) => row.map((btn, i) => (
            <button 
              key={btn + i} 
              onClick={() => handlePress(btn)}
              className={`h-20 md:h-24 rounded-[24px] text-xl font-black transition-all active:scale-90 shadow-xl flex items-center justify-center ${
                ['÷', 'x', '-', '+', '=', '%'].includes(btn) 
                  ? 'bg-yellow-500 text-white shadow-yellow-500/20' 
                  : btn === 'AC' || btn === 'DEL'
                  ? 'bg-red-500 text-white shadow-red-500/20 text-sm'
                  : 'bg-slate-800 text-white hover:bg-slate-700 shadow-black/20'
              } ${btn === '=' ? 'ring-4 ring-yellow-500/30' : ''}`}
            >
              {btn}
            </button>
          )))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-700 shadow-sm">
        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 mb-8">
          <History size={18} /> Calculation Log
        </h4>
        <div className="space-y-4">
          {history.length > 0 ? history.map((h, i) => (
            <div key={i} className="text-sm p-6 bg-slate-50 dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400 flex flex-col gap-1">
              <span className="text-[10px] opacity-40">Entry #{history.length - i}</span>
              <span className="font-black">{h}</span>
            </div>
          )) : (
            <div className="text-center py-32 text-slate-300 italic flex flex-col items-center gap-4">
               <RotateCcw size={40} className="opacity-10" />
               <p className="text-xs font-black uppercase tracking-widest">No history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorView;
