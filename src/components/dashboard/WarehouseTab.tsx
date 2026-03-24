import React from 'react';
import { motion } from 'motion/react';
import { 
  Warehouse, 
  Search, 
  PlusCircle, 
  Trash2, 
  Edit2,
  Plus,
  Box
} from 'lucide-react';
import { WarehouseItem } from '../../types/dashboard';
import { CalculatorHelper } from './CalculatorHelper';

interface WarehouseTabProps {
  warehouse: WarehouseItem[];
  isAdmin: boolean;
  isManager: boolean;
  warehouseSearchTerm: string;
  setWarehouseSearchTerm: (val: string) => void;
  newWarehouseItemName: string;
  setNewWarehouseItemName: (val: string) => void;
  newWarehouseItemQty: string;
  setNewWarehouseItemQty: (val: string) => void;
  newWarehouseItemUnit: string;
  setNewWarehouseItemUnit: (val: string) => void;
  calcMultiplier: string;
  setCalcMultiplier: (val: string) => void;
  calcBase: string;
  setCalcBase: (val: string) => void;
  handleAddWarehouseItem: (e: React.FormEvent) => void;
  handleDeleteWarehouseItem: (id: string) => void;
  handleStartEditWarehouse: (item: WarehouseItem) => void;
}

export const WarehouseTab: React.FC<WarehouseTabProps> = ({
  warehouse, isAdmin, isManager,
  warehouseSearchTerm, setWarehouseSearchTerm,
  newWarehouseItemName, setNewWarehouseItemName,
  newWarehouseItemQty, setNewWarehouseItemQty,
  newWarehouseItemUnit, setNewWarehouseItemUnit,
  calcMultiplier, setCalcMultiplier,
  calcBase, setCalcBase,
  handleAddWarehouseItem, handleDeleteWarehouseItem, handleStartEditWarehouse
}) => {
  const filteredWarehouse = warehouse.filter(item =>
    item.name.toLowerCase().includes(warehouseSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Warehouse Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl luxury-border shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-800 rounded-2xl shadow-lg shadow-slate-800/20">
            <Warehouse className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight">Warehouse Storage</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-500 text-sm font-medium">Total Materials:</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                {warehouse.length} Categories
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
          <input
            type="text"
            placeholder="Search warehouse materials..."
            value={warehouseSearchTerm}
            onChange={(e) => setWarehouseSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/10 focus:border-slate-800 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Register New Material */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white p-8 rounded-3xl luxury-border shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <PlusCircle className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Register Material</h3>
          </div>
          
          <form onSubmit={handleAddWarehouseItem} className="space-y-6">
            <CalculatorHelper 
              calcMultiplier={calcMultiplier}
              setCalcMultiplier={setCalcMultiplier}
              calcBase={calcBase}
              setCalcBase={setCalcBase}
              onApply={setNewWarehouseItemQty}
              title="Material Calculator"
            />
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Material Name</label>
                <input
                  type="text"
                  value={newWarehouseItemName}
                  onChange={(e) => setNewWarehouseItemName(e.target.value)}
                  placeholder="e.g. Cement, Steel Bars, etc."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWarehouseItemQty}
                    onChange={(e) => setNewWarehouseItemQty(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Unit</label>
                  <input
                    type="text"
                    value={newWarehouseItemUnit}
                    onChange={(e) => setNewWarehouseItemUnit(e.target.value)}
                    placeholder="e.g. bags, pcs, kg"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-800/20 hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Store in Warehouse
            </button>
          </form>
        </motion.div>

        {/* Warehouse List */}
        <div className="lg:col-span-2 bg-white rounded-3xl luxury-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm">
                <Box className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Warehouse Inventory</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Material Name</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Quantity</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Unit</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredWarehouse.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50/80 transition-all duration-200"
                  >
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm group-hover:bg-slate-800 group-hover:text-white transition-all">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 text-lg">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="px-5 py-2 rounded-full text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-8 py-8 font-bold text-slate-600 uppercase tracking-widest text-xs">{item.unit}</td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEditWarehouse(item)}
                        className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        title="Edit Material"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {(isAdmin || isManager) && (
                        <button
                          onClick={() => handleDeleteWarehouseItem(item.id)}
                          className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Material"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                  </motion.tr>
                ))}
                {filteredWarehouse.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-slate-50 rounded-full">
                          <Warehouse className="w-12 h-12 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-lg">Warehouse is empty</p>
                          <p className="text-slate-500 text-sm">Register materials to keep them separate from inventory.</p>
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
  );
};
