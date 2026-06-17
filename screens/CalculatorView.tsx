import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../App';
import { 
  Calculator, 
  History, 
  RotateCcw, 
  Gem,
  Percent,
  Coins,
  Receipt,
  Scale
} from 'lucide-react';

const CalculatorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'JEWELRY' | 'SIMPLE'>('JEWELRY');
  const { rates } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex p-2 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border-2 border-slate-100 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('JEWELRY')} 
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'JEWELRY' ? 'bg-yellow-500 text-white shadow-xl shadow-yellow-500/20' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Gem size={20} /> Jewelry Lab
        </button>
        <button 
          onClick={() => setActiveTab('SIMPLE')} 
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'SIMPLE' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/40' : 'text-slate-400 hover:text-slate-600'}`}
        >
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
    type: 'GOLD' as 'GOLD' | 'SILVER',
    purity: '22K',
    weight: '',
    baseRate: rates.gold.toString(), // Base 24K raw rate
    makingType: 'PERCENT' as 'PERCENT' | 'PER_GRAM' | 'FLAT',
    makingValue: '10', // 10% default for PERCENT, or fixed amounts
    wastage: '2',
    taxPercent: '3',
  });

  // Adjust purity factor and set purity list based on select type
  const purities = useMemo(() => {
    if (inputs.type === 'GOLD') {
      return [
        { label: '24K (Pure - 99.9%)', factor: 1.0, value: '24K' },
        { label: '22K (Standard - 91.6%)', factor: 0.916, value: '22K' },
        { label: '18K (Jewellery - 75.0%)', factor: 0.75, value: '18K' },
        { label: '14K (Affordable - 58.3%)', factor: 0.583, value: '14K' },
      ];
    } else {
      return [
        { label: '999 (Pure - 99.9%)', factor: 1.0, value: '999' },
        { label: '925 (Sterling - 92.5%)', factor: 0.925, value: '925' },
        { label: '900 (Coin Silver - 90.0%)', factor: 0.90, value: '900' },
      ];
    }
  }, [inputs.type]);

  // Adjust default purity if switching type
  useEffect(() => {
    if (inputs.type === 'GOLD') {
      setInputs(prev => ({
        ...prev,
        purity: '22K',
        baseRate: rates.gold.toString()
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        purity: '925',
        baseRate: rates.silver.toString()
      }));
    }
  }, [inputs.type, rates]);

  // Find active factor
  const activePurityInfo = useMemo(() => {
    return purities.find(p => p.value === inputs.purity) || purities[0];
  }, [purities, inputs.purity]);

  // Calculations
  const calculations = useMemo(() => {
    const rawBaseRate = parseFloat(inputs.baseRate) || 0;
    const factor = activePurityInfo ? activePurityInfo.factor : 1.0;
    // Adjusted rate based on purity factor
    const purityAdjustedRate = Math.round(rawBaseRate * factor);
    
    // Core parameters
    const weightVal = parseFloat(inputs.weight) || 0;
    const wastagePercent = parseFloat(inputs.wastage) || 0;
    const makingVal = parseFloat(inputs.makingValue) || 0;
    const taxVal = parseFloat(inputs.taxPercent) || 0;

    // Metal Material Cost
    const metalCostWithoutWastage = purityAdjustedRate * weightVal;
    const wastageValue = metalCostWithoutWastage * (wastagePercent / 100);
    const totalMetalCost = metalCostWithoutWastage + wastageValue;

    // Making Charges: compute based on type selected
    let makingChargesTotal = 0;
    if (inputs.makingType === 'PERCENT') {
      // computed as % of material cost
      makingChargesTotal = metalCostWithoutWastage * (makingVal / 100);
    } else if (inputs.makingType === 'PER_GRAM') {
      // computed per gram rate
      makingChargesTotal = makingVal * weightVal;
    } else {
      // flat fee
      makingChargesTotal = makingVal;
    }

    // Subtotal
    const subtotal = totalMetalCost + makingChargesTotal;
    // Tax computation
    const taxValue = subtotal * (taxVal / 100);
    // Grand Total Selling Price
    const finalSellingPrice = subtotal + taxValue;

    return {
      purityAdjustedRate,
      metalCostWithoutWastage,
      wastageValue,
      totalMetalCost,
      makingChargesTotal,
      subtotal,
      taxValue,
      finalSellingPrice
    };
  }, [inputs, activePurityInfo]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Input panel */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-700 shadow-sm space-y-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Advanced Calculator</h3>
          <p className="text-xs font-bold text-slate-400 lowercase leading-relaxed">
            Configure metal categories, purity weights, workmanship rates & taxes to retrieve instant exact values.
          </p>
        </div>

        {/* Metal Choice */}
        <div className="flex gap-3 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setInputs({...inputs, type: 'GOLD'})} 
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${inputs.type === 'GOLD' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Gold
          </button>
          <button 
            onClick={() => setInputs({...inputs, type: 'SILVER'})} 
            className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${inputs.type === 'SILVER' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Silver
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Base Market Rate input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Coins size={12} className="text-yellow-500" /> Base 24K Rate (₹/g)
            </label>
            <input 
              type="number" 
              step="any"
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black text-slate-800 dark:text-white" 
              value={inputs.baseRate} 
              onChange={val => setInputs({...inputs, baseRate: val.target.value})}
            />
          </div>

          {/* Purity selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Selected Purity / Standard
            </label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black text-slate-800 dark:text-white appearance-none"
              value={inputs.purity}
              onChange={e => setInputs({...inputs, purity: e.target.value})}
            >
              {purities.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Scale size={12} className="text-slate-400" /> Weight (Grams)
            </label>
            <input 
              type="number" 
              step="any"
              placeholder="0.00"
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black text-slate-800 dark:text-white" 
              value={inputs.weight} 
              onChange={val => setInputs({...inputs, weight: val.target.value})}
            />
          </div>

          {/* Wastage */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Wastage Allowance (%)
            </label>
            <input 
              type="number" 
              step="any"
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black text-slate-800 dark:text-white" 
              value={inputs.wastage} 
              onChange={val => setInputs({...inputs, wastage: val.target.value})}
            />
          </div>
        </div>

        {/* Making Charges sector */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Making Charges / Workmanship
            </label>
            
            {/* Toggle options */}
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 gap-1 border border-slate-200/50 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => setInputs({...inputs, makingType: 'PERCENT', makingValue: '10'})}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${inputs.makingType === 'PERCENT' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400'}`}
              >
                <Percent size={10} /> Value %
              </button>
              <button 
                type="button"
                onClick={() => setInputs({...inputs, makingType: 'PER_GRAM', makingValue: '450'})}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${inputs.makingType === 'PER_GRAM' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400'}`}
              >
                ₹ / Gram
              </button>
              <button 
                type="button"
                onClick={() => setInputs({...inputs, makingType: 'FLAT', makingValue: '1500'})}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${inputs.makingType === 'FLAT' ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400'}`}
              >
                ₹ Flat Fee
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {inputs.makingType === 'PERCENT' ? 'Percentage Rate (%)' : inputs.makingType === 'PER_GRAM' ? 'Charge Per Gram (₹/g)' : 'Flat Custom Fee (₹)'}
              </label>
              <input 
                type="number" 
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black text-slate-800 dark:text-white" 
                value={inputs.makingValue} 
                onChange={val => setInputs({...inputs, makingValue: val.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Receipt size={12} className="text-slate-400" /> Taxes (GST %)
              </label>
              <input 
                type="number" 
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-yellow-500 font-black text-slate-800 dark:text-white" 
                value={inputs.taxPercent} 
                onChange={val => setInputs({...inputs, taxPercent: val.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Panel / Breakdown */}
      <div className="lg:col-span-2 bg-slate-900 rounded-[48px] p-8 md:p-10 text-white shadow-2xl flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h4 className="text-yellow-500 font-black uppercase tracking-[0.2em] text-xs">Aesthetic Breakdown</h4>
            <span className="text-[9px] font-black uppercase px-3 py-1 bg-white/10 text-yellow-500 rounded-full">
              LIVE VALUATOR
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center sm:items-start group">
              <div className="flex flex-col">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Rate Adjusted per Purity</span>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                  ({inputs.purity} Gold factor is x{activePurityInfo?.factor})
                </span>
              </div>
              <span className="font-black text-sm text-slate-300">
                ₹{calculations.purityAdjustedRate.toLocaleString()} / g
              </span>
            </div>

            <div className="h-px bg-white/5"></div>

            <BreakdownRow 
              label="Metal Content Cost" 
              value={calculations.metalCostWithoutWastage} 
              subtitle={`${inputs.weight || '0'}g weight @ ₹${calculations.purityAdjustedRate}/g`}
            />

            <BreakdownRow 
              label={`Wastage Allowance (${inputs.wastage}%)`} 
              value={calculations.wastageValue} 
            />

            <BreakdownRow 
              label={`Workmanship (${inputs.makingType === 'PERCENT' ? `${inputs.makingValue}%` : inputs.makingType === 'PER_GRAM' ? `₹${inputs.makingValue}/g` : 'Flat Fee'})`} 
              value={calculations.makingChargesTotal} 
            />

            <div className="h-px bg-white/15"></div>

            <BreakdownRow 
              label={`Tax/GST (${inputs.taxPercent}%)`} 
              value={calculations.taxValue} 
            />
          </div>
        </div>

        <div className="mt-12 p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md">
          <span className="text-yellow-500/60 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">
            Final Settlement value
          </span>
          <span className="text-4xl md:text-5xl font-black text-yellow-500 tracking-tight block">
            ₹{Math.round(calculations.finalSellingPrice).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const BreakdownRow = ({ label, value, subtitle }: { label: string; value: number; subtitle?: string }) => (
  <div className="flex justify-between items-center">
    <div className="flex flex-col">
      <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">{label}</span>
      {subtitle && <span className="text-[10px] text-slate-550 text-slate-500 font-bold mt-0.5">{subtitle}</span>}
    </div>
    <span className="font-black text-base text-white">₹{Math.round(value).toLocaleString()}</span>
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
      <div className="lg:col-span-2 bg-slate-950 p-8 md:p-10 rounded-[64px] shadow-2xl border-[12px] border-slate-900">
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
              className={`h-16 md:h-20 rounded-[24px] text-lg font-black transition-all active:scale-90 shadow-xl flex items-center justify-center ${
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

      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-700 shadow-sm">
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
            <div className="text-center py-20 md:py-32 text-slate-300 italic flex flex-col items-center gap-4">
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
