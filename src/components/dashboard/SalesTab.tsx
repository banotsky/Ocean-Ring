import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  PlusCircle, 
  History, 
  Trash2, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { 
  isSameDay, 
  format,
  subDays,
  addDays
} from 'date-fns';
import { InventoryItem, SaleRecord } from '../../types/dashboard';
import { CalculatorHelper } from './CalculatorHelper';

interface SalesTabProps {
  inventory: InventoryItem[];
  sales: SaleRecord[];
  isAdmin: boolean;
  isManager: boolean;
  salesSearchTerm: string;
  setSalesSearchTerm: (val: string) => void;
  saleItemId: string;
  setSaleItemId: (val: string) => void;
  saleQty: string;
  setSaleQty: (val: string) => void;
  calcMultiplier: string;
  setCalcMultiplier: (val: string) => void;
  calcBase: string;
  setCalcBase: (val: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  useDateFilter: boolean;
  setUseDateFilter: (val: boolean) => void;
  handleRecordSale: (e: React.FormEvent) => void;
  handleDeleteSale: (sale: SaleRecord) => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({
  inventory, sales, isAdmin, isManager,
  salesSearchTerm, setSalesSearchTerm,
  saleItemId, setSaleItemId,
  saleQty, setSaleQty,
  calcMultiplier, setCalcMultiplier,
  calcBase, setCalcBase,
  selectedDate, setSelectedDate,
  useDateFilter, setUseDateFilter,
  handleRecordSale, handleDeleteSale
}) => {
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.item_name.toLowerCase().includes(salesSearchTerm.toLowerCase());
    const matchesDate = useDateFilter ? isSameDay(new Date(sale.created_at), selectedDate) : true;
    return matchesSearch && matchesDate;
  });

  const totalSalesValue = filteredSales.reduce((acc, s) => acc + s.total_price, 0);

  return (
    <div className="space-y-8">
      {/* Sales Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl luxury-border shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">Sales Management</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-500 text-sm font-medium">Total Sales:</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                ₱{totalSalesValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search sales history..."
              value={salesSearchTerm}
              onChange={(e) => setSalesSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Record New Sale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white p-8 rounded-3xl luxury-border shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Record New Sale</h3>
          </div>
          
          <form onSubmit={handleRecordSale} className="space-y-6">
            <CalculatorHelper 
              calcMultiplier={calcMultiplier}
              setCalcMultiplier={setCalcMultiplier}
              calcBase={calcBase}
              setCalcBase={setCalcBase}
              onApply={setSaleQty}
              title="Sale Calculator Helper"
            />

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Select Product</label>
                <select
                  value={saleItemId}
                  onChange={(e) => setSaleItemId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">Choose an item...</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id} disabled={item.quantity === 0}>
                      {item.name} (Stock: {item.quantity}) - ₱{item.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Quantity Sold</label>
                <input
                  type="number"
                  value={saleQty}
                  onChange={(e) => setSaleQty(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  required
                />
              </div>
              
              {saleItemId && saleQty && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Estimated Total</span>
                    <span className="text-xl font-bold text-emerald-700 font-serif">
                      ₱{( (inventory.find(i => i.id === saleItemId)?.price || 0) * (parseInt(saleQty) || 0) ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Complete Sale
            </button>
          </form>
        </motion.div>

        {/* Sales History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl luxury-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <History className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Sales History</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUseDateFilter(!useDateFilter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
                    useDateFilter 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {useDateFilter ? 'Filter Active' : 'Filter by Date'}
                </button>
                
                {useDateFilter && (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                      className="p-1.5 hover:bg-slate-50 rounded-lg transition-all text-slate-600"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-700 px-1 min-w-[90px] text-center">
                      {format(selectedDate, 'MMM dd, yyyy')}
                    </span>
                    <button 
                      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
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
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Transaction</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Quantity</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Total Price</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSales.map((sale, idx) => (
                    <motion.tr 
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-slate-50/80 transition-all duration-200"
                    >
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">{sale.item_name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(new Date(sale.created_at), 'MMM dd, yyyy • hh:mm a')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 font-semibold text-slate-600 text-lg">{sale.quantity_sold} units</td>
                      <td className="px-8 py-8 font-bold text-emerald-600 text-lg">₱{sale.total_price.toLocaleString()}</td>
                      <td className="px-8 py-8 text-right">
                        {(isAdmin || isManager) && (
                          <button
                            onClick={() => handleDeleteSale(sale)}
                            className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                            title="Cancel Sale"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-slate-50 rounded-full">
                            <ShoppingCart className="w-12 h-12 text-slate-300" />
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-lg">No sales records found</p>
                            <p className="text-slate-500 text-sm">Try adjusting your filters or record a new sale.</p>
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
      </div>
    </div>
  );
};
