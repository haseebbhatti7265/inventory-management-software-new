import { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null); // ✅ rename to avoid conflict

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setErrMsg(null);

    const { data, error } = await supabase
      .from<Product>('products') // ✅ type hint added
      .select('*');

    if (error) {
      setErrMsg(error.message);
    } else if (data) {
      setProducts(data);
    }

    setLoading(false);
  };

  // Insert a sample product
  const addProduct = async () => {
    const { error } = await supabase
      .from('products')
      .insert([{ name: 'Test Product', price: 100 }]);

    if (error) {
      setErrMsg(error.message);
    } else {
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supabase Products</h2>

      <button onClick={addProduct}>➕ Add Test Product</button>
      <button onClick={fetchProducts} style={{ marginLeft: '10px' }}>
        🔄 Refresh
      </button>

      {loading && <p>Loading...</p>}
      {errMsg && <p style={{ color: 'red' }}>Error: {errMsg}</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - PKR {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
