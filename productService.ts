import supabase from '../supabaseClient';

// --- CATEGORY CRUD ---
export const getCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
};

export const addCategory = async (name: string) => {
  const { data, error } = await supabase.from('categories').insert([{ name }]);
  if (error) throw error;
  return data;
};

// --- PRODUCT CRUD ---
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category_id(name)')
    .order('name');
  if (error) throw error;
  return data;
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

// --- STOCK CRUD ---
export const getStock = async () => {
  const { data, error } = await supabase
    .from('stock')
    .select('*, product:product_id(name, selling_price)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addStock = async (stock: {
  product_id: number;
  quantity: number;
  purchase_price: number;
}) => {
  const { data, error } = await supabase.from('stock').insert([stock]);
  if (error) throw error;
  return data;
};

// --- SALES CRUD ---
export const getSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select('*, product:product_id(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addSale = async (sale: {
  product_id: number;
  selling_price: number;
  quantity: number;
}) => {
  const { data, error } = await supabase.from('sales').insert([sale]);
  if (error) throw error;
  return data;
};
