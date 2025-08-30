import { supabase } from './supabaseClient';

// --- CATEGORY CRUD ---
export const fetchCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data ?? [];
};

export const addCategory = async (name: string) => {
  const { data, error } = await supabase.from('categories').insert([{ name }]);
  if (error) throw error;
  return data;
};

// --- PRODUCT CRUD ---
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, unit, selling_price, category_id, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const addProduct = async (product: {
  name: string;
  category_id: number;
  unit: string;
  selling_price: number;
}) => {
  const { data, error } = await supabase.from('products').insert([product]);
  if (error) throw error;
  return data;
};

export const updateProduct = async (
  id: number,
  updates: Partial<{ name: string; unit: string; selling_price: number; category_id: number }>
) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: number) => {
  const { data, error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return data;
};

// --- STOCK CRUD ---
export const fetchStock = async () => {
  const { data, error } = await supabase.from('stock').select('*');
  if (error) throw error;
  return data ?? [];
};

export const addStock = async (stock: { product_id: number; quantity: number; purchase_price: number }) => {
  const { data, error } = await supabase.from('stock').insert([stock]);
  if (error) throw error;
  return data;
};

// --- SALES CRUD ---
export const fetchSales = async () => {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) throw error;
  return data ?? [];
};

export const addSale = async (sale: { product_id: number; selling_price: number; quantity: number }) => {
  const { data, error } = await supabase.from('sales').insert([sale]);
  if (error) throw error;
  return data;
};
