import React from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { TrendingUp, Package, Tags, Warehouse, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { dashboardStats, sales, products, loading, error } = useInventory();

  const recentSales = sales
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const statsCards = [
    {
      title: 'Total Products',
      value: dashboardStats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Categories',
      value: dashboardStats.totalCategories,
      icon: Tags,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Stock',
      value: dashboardStats.totalStock,
      icon: Warehouse,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Sales',
      value: dashboardStats.totalSales,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Revenue',
      value: `Rs${dashboardStats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Profit',
      value: `Rs${dashboardStats.totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Dashboard</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your inventory management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-orange-600" />
              Recent Sales
            </h2>
          </div>
          <div className="p-6">
            {recentSales.length > 0 ? (
              <div className="space-y-4">
                {recentSales.map((sale) => {
                  const product = products.find(p => p.id === sale.product_id);
                  return (
                    <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-600">
                          {sale.quantity} {product?.unit} • Rs{sale.selling_price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Rs{sale.total_revenue.toFixed(2)}</p>
                        <p className="text-sm text-green-600">+Rs{sale.profit.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sales yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start recording sales to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
              Low Stock Alert
            </h2>
          </div>
          <div className="p-6">
            {dashboardStats.lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {dashboardStats.lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category_name || 'Unknown Category'}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>
                ))}
                {dashboardStats.lowStockProducts.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{dashboardStats.lowStockProducts.length - 5} more products with low stock
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Warehouse className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">All good!</h3>
                <p className="mt-1 text-sm text-gray-500">No products are running low on stock.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
