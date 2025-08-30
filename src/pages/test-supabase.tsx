// pages/test-supabase.tsx
import { useEffect, useState } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';

type Product = {
  id: number;
  name: string;
  selling_price: number;
  quantity: number;
};

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrMsg(null);
      const data = await fetchProducts(); // Fetch all products from the database
      setProducts(data);
    } catch (err: any) {
      setErrMsg(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      setErrMsg(null);
      // Add a new product with name, selling price, and quantity
      await addProduct({ name: 'Test Product', selling_price: 100, quantity: 10 });
      await loadProducts(); // Reload the products list
    } catch (err: any) {
      setErrMsg(err.message || 'Insert failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true);
      setErrMsg(null);
      await deleteProduct(id); // Delete the selected product
      await loadProducts(); // Reload the products list
    } catch (err: any) {
      setErrMsg(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(); // Load products when the component is mounted
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase Products</h2>
      <button onClick={handleAddProduct}>➕ Add Test Product</button>
      {loading && <p>Loading...</p>}
      {errMsg && <p style={{ color: 'red' }}>Error: {errMsg}</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — {p.selling_price} — {p.quantity}{' '}
            <button onClick={() => handleDeleteProduct(p.id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
