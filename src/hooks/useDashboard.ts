import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { dashboardService } from '../services/dashboardService';
import { InventoryItem, SaleRecord, ExpenseRecord, TabType, LedgerEntry } from '../types/dashboard';

export function useDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
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
  const [newItemClassification, setNewItemClassification] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  const [restockItemId, setRestockItemId] = useState('');
  const [restockQty, setRestockQty] = useState('');
  const [restockPrice, setRestockPrice] = useState('');
  const [isRestockExpense, setIsRestockExpense] = useState(false);

  const [calcMultiplier, setCalcMultiplier] = useState('');
  const [calcBase, setCalcBase] = useState('');

  const [saleItemId, setSaleItemId] = useState('');
  const [saleQty, setSaleQty] = useState('');

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');
  const [ledgerSearchTerm, setLedgerSearchTerm] = useState('');
  const [inventoryClassificationFilter, setInventoryClassificationFilter] = useState('');
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
  const [editUnit, setEditUnit] = useState('');

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
      const [invData, salesData, expensesData] = await Promise.all([
        dashboardService.fetchInventory(),
        dashboardService.fetchSales(),
        dashboardService.fetchExpenses()
      ]);
      setInventory(invData);
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
        price: parseFloat(newItemPrice),
        classification: newItemClassification,
        unit: newItemUnit
      });
      setInventory([...inventory, newItem].sort((a, b) => a.name.localeCompare(b.name)));
      setNewItemName('');
      setNewItemQty('');
      setNewItemPrice('');
      setNewItemClassification('');
      setNewItemUnit('');
      setCalcMultiplier('');
      setCalcBase('');
      setToast({ message: 'Item registered successfully', type: 'success' });
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
      const restockPriceNum = parseFloat(restockPrice);

      if (restockPriceNum === item.price) {
        // Merge: Update existing item
        const newQty = item.quantity + addedQty;
        await dashboardService.updateItem(restockItemId, { quantity: newQty });
        setInventory(inventory.map(i => i.id === restockItemId ? { ...i, quantity: newQty } : i));
        setToast({ message: `Added ${addedQty} to ${item.name}`, type: 'success' });
      } else {
        // Don't merge: Add new item entry
        const newItem = await dashboardService.addItem({
          name: item.name,
          quantity: addedQty,
          price: restockPriceNum,
          classification: item.classification,
          unit: item.unit
        });
        setInventory([...inventory, newItem].sort((a, b) => a.name.localeCompare(b.name)));
        setToast({ message: `Added ${addedQty} of ${item.name} at new price ₱${restockPriceNum}`, type: 'success' });
      }

      if (isRestockExpense) {
        const cost = addedQty * restockPriceNum;
        await dashboardService.addExpense({
          description: `Restock: ${item.name} (x${addedQty} @ ₱${restockPriceNum})`,
          amount: cost
        });
        fetchData(); 
      }

      setRestockItemId('');
      setRestockQty('');
      setRestockPrice('');
      setIsRestockExpense(false);
      setCalcMultiplier('');
      setCalcBase('');
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

  const handleStartEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditQty(item.quantity.toString());
    setEditPrice(item.price.toString());
    setEditUnit(item.unit || '');
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updates = {
        name: editName,
        quantity: parseInt(editQty),
        price: parseFloat(editPrice),
        unit: editUnit
      };
      await dashboardService.updateItem(editingItem.id, updates);
      setInventory(inventory.map(i => i.id === editingItem.id ? { ...i, ...updates } : i));
      setEditingItem(null);
      setToast({ message: 'Item updated successfully', type: 'success' });
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
    inventory, sales, expenses,
    loading, error,
    isSidebarOpen, setIsSidebarOpen,
    isAdmin, isManager, userEmail,
    newItemName, setNewItemName,
    newItemQty, setNewItemQty,
    newItemPrice, setNewItemPrice,
    newItemClassification, setNewItemClassification,
    newItemUnit, setNewItemUnit,
    restockItemId, setRestockItemId,
    restockQty, setRestockQty,
    restockPrice, setRestockPrice,
    isRestockExpense, setIsRestockExpense,
    calcMultiplier, setCalcMultiplier,
    calcBase, setCalcBase,
    saleItemId, setSaleItemId,
    saleQty, setSaleQty,
    expenseDesc, setExpenseDesc,
    expenseAmount, setExpenseAmount,
    searchTerm, setSearchTerm,
    salesSearchTerm, setSalesSearchTerm,
    expenseSearchTerm, setExpenseSearchTerm,
    ledgerSearchTerm, setLedgerSearchTerm,
    inventoryClassificationFilter, setInventoryClassificationFilter,
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
    editUnit, setEditUnit,
    confirmModal, setConfirmModal,
    toast, setToast,
    handleAddItem, handleRestock, handleDeleteItem,
    handleStartEdit, handleUpdateItem, handleRecordSale,
    handleDeleteSale, handleAddExpense, handleDeleteExpense,
    getLedger, fetchData
  };
}
