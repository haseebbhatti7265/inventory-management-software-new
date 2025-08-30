import { supabase } from './supabaseClient'

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) throw error
  return data ?? []
}

export async function addProduct(product: { name: string; price: number; quantity: number }) {
  const { data, error } = await supabase.from('products').insert([product])
  if (error) throw error
  return data
}

export async function updateProduct(id: number, updates: Partial<{ name: string; price: number; quantity: number }>) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id)
  if (error) throw error
  return data
}

export async function deleteProduct(id: number) {
  const { data, error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  return data
}
