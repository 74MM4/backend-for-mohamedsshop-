import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Package as PackageIcon, Grid3x3, Settings, LogOut } from 'lucide-react';
import { OrdersTab } from './admin/OrdersTab';
import { ProductsTab } from './admin/ProductsTab';
import { CategoriesTab } from './admin/CategoriesTab';
import { SettingsTab } from './admin/SettingsTab';
import { Order, Product, Category, EmailConfig, StoreConfig, User } from '../App';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  onBack: () => void;
  onLogout: () => void;
  user: User | null;
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (categoryId: string, updates: Partial<Category>) => void;
  onDeleteCategory: (categoryId: string) => void;
  emailConfig: EmailConfig;
  onUpdateEmailConfig: (config: EmailConfig) => void;
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (config: StoreConfig) => void;
}

type TabType = 'orders' | 'products' | 'categories' | 'settings';

export function AdminPanel({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onBack,
  onLogout,
  user,
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  emailConfig,
  onUpdateEmailConfig,
  storeConfig,
  onUpdateStoreConfig
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  // Keep localOrders in sync when parent `orders` prop changes
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Fetch orders from backend
  const handleRefreshOrders = async () => {
    try {
      const base = (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === undefined)
        ? `${window.location.protocol}//${window.location.hostname}:5000`
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      const response = await fetch(`${base}/api/orders`);
      if (response.ok) {
        const data = await response.json();
        setLocalOrders(data);
        console.log('Orders refreshed from backend:', data);
      }
    } catch (error) {
      console.error('Failed to refresh orders:', error);
    }
  };

  // Fetch orders on mount and every 5 seconds
  useEffect(() => {
    handleRefreshOrders();
    const interval = setInterval(handleRefreshOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Ensure we refresh when the Orders tab becomes active (covers page reloads and tab switches)
  useEffect(() => {
    if (activeTab === 'orders') {
      handleRefreshOrders();
    }
  }, [activeTab]);

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white rounded-2xl p-12 shadow-2xl border border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageIcon className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders' as TabType, label: 'Orders', icon: PackageIcon, count: localOrders.length },
    { id: 'products' as TabType, label: 'Products', icon: PackageIcon, count: products.length },
    { id: 'categories' as TabType, label: 'Categories', icon: PackageIcon, count: categories.length },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings, count: null }
  ];

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-purple-100 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 dark:text-white" />
              </button>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your store</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</div>
                <div className="text-sm dark:text-white">{user.name}</div>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-all hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'orders' && (
          <OrdersTab orders={localOrders} onUpdateOrderStatus={onUpdateOrderStatus} onRefreshOrders={handleRefreshOrders} onDeleteOrder={onDeleteOrder} />
        )}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            categories={categories}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        )}
        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            onAddCategory={onAddCategory}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategory={onDeleteCategory}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            emailConfig={emailConfig}
            onUpdateEmailConfig={onUpdateEmailConfig}
            storeConfig={storeConfig}
            onUpdateStoreConfig={onUpdateStoreConfig}
          />
        )}
      </div>
    </div>
  );
}