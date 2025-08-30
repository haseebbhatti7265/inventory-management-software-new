import supabase from '../supabaseClient';

// --- CATEGORY CRUD ---
export const getcategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

export const addcategory = async (name: string) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }]);
  if (error) throw error;
  return data;
};

// --- PRODUCT CRUD ---
export const getproducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category_id(name)')
    .order('name');
  if (error) throw error;
  return data;
};

export const addproduct = async (product: {
  name: string;
  category_id: number;
  unit: string;
  selling_price: number;
}) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product]);
  if (error) throw error;
  return data;
};

// --- STOCK CRUD ---
export const getstock = async () => {
  const { data, error } = await supabase
    .from('stock')
    .select('*, product:product_id(name, selling_price)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addstock = async (stock: {
  product_id: number;
  quantity: number;
  purchase_price: number;
}) => {
  const { data, error } = await supabase
    .from('stock')
    .insert([stock]);
  if (error) throw error;
  return data;
};

// --- SALES CRUD ---
export const getsales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select('*, product:product_id(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addsale = async (sale: {
  product_id: number;
  selling_price: number;
  quantity: number;
}) => {
  const { data, error } = await supabase
    .from('sales')
    .insert([sale]);
  if (error) throw error;
  return data;
};
