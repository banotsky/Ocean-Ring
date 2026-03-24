import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Search, 
  PlusCircle, 
  History, 
  AlertCircle, 
  Trash2, 
  Edit2,
  Plus
} from 'lucide-react';
import { InventoryItem } from '../../types/dashboard';
import { CalculatorHelper } from './CalculatorHelper';

interface InventoryTabProps {
  inventory: InventoryItem[];
  isAdmin: boolean;
  isManager: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  newItemName: string;
  setNewItemName: (val: string) => void;
  newItemQty: string;
  setNewItemQty: (val: string) => void;
  newItemPrice: string;
  setNewItemPrice: (val: string) => void;
  restockItemId: string;
  setRestockItemId: (val: string) => void;
  restockQty: string;
  setRestockQty: (val: string) => void;
  isRestockExpense: boolean;
  setIsRestockExpense: (val: boolean) => void;
  calcMultiplier: string;
  setCalcMultiplier: (val: string) => void;
  calcBase: string;
  setCalcBase: (val: string) => void;
  handleAddItem: (e: React.FormEvent) => void;
  handleRestock: (e: React.FormEvent) => void;
  handleDeleteItem: (id: string) => void;
  handleStartEdit: (item: InventoryItem) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory, isAdmin, isManager,
  searchTerm, setSearchTerm,
  newItemName, setNewItemName,
  newItemQty, setNewItemQty,
  newItemPrice, setNewItemPrice,
  restockItemId, setRestockItemId,
  restockQty, setRestockQty,
  isRestockExpense, setIsRestockExpense,
  calcMultiplier, setCalcMultiplier,
  calcBase, setCalcBase,
  handleAddItem, handleRestock, handleDeleteItem, handleStartEdit
}) => {
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Inventory Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl luxury-border shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">Stock Management</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-500 text-sm font-medium">Total Inventory:</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                {inventory.length} Unique Items
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Register New Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl luxury-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Register New Item</h3>
          </div>
          
          <form onSubmit={handleAddItem} className="space-y-6">
            <CalculatorHelper 
              calcMultiplier={calcMultiplier}
              setCalcMultiplier={setCalcMultiplier}
              calcBase={calcBase}
              setCalcBase={setCalcBase}
              onApply={setNewItemQty}
            />
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Item Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Premium Coffee Beans"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Initial Quantity</label>
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Unit Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Register Product
            </button>
          </form>
        </motion.div>

        {/* Restock Existing Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl luxury-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <History className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Restock Existing Item</h3>
          </div>
          
          <form onSubmit={handleRestock} className="space-y-6">
            <CalculatorHelper 
              calcMultiplier={calcMultiplier}
              setCalcMultiplier={setCalcMultiplier}
              calcBase={calcBase}
              setCalcBase={setCalcBase}
              onApply={setRestockQty}
            />

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Select Product</label>
                <select
                  value={restockItemId}
                  onChange={(e) => setRestockItemId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">Choose an item...</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>{item.name} (Current: {item.quantity})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Quantity to Add</label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <input
                  type="checkbox"
                  id="restockExpense"
                  checked={isRestockExpense}
                  onChange={(e) => setIsRestockExpense(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="restockExpense" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                  Record as Business Expense
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Update Stock Levels
            </button>
          </form>
        </motion.div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-3xl luxury-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm">
              <Package className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Inventory Catalog</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort by: Name</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Product Details</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Stock Level</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Unit Price</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Total Value</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInventory.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-slate-50/80 transition-all duration-200"
                >
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 text-lg">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <span className={`px-5 py-2 rounded-full text-sm font-bold border ${
                        item.quantity <= 5 
                          ? 'bg-rose-50 text-rose-700 border-rose-100' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {item.quantity} units
                      </span>
                      {item.quantity <= 5 && (
                        <div className="flex items-center gap-2 text-rose-600 animate-pulse">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8 font-semibold text-slate-600 text-lg">₱{item.price.toLocaleString()}</td>
                  <td className="px-8 py-8 font-bold text-slate-900 text-lg">₱{(item.price * item.quantity).toLocaleString()}</td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit Item"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {(isAdmin || isManager) && (
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold text-lg">No items found</p>
                        <p className="text-slate-500 text-sm">Try adjusting your search or add a new product.</p>
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
