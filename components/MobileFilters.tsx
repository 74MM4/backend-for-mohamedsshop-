import { X, SlidersHorizontal } from 'lucide-react';
import { Category } from '../App';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showInStockOnly: boolean;
  onStockChange: (inStockOnly: boolean) => void;
}

export function MobileFilters({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showInStockOnly,
  onStockChange
}: MobileFiltersProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden animate-fadeIn">
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slideUp border-t border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg dark:text-white">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6 dark:text-white">
          {/* Categories */}
          <div>
            <h4 className="mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200'
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="mb-3">Price Range</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{priceRange[0]} TND</span>
                <span>{priceRange[1]} TND</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Min Price</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Max Price</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <h4 className="mb-3">Availability</h4>
            <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => onStockChange(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-600 cursor-pointer dark:accent-purple-600"
              />
              <span className="dark:text-gray-200">In Stock Only</span>
            </label>
          </div>

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
