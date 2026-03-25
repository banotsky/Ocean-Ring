import React from 'react';
import { motion } from 'motion/react';
import { 
  Receipt, 
  Search, 
  PlusCircle, 
  History, 
  Trash2, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingDown,
  ArrowDownRight
} from 'lucide-react';
import { 
  isSameDay, 
  format,
  subDays,
  addDays
} from 'date-fns';
import { ExpenseRecord } from '../../types/dashboard';

interface ExpensesTabProps {
  expenses: ExpenseRecord[];
  isAdmin: boolean;
  isManager: boolean;
  expenseSearchTerm: string;
  setExpenseSearchTerm: (val: string) => void;
  expenseDesc: string;
  setExpenseDesc: (val: string) => void;
  expenseAmount: string;
  setExpenseAmount: (val: string) => void;
  expenseSelectedDate: Date;
  setExpenseSelectedDate: (date: Date) => void;
  useExpenseDateFilter: boolean;
  setUseExpenseDateFilter: (val: boolean) => void;
  handleAddExpense: (e: React.FormEvent) => void;
  handleDeleteExpense: (id: string) => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses, isAdmin, isManager,
  expenseSearchTerm, setExpenseSearchTerm,
  expenseDesc, setExpenseDesc,
  expenseAmount, setExpenseAmount,
  expenseSelectedDate, setExpenseSelectedDate,
  useExpenseDateFilter, setUseExpenseDateFilter,
  handleAddExpense, handleDeleteExpense
}) => {
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(expenseSearchTerm.toLowerCase());
    const matchesDate = useExpenseDateFilter ? isSameDay(new Date(expense.created_at), expenseSelectedDate) : true;
    return matchesSearch && matchesDate;
  });

  const totalExpensesValue = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-8">
      {/* Expenses Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl luxury-border shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">Expense Management</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-500 text-sm font-medium">Total Outflow:</span>
              <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-100">
                ₱{totalExpensesValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-600 transition-colors" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={expenseSearchTerm}
              onChange={(e) => setExpenseSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Record New Expense */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white p-8 rounded-3xl luxury-border shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-rose-50 rounded-xl">
              <PlusCircle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Record New Expense</h3>
          </div>
          
          <form onSubmit={handleAddExpense} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="e.g. Utility Bills, Rent, etc."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Amount (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <TrendingDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Record Expense
            </button>
          </form>
        </motion.div>

        {/* Expense History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl luxury-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <History className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Expense History</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUseExpenseDateFilter(!useExpenseDateFilter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
                    useExpenseDateFilter 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {useExpenseDateFilter ? 'Filter Active' : 'Filter by Date'}
                </button>
                
                {useExpenseDateFilter && (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => setExpenseSelectedDate(subDays(expenseSelectedDate, 1))}
                      className="p-1.5 hover:bg-slate-50 rounded-lg transition-all text-slate-600"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-700 px-1 min-w-[90px] text-center">
                      {format(expenseSelectedDate, 'MMM dd, yyyy')}
                    </span>
                    <button 
                      onClick={() => setExpenseSelectedDate(addDays(expenseSelectedDate, 1))}
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
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Description</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Amount</th>
                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredExpenses.map((expense, idx) => (
                    <motion.tr 
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-slate-50/80 transition-all duration-200"
                    >
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                            <ArrowDownRight className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">{expense.description}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(new Date(expense.created_at), 'MMM dd, yyyy • hh:mm a')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 font-bold text-rose-600 text-lg">₱{expense.amount.toLocaleString()}</td>
                      <td className="px-8 py-8 text-right">
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-slate-50 rounded-full">
                            <Receipt className="w-12 h-12 text-slate-300" />
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-lg">No expense records found</p>
                            <p className="text-slate-500 text-sm">Try adjusting your filters or record a new expense.</p>
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
