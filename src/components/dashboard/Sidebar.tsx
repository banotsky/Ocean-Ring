import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Receipt, 
  BookOpen, 
  LogOut, 
  X,
  ChevronRight,
  Warehouse,
  UserPlus
} from 'lucide-react';
import { TabType } from '../../types/dashboard';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  userEmail: string | null;
  isAdmin: boolean;
  isManager: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab,
  isSidebarOpen, setIsSidebarOpen,
  userEmail, isAdmin, isManager
}) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'warehouse', label: 'Warehouse', icon: Warehouse },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'miscellaneous', label: 'Expenses', icon: Receipt },
    { id: 'ledger', label: 'Ledger', icon: BookOpen },
    { id: 'create-user', label: 'Create User', icon: UserPlus },
  ].filter(item => {
    if (item.id === 'ledger') return isAdmin;
    if (item.id === 'create-user') return isAdmin;
    if (item.id === 'miscellaneous') return isAdmin || isManager;
    return true;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-800/20">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">StockMaster</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X className="w-8 h-8" />
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 group
                  ${activeTab === item.id 
                    ? 'bg-slate-800 text-white shadow-xl shadow-slate-800/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`w-6 h-6 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="font-bold text-base tracking-wide">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-5 h-5" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-100">
            <div className="bg-slate-50 p-5 rounded-2xl mb-6">
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-2">Logged in as</p>
              <p className="text-sm font-bold text-slate-700 truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-200 font-bold text-base"
            >
              <LogOut className="w-6 h-6" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
