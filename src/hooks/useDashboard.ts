import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { dashboardService } from '../services/dashboardService';
import { InventoryItem, SaleRecord, ExpenseRecord, TabType, LedgerEntry, WarehouseItem } from '../types/dashboard';

export function useDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form states
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const [newWarehouseItemName, setNewWarehouseItemName] = useState('');
  const [newWarehouseItemQty, setNewWarehouseItemQty] = useState('');
  const [newWarehouseItemUnit, setNewWarehouseItemUnit] = useState('');

  const [restockItemId, setRestockItemId] = useState('');
  const [restockQty, setRestockQty] = useState('');
  const [isRestockExpense, setIsRestockExpense] = useState(false);

  const [calcMultiplier, setCalcMultiplier] = useState('');
  const [calcBase, setCalcBase] = useState('');

  const [saleItemId, setSaleItemId] = useState('');
  const [saleQty, setSaleQty] = useState('');

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseSearchTerm, setWarehouseSearchTerm] = useState('');
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');
  const [ledgerSearchTerm, setLedgerSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [useDateFilter, setUseDateFilter] = useState(false);
  const [expenseSelectedDate, setExpenseSelectedDate] = useState<Date>(new Date());
  const [useExpenseDateFilter, setUseExpenseDateFilter] = useState(false);
  const [ledgerSelectedDate, setLedgerSelectedDate] = useState<Date>(new Date());
  const [useLedgerDateFilter, setUseLedgerDateFilter] = useState(false);

  // Edit state
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const [editingWarehouseItem, setEditingWarehouseItem] = useState<WarehouseItem | null>(null);
  const [editWarehouseName, setEditWarehouseName] = useState('');
  const [editWarehouseQty, setEditWarehouseQty] = useState('');
  const [editWarehouseUnit, setEditWarehouseUnit] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [invData, warehouseData, salesData, expensesData] = await Promise.all([
        dashboardService.fetchInventory(),
        dashboardService.fetchWarehouse(),
        dashboardService.fetchSales(),
        dashboardService.fetchExpenses()
      ]);
      setInventory(invData);
      setWarehouse(warehouseData);
      setSales(salesData);
      setExpenses(expensesData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        const superAdmin = user.email === 'banot@oceanring.com' || user.email === 'banotsky2020@gmail.com';
        setIsAdmin(superAdmin);
        setIsManager(user.email === 'harold@oceanring.com');
      }
    };
    checkUser();
    fetchData();

    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await dashboardService.addItem({
        name: newItemName,
        quantity: parseInt(newItemQty),
        price: parseFloat(newItemPrice)
      });
      setInventory([...inventory, newItem].sort((a, b) => a.name.localeCompare(b.name)));
      setNewItemName('');
      setNewItemQty('');
      setNewItemPrice('');
      setCalcMultiplier('');
      setCalcBase('');
      setToast({ message: 'Item registered successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleAddWarehouseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await dashboardService.addWarehouseItem({
        name: newWarehouseItemName,
        quantity: parseFloat(newWarehouseItemQty),
        unit: newWarehouseItemUnit
      });
      setWarehouse([...warehouse, newItem].sort((a, b) => a.name.localeCompare(b.name)));
      setNewWarehouseItemName('');
      setNewWarehouseItemQty('');
      setNewWarehouseItemUnit('');
      setCalcMultiplier('');
      setCalcBase('');
      setToast({ message: 'Material registered in warehouse', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === restockItemId);
    if (!item) return;

    try {
      const addedQty = parseInt(restockQty);
      const newQty = item.quantity + addedQty;
      
      await dashboardService.updateItem(restockItemId, { quantity: newQty });

      if (isRestockExpense) {
        const cost = addedQty * item.price;
        await dashboardService.addExpense({
          description: `Restock: ${item.name} (x${addedQty})`,
          amount: cost
        });
        fetchData(); 
      }

      setInventory(inventory.map(i => i.id === restockItemId ? { ...i, quantity: newQty } : i));
      setRestockItemId('');
      setRestockQty('');
      setIsRestockExpense(false);
      setCalcMultiplier('');
      setCalcBase('');
      setToast({ message: `Added ${addedQty} to ${item.name}`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDeleteItem = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Item',
      message: 'Are you sure you want to remove this item from inventory?',
      onConfirm: async () => {
        try {
          await dashboardService.deleteItem(id);
          setInventory(inventory.filter(item => item.id !== id));
          setToast({ message: 'Item deleted', type: 'success' });
        } catch (err: any) {
          setToast({ message: err.message, type: 'error' });
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteWarehouseItem = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Material',
      message: 'Are you sure you want to remove this material from warehouse?',
      onConfirm: async () => {
        try {
          await dashboardService.deleteWarehouseItem(id);
          setWarehouse(warehouse.filter(item => item.id !== id));
          setToast({ message: 'Material deleted', type: 'success' });
        } catch (err: any) {
          setToast({ message: err.message, type: 'error' });
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleStartEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditQty(item.quantity.toString());
    setEditPrice(item.price.toString());
  };

  const handleStartEditWarehouse = (item: WarehouseItem) => {
    setEditingWarehouseItem(item);
    setEditWarehouseName(item.name);
    setEditWarehouseQty(item.quantity.toString());
    setEditWarehouseUnit(item.unit);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updates = {
        name: editName,
        quantity: parseInt(editQty),
        price: parseFloat(editPrice)
      };
      await dashboardService.updateItem(editingItem.id, updates);
      setInventory(inventory.map(i => i.id === editingItem.id ? { ...i, ...updates } : i));
      setEditingItem(null);
      setToast({ message: 'Item updated successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleUpdateWarehouseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarehouseItem) return;

    try {
      const updates = {
        name: editWarehouseName,
        quantity: parseFloat(editWarehouseQty),
        unit: editWarehouseUnit
      };
      await dashboardService.updateWarehouseItem(editingWarehouseItem.id, updates);
      setWarehouse(warehouse.map(i => i.id === editingWarehouseItem.id ? { ...i, ...updates } : i));
      setEditingWarehouseItem(null);
      setToast({ message: 'Material updated successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === saleItemId);
    if (!item || !saleQty) return;

    const qty = parseInt(saleQty);
    if (qty > item.quantity) {
      setToast({ message: 'Insufficient stock', type: 'error' });
      return;
    }

    try {
      const totalPrice = qty * item.price;
      const newSale = await dashboardService.recordSale({
        item_name: item.name,
        quantity_sold: qty,
        total_price: totalPrice
      });

      const newQty = item.quantity - qty;
      await dashboardService.updateItem(saleItemId, { quantity: newQty });

      setSales([newSale, ...sales]);
      setInventory(inventory.map(i => i.id === saleItemId ? { ...i, quantity: newQty } : i));
      setSaleItemId('');
      setSaleQty('');
      setToast({ message: 'Sale recorded successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDeleteSale = async (sale: SaleRecord) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Sale',
      message: 'Are you sure you want to cancel this sale? This will NOT automatically restock the item.',
      onConfirm: async () => {
        try {
          await dashboardService.deleteSale(sale.id);
          setSales(sales.filter(s => s.id !== sale.id));
          setToast({ message: 'Sale record removed', type: 'success' });
        } catch (err: any) {
          setToast({ message: err.message, type: 'error' });
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newExpense = await dashboardService.addExpense({
        description: expenseDesc,
        amount: parseFloat(expenseAmount)
      });
      setExpenses([newExpense, ...expenses]);
      setExpenseDesc('');
      setExpenseAmount('');
      setToast({ message: 'Expense recorded', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Expense',
      message: 'Are you sure you want to remove this expense record?',
      onConfirm: async () => {
        try {
          await dashboardService.deleteExpense(id);
          setExpenses(expenses.filter(e => e.id !== id));
          setToast({ message: 'Expense record removed', type: 'success' });
        } catch (err: any) {
          setToast({ message: err.message, type: 'error' });
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const getLedger = useCallback((): LedgerEntry[] => {
    const ledgerSales: LedgerEntry[] = sales.map(s => ({
      id: s.id,
      type: 'sale',
      description: `Sale: ${s.item_name} (x${s.quantity_sold})`,
      amount: s.total_price,
      date: s.created_at
    }));

    const ledgerExpenses: LedgerEntry[] = expenses.map(e => ({
      id: e.id,
      type: 'expense',
      description: e.description,
      amount: e.amount,
      date: e.created_at
    }));

    return [...ledgerSales, ...ledgerExpenses].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [sales, expenses]);

  return {
    activeTab, setActiveTab,
    inventory, warehouse, sales, expenses,
    loading, error,
    isSidebarOpen, setIsSidebarOpen,
    isAdmin, isManager, userEmail,
    newItemName, setNewItemName,
    newItemQty, setNewItemQty,
    newItemPrice, setNewItemPrice,
    newWarehouseItemName, setNewWarehouseItemName,
    newWarehouseItemQty, setNewWarehouseItemQty,
    newWarehouseItemUnit, setNewWarehouseItemUnit,
    restockItemId, setRestockItemId,
    restockQty, setRestockQty,
    isRestockExpense, setIsRestockExpense,
    calcMultiplier, setCalcMultiplier,
    calcBase, setCalcBase,
    saleItemId, setSaleItemId,
    saleQty, setSaleQty,
    expenseDesc, setExpenseDesc,
    expenseAmount, setExpenseAmount,
    searchTerm, setSearchTerm,
    warehouseSearchTerm, setWarehouseSearchTerm,
    salesSearchTerm, setSalesSearchTerm,
    expenseSearchTerm, setExpenseSearchTerm,
    ledgerSearchTerm, setLedgerSearchTerm,
    selectedDate, setSelectedDate,
    useDateFilter, setUseDateFilter,
    expenseSelectedDate, setExpenseSelectedDate,
    useExpenseDateFilter, setUseExpenseDateFilter,
    ledgerSelectedDate, setLedgerSelectedDate,
    useLedgerDateFilter, setUseLedgerDateFilter,
    editingItem, setEditingItem,
    editName, setEditName,
    editQty, setEditQty,
    editPrice, setEditPrice,
    editingWarehouseItem, setEditingWarehouseItem,
    editWarehouseName, setEditWarehouseName,
    editWarehouseQty, setEditWarehouseQty,
    editWarehouseUnit, setEditWarehouseUnit,
    confirmModal, setConfirmModal,
    toast, setToast,
    handleAddItem, handleAddWarehouseItem, handleRestock, handleDeleteItem, handleDeleteWarehouseItem,
    handleStartEdit, handleStartEditWarehouse, handleUpdateItem, handleUpdateWarehouseItem, handleRecordSale,
    handleDeleteSale, handleAddExpense, handleDeleteExpense,
    getLedger, fetchData
  };
}
