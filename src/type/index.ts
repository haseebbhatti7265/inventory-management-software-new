export interface Product {
  id: number;
  name: string;
  category_id: number;
  category_name?: string; // For display purposes
  unit: string;
  selling_price: number;
  stock: number;
  purchase_price?: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface StockEntry {
  id: number;
  product_id: number;
  quantity: number;
  purchase_price: number;
  total_cost: number;
  created_at: string;
}

export interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  total_revenue: number;
  profit: number;
  created_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalStock: number;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  lowStockProducts: Product[];
}