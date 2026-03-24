import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X, Package, Box, Save } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => (
  <AnimatePresence mode="wait">
    {isOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl luxury-border"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">{title}</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl font-semibold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all duration-200"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
      type === 'success' 
        ? 'bg-emerald-600 border-emerald-500 text-white' 
        : 'bg-rose-600 border-rose-500 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    <span className="font-medium tracking-wide">{message}</span>
  </motion.div>
);

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editName: string;
  setEditName: (val: string) => void;
  editQty: string;
  setEditQty: (val: string) => void;
  editPrice: string;
  setEditPrice: (val: string) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen, onClose, onSubmit,
  editName, setEditName,
  editQty, setEditQty,
  editPrice, setEditPrice
}) => (
  <AnimatePresence mode="wait">
    {isOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl luxury-border relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-800" />
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <Package className="w-7 h-7 text-slate-800" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-serif">Edit Inventory Item</h3>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Item Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Quantity</label>
                  <input
                    type="number"
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none font-medium"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-800/20 hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Update Inventory
            </button>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface EditWarehouseItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editName: string;
  setEditName: (val: string) => void;
  editQty: string;
  setEditQty: (val: string) => void;
  editUnit: string;
  setEditUnit: (val: string) => void;
}

export const EditWarehouseItemModal: React.FC<EditWarehouseItemModalProps> = ({
  isOpen, onClose, onSubmit,
  editName, setEditName,
  editQty, setEditQty,
  editUnit, setEditUnit
}) => (
  <AnimatePresence mode="wait">
    {isOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl luxury-border relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-800" />
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <Box className="w-7 h-7 text-slate-800" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-serif">Edit Warehouse Material</h3>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Material Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 ml-1">Unit</label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-800 transition-all outline-none font-medium"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-800/20 hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Update Warehouse
            </button>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
