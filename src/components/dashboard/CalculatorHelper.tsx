import React from 'react';
import { Calculator } from 'lucide-react';

interface CalculatorHelperProps {
  calcMultiplier: string;
  setCalcMultiplier: (val: string) => void;
  calcBase: string;
  setCalcBase: (val: string) => void;
  onApply: (result: string) => void;
  title?: string;
}

export const CalculatorHelper: React.FC<CalculatorHelperProps> = ({
  calcMultiplier, setCalcMultiplier,
  calcBase, setCalcBase,
  onApply,
  title = "Stock Calculator Helper"
}) => {
  const calculateResult = () => {
    const m = parseInt(calcMultiplier) || 0;
    const b = parseInt(calcBase) || 0;
    if (m > 0 && b > 0) {
      onApply((m * b).toString());
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
      <div className="flex items-center gap-2 mb-3 text-slate-600">
        <Calculator className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 ml-1">Packs/Bundles</label>
          <input
            type="number"
            value={calcMultiplier}
            onChange={(e) => setCalcMultiplier(e.target.value)}
            onBlur={calculateResult}
            placeholder="e.g. 10"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 ml-1">Items Per Pack</label>
          <input
            type="number"
            value={calcBase}
            onChange={(e) => setCalcBase(e.target.value)}
            onBlur={calculateResult}
            placeholder="e.g. 12"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
};
