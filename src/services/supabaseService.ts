import { supabase } from '../supabaseClient';
import { Product, Category, StockEntry, Sale } from '../type';

export const supabaseService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name)
      `)
      .order('name');
    
    if (error) throw error;
    
    // Transform data to include category_name
    return (data || []).map(product => ({
      ...product,
      category_name: product.categories?.name
    }));
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'stock' | 'category_name'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, stock: 0 }])
      .select(`
        *,
        categories(name)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      category_name: data.categories?.name
    };
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        categories(name)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      category_name: data.categories?.name
    };
  },

  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Stock Entries
  async getStockEntries(): Promise<StockEntry[]> {
    const { data, error } = await supabase
      .from('stock_entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createStockEntry(stockEntry: Omit<StockEntry, 'id' | 'created_at' | 'total_cost'>): Promise<StockEntry> {
    const totalCost = stockEntry.quantity * stockEntry.purchase_price;
    const { data, error } = await supabase
      .from('stock_entries')
      .insert([{ ...stockEntry, total_cost: totalCost }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteStockEntry(id: number): Promise<void> {
    const { error } = await supabase
      .from('stock_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Sales
  async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createSale(sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSale(id: number): Promise<void> {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Utility functions
  async updateProductStock(productId: number, newStock: number, newPurchasePrice?: number): Promise<void> {
    const updates: Partial<Product> = { stock: newStock };
    if (newPurchasePrice !== undefined) {
      updates.purchase_price = newPurchasePrice;
    }
    
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId);
    
    if (error) throw error;
  }
};
