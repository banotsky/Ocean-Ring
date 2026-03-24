import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { 
  isSameDay, 
  isSameWeek, 
  isSameMonth, 
  format,
  subDays,
  addDays
} from 'date-fns';
import { InventoryItem, SaleRecord, ExpenseRecord, TabType } from '../../types/dashboard';
import { StatCard } from './StatCard';

interface OverviewTabProps {
  inventory: InventoryItem[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  useDateFilter: boolean;
  setUseDateFilter: (val: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  inventory, sales, expenses,
  selectedDate, setSelectedDate,
  useDateFilter, setUseDateFilter,
  setActiveTab
}) => {
  const filteredSales = useDateFilter 
    ? sales.filter(s => isSameDay(new Date(s.created_at), selectedDate))
    : sales;

  const filteredExpenses = useDateFilter
    ? expenses.filter(e => isSameDay(new Date(e.created_at), selectedDate))
    : expenses;

  const totalInventoryValue = inventory.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
  
  const dailySales = sales.filter(s => isSameDay(new Date(s.created_at), new Date()));
  const dailyExpenses = expenses.filter(e => isSameDay(new Date(e.created_at), new Date()));
  const dailyProfit = dailySales.reduce((acc, s) => acc + s.total_price, 0) - dailyExpenses.reduce((acc, e) => acc + e.amount, 0);

  const weeklySales = sales.filter(s => isSameWeek(new Date(s.created_at), new Date()));
  const weeklyExpenses = expenses.filter(e => isSameWeek(new Date(e.created_at), new Date()));
  const weeklyProfit = weeklySales.reduce((acc, s) => acc + s.total_price, 0) - weeklyExpenses.reduce((acc, e) => acc + e.amount, 0);

  const monthlySales = sales.filter(s => isSameMonth(new Date(s.created_at), new Date()));
  const monthlyExpenses = expenses.filter(e => isSameMonth(new Date(e.created_at), new Date()));
  const monthlyProfit = monthlySales.reduce((acc, s) => acc + s.total_price, 0) - monthlyExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-8">
      {/* Date Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl luxury-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Financial Overview</h2>
            <p className="text-slate-500 text-base font-medium">Real-time business performance tracking</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseDateFilter(!useDateFilter)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all duration-300 ${
              useDateFilter 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            {useDateFilter ? 'Filter Active' : 'Filter by Date'}
          </button>
          
          {useDateFilter && (
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-base font-bold text-slate-700 px-3 min-w-[140px] text-center">
                {format(selectedDate, 'MMM dd, yyyy')}
              </span>
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Inventory Value"
          value={`₱${totalInventoryValue.toLocaleString()}`}
          icon={Package}
          trend={{ value: `${totalItems} items`, isUp: true }}
          color="bg-indigo-600"
          delay={0.1}
        />
        <StatCard
          title="Daily Profit/Loss"
          value={`₱${dailyProfit.toLocaleString()}`}
          icon={dailyProfit >= 0 ? TrendingUp : TrendingDown}
          trend={{ value: dailyProfit >= 0 ? '+12%' : '-5%', isUp: dailyProfit >= 0 }}
          color={dailyProfit >= 0 ? "bg-emerald-600" : "bg-rose-600"}
          delay={0.2}
        />
        <StatCard
          title="Weekly Profit/Loss"
          value={`₱${weeklyProfit.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: '+18.5%', isUp: true }}
          color="bg-amber-600"
          delay={0.3}
        />
        <StatCard
          title="Monthly Profit/Loss"
          value={`₱${monthlyProfit.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: '+24.2%', isUp: true }}
          color="bg-indigo-600"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl luxury-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Recent Activity</h3>
            </div>
            <button 
              onClick={() => setActiveTab('sales')}
              className="text-base font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-1">
              {sales.slice(0, 5).map((sale, idx) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{sale.item_name}</p>
                      <p className="text-sm font-medium text-slate-500">{format(new Date(sale.created_at), 'MMM dd, yyyy • hh:mm a')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-lg">+₱{sale.total_price.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Qty: {sale.quantity_sold}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl luxury-border shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 font-serif mb-8">Quick Actions</h3>
          <div className="space-y-5">
            <button
              onClick={() => setActiveTab('inventory')}
              className="w-full flex items-center justify-between p-6 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-indigo-900 text-lg">Add Inventory</p>
                  <p className="text-sm text-indigo-600/60 font-medium">Restock your items</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-indigo-400" />
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className="w-full flex items-center justify-between p-6 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-emerald-900 text-lg">Record Sale</p>
                  <p className="text-sm text-emerald-600/60 font-medium">New customer purchase</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-emerald-400" />
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-lg">View Ledger</p>
                  <p className="text-sm text-slate-500 font-medium">Financial statements</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
