import { useState, useEffect } from 'react';
import {
  getCategories,
  addCategory,
  getProducts,
  addProduct,
  getStock,
  addStock,
  getSales,
  addSale
} from '../services/productService';

export default function TestSupabase() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  const fetchAll = async () => {
    setCategories(await getCategories());
    setProducts(await getProducts());
    setStock(await getStock());
    setSales(await getSales());
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCategory = async () => {
    await addCategory('New Category');
    fetchAll();
  };

  const handleAddProduct = async () => {
    if (!categories.length) return alert('Add category first');
    await addProduct({
      name: 'Sample Product',
      category_id: categories[0].id,
      unit: 'pcs',
      selling_price: 100
    });
    fetchAll();
  };

  const handleAddStock = async () => {
    if (!products.length) return alert('Add product first');
    await addStock({
      product_id: products[0].id,
      quantity: 10,
      purchase_price: 80
    });
    fetchAll();
  };

  const handleAddSale = async () => {
    if (!products.length) return alert('Add product first');
    await addSale({
      product_id: products[0].id,
      selling_price: 120,
      quantity: 2
    });
    fetchAll();
  };

  return (
    <div>
      <h1>Supabase Test</h1>
      <button onClick={handleAddCategory}>Add Category</button>
      <button onClick={handleAddProduct}>Add Product</button>
      <button onClick={handleAddStock}>Add Stock</button>
      <button onClick={handleAddSale}>Add Sale</button>

      <h2>Categories</h2>
      <pre>{JSON.stringify(categories, null, 2)}</pre>

      <h2>Products</h2>
      <pre>{JSON.stringify(products, null, 2)}</pre>

      <h2>Stock</h2>
      <pre>{JSON.stringify(stock, null, 2)}</pre>

      <h2>Sales</h2>
      <pre>{JSON.stringify(sales, null, 2)}</pre>
    </div>
  );
}
