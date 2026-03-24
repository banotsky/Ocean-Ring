import { supabase } from '../lib/supabase';
import { InventoryItem, SaleRecord, ExpenseRecord, WarehouseItem } from '../types/dashboard';

export const dashboardService = {
  async fetchInventory(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async fetchWarehouse(): Promise<WarehouseItem[]> {
    const { data, error } = await supabase
      .from('warehouse')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async fetchSales(): Promise<SaleRecord[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchExpenses(): Promise<ExpenseRecord[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select();
    if (error) throw error;
    return data[0];
  },

  async addWarehouseItem(item: Omit<WarehouseItem, 'id' | 'created_at'>): Promise<WarehouseItem> {
    const { data, error } = await supabase
      .from('warehouse')
      .insert([item])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
    const { error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  async updateWarehouseItem(id: string, updates: Partial<WarehouseItem>): Promise<void> {
    const { error } = await supabase
      .from('warehouse')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async deleteWarehouseItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('warehouse')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async recordSale(sale: Omit<SaleRecord, 'id' | 'created_at'>): Promise<SaleRecord> {
    const { data, error } = await supabase
      .from('sales')
      .insert([sale])
      .select();
    if (error) throw error;
    return data[0];
  },

  async addExpense(expense: Omit<ExpenseRecord, 'id' | 'created_at'>): Promise<ExpenseRecord> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteSale(id: string): Promise<void> {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
