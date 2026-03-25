export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  classification?: string;
  unit?: string;
  created_at?: string;
}

export interface SaleRecord {
  id: string;
  item_name: string;
  quantity_sold: number;
  total_price: number;
  created_at: string;
}

export interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  type: 'sale' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export type TabType = 'overview' | 'inventory' | 'sales' | 'miscellaneous' | 'ledger' | 'create-user';
