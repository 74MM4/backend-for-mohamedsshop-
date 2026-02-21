import { useState } from 'react';
import { Search, ShoppingCart, User, LogOut, Sparkles, Settings, SlidersHorizontal, Moon, Sun } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { Product, Category, StoreConfig, User as UserType } from '../App';
import { ImageCarousel } from './ImageCarousel';
import { Footer } from './Footer';
import { ProductDetailModal } from './ProductDetailModal';
import { MobileFilters } from './MobileFilters';

interface HomePageProps {
  onOpenLogin: () => void;
  onOpenCart: () => void;
  user: UserType | null;
  onLogout: () => void;
  onAddToCart: (product: Product) => void;
  cartItemCount: number;
  products: Product[];
  categories: Category[];
  onGoToAdmin: () => void;
  storeConfig: StoreConfig;
  onRateProduct: (productId: string, rating: number) => void;
  onOpenSettings?: () => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export function HomePage({ 
  onOpenLogin, 
  onOpenCart, 
  user, 
  onLogout, 
  onAddToCart, 
  cartItemCount, 
  products, 
  categories, 
  onGoToAdmin,
  storeConfig,
  onRateProduct,
  onOpenSettings,
  theme = 'light',
  onThemeChange
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !showInStockOnly || product.inStock;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const displayCategories = [
    { id: 'all', name: 'All Products', icon: '🎮' },
    ...categories
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg z-40 border-b border-purple-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-purple-600" />
              <h1 className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                HAMMA'S SHOP
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Filter Button - Only visible on mobile */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden relative p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95 dark:shadow-lg dark:shadow-purple-900/50"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>

              <button
                onClick={() => onThemeChange?.(theme === 'light' ? 'dark' : 'light')}
                className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-gray-700"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={onOpenCart}
                className="relative p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 dark:shadow-lg dark:shadow-purple-900/50"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  {user.isAdmin && (
                    <button
                      onClick={onGoToAdmin}
                      className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden lg:inline">Admin Panel</span>
                    </button>
                  )}
                  <button
                    onClick={onOpenSettings}
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-200 dark:border-gray-600 hover:bg-purple-100 dark:hover:bg-gray-600 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Settings</span>
                  </button>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-gray-700 rounded-xl border border-purple-200 dark:border-gray-600">
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-purple-900 dark:text-gray-200 max-w-[120px] truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for gaming gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-base md:text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-6 md:gap-8">
          {/* Desktop Sidebar Filters - Hidden on mobile */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
                <h3 className="mb-4 text-gray-900 dark:text-white font-semibold">Categories</h3>
                <div className="space-y-2">
                  {displayCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                          : 'bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
                <h3 className="mb-4 text-gray-900 dark:text-white font-semibold">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{priceRange[0]} TND</span>
                    <span>{priceRange[1]} TND</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600 focus:ring-purple-600 cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Image Carousel */}
            <div className="mb-6 md:mb-8">
              <ImageCarousel images={storeConfig.ads} />
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl mb-2">
                {selectedCategory === 'all' ? 'All Products' : displayCategories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>

            <ProductGrid 
              products={filteredProducts} 
              onAddToCart={onAddToCart} 
              onRateProduct={onRateProduct}
              user={user}
              onProductClick={setSelectedProduct}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={displayCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        showInStockOnly={showInStockOnly}
        onStockChange={setShowInStockOnly}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          onRateProduct={onRateProduct}
          user={user}
        />
      )}

      {/* Footer */}
      <Footer storeConfig={storeConfig} />
    </div>
  );
}