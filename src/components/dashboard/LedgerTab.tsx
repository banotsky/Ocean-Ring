import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  History, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  isSameDay, 
  format,
  subDays,
  addDays
} from 'date-fns';
import { LedgerEntry } from '../../types/dashboard';

interface LedgerTabProps {
  ledger: LedgerEntry[];
  ledgerSearchTerm: string;
  setLedgerSearchTerm: (val: string) => void;
  ledgerSelectedDate: Date;
  setLedgerSelectedDate: (date: Date) => void;
  useLedgerDateFilter: boolean;
  setUseLedgerDateFilter: (val: boolean) => void;
}

export const LedgerTab: React.FC<LedgerTabProps> = ({
  ledger,
  ledgerSearchTerm, setLedgerSearchTerm,
  ledgerSelectedDate, setLedgerSelectedDate,
  useLedgerDateFilter, setUseLedgerDateFilter
}) => {
  const filteredLedger = ledger.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(ledgerSearchTerm.toLowerCase());
    const matchesDate = useLedgerDateFilter ? isSameDay(new Date(entry.date), ledgerSelectedDate) : true;
    return matchesSearch && matchesDate;
  });

  const netBalance = filteredLedger.reduce((acc, entry) => 
    entry.type === 'sale' ? acc + entry.amount : acc - entry.amount, 0
  );

  return (
    <div className="space-y-8">
      {/* Ledger Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl luxury-border shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">General Ledger</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-500 text-sm font-medium">Net Balance:</span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                netBalance >= 0 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                ₱{netBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text"
              placeholder="Search ledger entries..."
              value={ledgerSearchTerm}
              onChange={(e) => setLedgerSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl luxury-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm">
              <History className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Financial Statement</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUseLedgerDateFilter(!useLedgerDateFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
                useLedgerDateFilter 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              {useLedgerDateFilter ? 'Filter Active' : 'Filter by Date'}
            </button>
            
            {useLedgerDateFilter && (
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setLedgerSelectedDate(subDays(ledgerSelectedDate, 1))}
                  className="p-1.5 hover:bg-slate-50 rounded-lg transition-all text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 px-1 min-w-[90px] text-center">
                  {format(ledgerSelectedDate, 'MMM dd, yyyy')}
                </span>
                <button 
                  onClick={() => setLedgerSelectedDate(addDays(ledgerSelectedDate, 1))}
                  className="p-1.5 hover:bg-slate-50 rounded-lg transition-all text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Transaction Details</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Type</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Amount</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLedger.map((entry, idx) => (
                <motion.tr 
                  key={`${entry.type}-${entry.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-slate-50/80 transition-all duration-200"
                >
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                        entry.type === 'sale' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {entry.type === 'sale' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                      </div>
                      <span className="font-bold text-slate-900 text-lg">{entry.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                      entry.type === 'sale' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className={`px-8 py-8 font-bold text-lg ${
                    entry.type === 'sale' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {entry.type === 'sale' ? '+' : '-'}₱{entry.amount.toLocaleString()}
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-base font-bold text-slate-600">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(new Date(entry.date), 'hh:mm a')}</p>
                  </td>
                </motion.tr>
              ))}
              {filteredLedger.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <BookOpen className="w-12 h-12 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold text-lg">No ledger entries found</p>
                        <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
