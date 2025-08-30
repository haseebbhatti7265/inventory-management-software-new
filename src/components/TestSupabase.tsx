// pages/test-supabase.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrMsg(null);


      const { data, error } = await supabase.from('name').select('*');

      if (error) throw error;
      setProducts(data ?? []);
    } catch (err: any) {
      setErrMsg(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    try {
      setLoading(true);
      setErrMsg(null);
      const { error } = await supabase
        .from('products')
        .insert([{ name: 'Test Product', price: 100 }]);
      if (error) throw error;
      await fetchProducts();
    } catch (err: any) {
      setErrMsg(err.message || 'Insert failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase Products</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={addProduct}>➕ Add Test Product</button>
        <button onClick={fetchProducts} style={{ marginLeft: 10 }}>
          🔄 Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {errMsg && <p style={{ color: 'red' }}>Error: {errMsg}</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
