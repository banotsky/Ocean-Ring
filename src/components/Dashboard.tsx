import React from 'react';
import { Menu, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboard } from '../hooks/useDashboard';

// Components
import { Sidebar } from './dashboard/Sidebar';
import { OverviewTab } from './dashboard/OverviewTab';
import { InventoryTab } from './dashboard/InventoryTab';
import { WarehouseTab } from './dashboard/WarehouseTab';
import { SalesTab } from './dashboard/SalesTab';
import { ExpensesTab } from './dashboard/ExpensesTab';
import { LedgerTab } from './dashboard/LedgerTab';
import { EditItemModal, EditWarehouseItemModal, ConfirmModal, Toast } from './dashboard/Modals';

export default function Dashboard() {
  const {
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
    toast,
    handleAddItem, handleAddWarehouseItem, handleRestock, handleDeleteItem, handleDeleteWarehouseItem,
    handleStartEdit, handleStartEditWarehouse, handleUpdateItem, handleUpdateWarehouseItem, handleRecordSale,
    handleDeleteSale, handleAddExpense, handleDeleteExpense,
    getLedger
  } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold font-serif text-xl tracking-tight">Loading your business data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl luxury-border shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-20 h-20 text-rose-600 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Connection Error</h2>
          <p className="text-slate-600 mb-10 leading-relaxed text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            inventory={inventory}
            sales={sales}
            expenses={expenses}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            useDateFilter={useDateFilter}
            setUseDateFilter={setUseDateFilter}
            setActiveTab={setActiveTab}
          />
        );
      case 'inventory':
        return (
          <InventoryTab 
            inventory={inventory}
            isAdmin={isAdmin}
            isManager={isManager}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            newItemQty={newItemQty}
            setNewItemQty={setNewItemQty}
            newItemPrice={newItemPrice}
            setNewItemPrice={setNewItemPrice}
            restockItemId={restockItemId}
            setRestockItemId={setRestockItemId}
            restockQty={restockQty}
            setRestockQty={setRestockQty}
            isRestockExpense={isRestockExpense}
            setIsRestockExpense={setIsRestockExpense}
            calcMultiplier={calcMultiplier}
            setCalcMultiplier={setCalcMultiplier}
            calcBase={calcBase}
            setCalcBase={setCalcBase}
            handleAddItem={handleAddItem}
            handleRestock={handleRestock}
            handleDeleteItem={handleDeleteItem}
            handleStartEdit={handleStartEdit}
          />
        );
      case 'warehouse':
        return (
          <WarehouseTab 
            warehouse={warehouse}
            isAdmin={isAdmin}
            isManager={isManager}
            warehouseSearchTerm={warehouseSearchTerm}
            setWarehouseSearchTerm={setWarehouseSearchTerm}
            newWarehouseItemName={newWarehouseItemName}
            setNewWarehouseItemName={setNewWarehouseItemName}
            newWarehouseItemQty={newWarehouseItemQty}
            setNewWarehouseItemQty={setNewWarehouseItemQty}
            newWarehouseItemUnit={newWarehouseItemUnit}
            setNewWarehouseItemUnit={setNewWarehouseItemUnit}
            calcMultiplier={calcMultiplier}
            setCalcMultiplier={setCalcMultiplier}
            calcBase={calcBase}
            setCalcBase={setCalcBase}
            handleAddWarehouseItem={handleAddWarehouseItem}
            handleDeleteWarehouseItem={handleDeleteWarehouseItem}
            handleStartEditWarehouse={handleStartEditWarehouse}
          />
        );
      case 'sales':
        return (
          <SalesTab 
            inventory={inventory}
            sales={sales}
            isAdmin={isAdmin}
            isManager={isManager}
            salesSearchTerm={salesSearchTerm}
            setSalesSearchTerm={setSalesSearchTerm}
            saleItemId={saleItemId}
            setSaleItemId={setSaleItemId}
            saleQty={saleQty}
            setSaleQty={setSaleQty}
            calcMultiplier={calcMultiplier}
            setCalcMultiplier={setCalcMultiplier}
            calcBase={calcBase}
            setCalcBase={setCalcBase}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            useDateFilter={useDateFilter}
            setUseDateFilter={setUseDateFilter}
            handleRecordSale={handleRecordSale}
            handleDeleteSale={handleDeleteSale}
          />
        );
      case 'miscellaneous':
        return (
          <ExpensesTab 
            expenses={expenses}
            isAdmin={isAdmin}
            isManager={isManager}
            expenseSearchTerm={expenseSearchTerm}
            setExpenseSearchTerm={setExpenseSearchTerm}
            expenseDesc={expenseDesc}
            setExpenseDesc={setExpenseDesc}
            expenseAmount={expenseAmount}
            setExpenseAmount={setExpenseAmount}
            expenseSelectedDate={expenseSelectedDate}
            setExpenseSelectedDate={setExpenseSelectedDate}
            useExpenseDateFilter={useExpenseDateFilter}
            setUseExpenseDateFilter={setUseExpenseDateFilter}
            handleAddExpense={handleAddExpense}
            handleDeleteExpense={handleDeleteExpense}
          />
        );
      case 'ledger':
        return (
          <LedgerTab 
            ledger={getLedger()}
            ledgerSearchTerm={ledgerSearchTerm}
            setSearchTerm={setLedgerSearchTerm}
            ledgerSelectedDate={ledgerSelectedDate}
            setLedgerSelectedDate={setLedgerSelectedDate}
            useLedgerDateFilter={useLedgerDateFilter}
            setUseLedgerDateFilter={setUseLedgerDateFilter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 text-lg">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userEmail={userEmail}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Menu className="w-8 h-8" />
            </button>
            <h2 className="text-3xl font-bold text-slate-900 font-serif capitalize tracking-tight">
              {activeTab === 'miscellaneous' ? 'Expenses' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals & Toasts */}
      <EditItemModal 
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleUpdateItem}
        editName={editName}
        setEditName={setEditName}
        editQty={editQty}
        setEditQty={setEditQty}
        editPrice={editPrice}
        setEditPrice={setEditPrice}
      />

      <EditWarehouseItemModal 
        isOpen={!!editingWarehouseItem}
        onClose={() => setEditingWarehouseItem(null)}
        onSubmit={handleUpdateWarehouseItem}
        editName={editWarehouseName}
        setEditName={setEditWarehouseName}
        editQty={editWarehouseQty}
        setEditQty={setEditWarehouseQty}
        editUnit={editWarehouseUnit}
        setEditUnit={setEditWarehouseUnit}
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}
