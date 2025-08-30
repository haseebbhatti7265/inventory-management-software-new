// pages/test-supabase.tsx
import { useEffect, useState } from 'react';
import {
  fetchcategories,
  addcategory,
  fetchproducts,
  addproduct,
  updateproduct,
  deleteproduct,
  fetchstock,
  addstock,
  fetchsales,
  addsale
} from '../services/productService';

type product = {
  id: number;
  name: string;
  unit: string;
  selling_price: number;
  category_id: number;
  created_at: string;
};

export default function TestSupabase() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setErrMsg(null);
      const categoryData = await fetchCategories();
      const productData = await fetchProducts();
      const stockData = await fetchStock();
      const saleData = await fetchSales();
      setcategories(categoryData);
      setproducts(productData);
      setstock(stockData);
      setsales(saleData);
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
      await addproduct({
        name: 'New Product',
        selling_price: 100,
        category_id: 1, // Assuming category ID 1 exists
        unit: 'pcs'
      });
      await loadAllData();
    } catch (err: any) {
      setErrMsg(err.message || 'Insert failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteproduct = async (id: number) => {
    try {
      setLoading(true);
      setErrMsg(null);
      await deleteproduct(id);
      await loadAllData();
    } catch (err: any) {
      setErrMsg(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData(); // Load categories, products, stock, and sales data on page load
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase Inventory</h2>
      <button onClick={handleAddProduct}>➕ Add New Product</button>
      {loading && <p>Loading...</p>}
      {errMsg && <p style={{ color: 'red' }}>Error: {errMsg}</p>}

      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>

      <h3>Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — {product.selling_price} — {product.unit} — Category: {product.category_id}{' '}
            <button onClick={() => handleDeleteProduct(product.id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>

      <h3>Stock</h3>
      <ul>
        {stock.map((item) => (
          <li key={item.id}>
            Product ID: {item.product_id} — Quantity: {item.quantity} — Purchase Price: {item.purchase_price}
          </li>
        ))}
      </ul>

      <h3>Sales</h3>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            Product ID: {sale.product_id} — Selling Price: {sale.selling_price} — Quantity: {sale.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
