import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Product, Category, StockEntry, Sale, DashboardStats } from '../type';
import { supabaseService } from '../services/supabaseService';

interface InventoryContextType {
  // Data
  products: Product[];
  categories: Category[];
  stockEntries: StockEntry[];
  sales: Sale[];
  dashboardStats: DashboardStats;
  loading: boolean;
  error: string | null;

  // Products
  addproduct: (product: Omit<Product, 'id' | 'created_at' | 'stock' | 'category_name'>) => Promise<void>;
  updateproduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteproduct: (id: number) => Promise<void>;

  // Categories
  addcategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updatecategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deletecategory: (id: number) => Promise<void>;

  // Stock
  addstock: (stock: Omit<StockEntry, 'id' | 'created_at' | 'total_cost'>) => Promise<void>;
  deletestockentry: (id: number) => Promise<void>;

  // Sales
  addsale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
  deletesale: (id: number) => Promise<void>;

  // Refresh data
  refreshData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase on mount
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, productsData, stockEntriesData, salesData] = await Promise.all([
        supabaseService.getCategories(),
        supabaseService.getProducts(),
        supabaseService.getStockEntries(),
        supabaseService.getSales()
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
      setStockEntries(stockEntriesData);
      setSales(salesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_revenue, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const lowStockProducts = products.filter(product => product.stock <= 5);

    return {
      totalProducts,
      totalCategories,
      totalStock,
      totalSales,
      totalRevenue,
      totalProfit,
      lowStockProducts,
    };
  }, [products, categories, sales]);

  // Products
  const addproduct = async (productData: Omit<Product, 'id' | 'created_at' | 'stock' | 'category_name'>) => {
    try {
      const newProduct = await supabaseService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      throw err;
    }
  };

  const updateproduct = async (id: number, updates: Partial<Product>) => {
    try {
      const updatedProduct = await supabaseService.updateProduct(id, updates);
      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));
    } catch (err) {
      throw err;
    }
  };

  const deleteproduct = async (id: number) => {
    try {
      await supabaseService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      setStockEntries(prev => prev.filter(se => se.product_id !== id));
      setSales(prev => prev.filter(s => s.product_id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Categories
  const addcategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const newCategory = await supabaseService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      throw err;
    }
  };

  const updatecategory = async (id: number, updates: Partial<Category>) => {
    try {
      const updatedCategory = await supabaseService.updateCategory(id, updates);
      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ));
    } catch (err) {
      throw err;
    }
  };

  const deletecategory = async (id: number) => {
    try {
      await supabaseService.deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Stock
  const addstock = async (stockData: Omit<StockEntry, 'id' | 'created_at' | 'total_cost'>) => {
    try {
      const totalCost = stockData.quantity * stockData.purchase_price;
      const newStockEntry = await supabaseService.createStockEntry({
        ...stockData,
        total_cost: totalCost
      });

      // Update product stock and purchase price (weighted average)
      const product = products.find(p => p.id === stockData.product_id);
      if (product) {
        const currentStock = product.stock;
        const currentPurchasePrice = product.purchase_price || 0;
        const newStock = currentStock + stockData.quantity;

        const totalCurrentValue = currentStock * currentPurchasePrice;
        const totalNewValue = totalCurrentValue + totalCost;
        const newPurchasePrice = newStock > 0 ? totalNewValue / newStock : stockData.purchase_price;

        await supabaseService.updateProductStock(stockData.product_id, newStock, newPurchasePrice);
        
        setProducts(prev => prev.map(p => 
          p.id === stockData.product_id 
            ? { ...p, stock: newStock, purchase_price: newPurchasePrice }
            : p
        ));
      }

      setStockEntries(prev => [...prev, newStockEntry]);
    } catch (err) {
      throw err;
    }
  };

  const deletestockentry = async (id: number) => {
    try {
      const entry = stockEntries.find(se => se.id === id);
      if (!entry) return;

      await supabaseService.deleteStockEntry(id);

      // Roll back the stock on the related product
      const product = products.find(p => p.id === entry.product_id);
      if (product) {
        const newStock = Math.max(0, product.stock - entry.quantity);
        await supabaseService.updateProductStock(entry.product_id, newStock);
        
        setProducts(prev => prev.map(p =>
          p.id === entry.product_id ? { ...p, stock: newStock } : p
        ));
      }

      setStockEntries(prev => prev.filter(se => se.id !== id));
    } catch (err) {
      throw err;
    }
  };

  // Sales
  const addsale = async (saleData: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const product = products.find(p => p.id === saleData.product_id);
      if (!product || product.stock < saleData.quantity) {
        throw new Error('Insufficient stock');
      }

      const totalRevenue = saleData.quantity * saleData.selling_price;
      const purchasePrice = product.purchase_price || 0;
      const profit = saleData.quantity * (saleData.selling_price - purchasePrice);

      const newSale = await supabaseService.createSale({
        ...saleData,
        total_revenue: totalRevenue,
        profit: profit
      });

      // Update product stock
      const newStock = product.stock - saleData.quantity;
      await supabaseService.updateProductStock(saleData.product_id, newStock);
      
      setProducts(prev => prev.map(p =>
        p.id === saleData.product_id ? { ...p, stock: newStock } : p
      ));

      setSales(prev => [...prev, newSale]);
    } catch (err) {
      throw err;
    }
  };

  const deletesale = async (id: number) => {
    try {
      const sale = sales.find(s => s.id === id);
      if (!sale) return;

      await supabaseService.deleteSale(id);

      // Restore stock to the related product
      const product = products.find(p => p.id === sale.product_id);
      if (product) {
        const newStock = product.stock + sale.quantity;
        await supabaseService.updateProductStock(sale.product_id, newStock);
        
        setProducts(prev => prev.map(p =>
          p.id === sale.product_id ? { ...p, stock: newStock } : p
        ));
      }

      setSales(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        stockEntries,
        sales,
        dashboardStats,
        loading,
        error,
        addproduct,
        updateproduct,
        deleteproduct,
        addcategory,
        updatecategory,
        deletecategory,
        addstock,
        deletestockentry,
        addsale,
        deletesale,
        refreshData,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
