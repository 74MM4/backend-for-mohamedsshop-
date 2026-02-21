import { ShoppingCart, Package, Star } from 'lucide-react';
import { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRateProduct: (productId: string, rating: number) => void;
  user: { name: string; email: string; isAdmin: boolean } | null;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart, onRateProduct, user, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl mb-2 dark:text-white">No products found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
      </div>
    );
  }

  const calculateAverageRating = (ratings: Array<{ userId: string; rating: number }>) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => {
      // Handle both number and string ratings
      const rating = typeof r.rating === 'number' ? r.rating : parseInt(String(r.rating), 10);
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0);
    const avg = sum / ratings.length;
    return isNaN(avg) ? 0 : Math.round(avg * 10) / 10; // Round to 1 decimal place
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map(product => {
        const avgRating = calculateAverageRating(product.ratings);
        
        return (
          <div
            key={product.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 border border-purple-100 dark:border-gray-700 flex flex-col cursor-pointer active:scale-95"
            onClick={() => onProductClick(product)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden group">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm md:text-base">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Rating Badge */}
              {product.ratings.length > 0 && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs md:text-sm dark:text-white">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="p-3 md:p-4 flex-1 flex flex-col">
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-lg">
                  {product.brand}
                </span>
              </div>
              <h3 className="mb-2 line-clamp-2 min-h-[3rem] text-sm md:text-base dark:text-white">{product.name}</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
                {product.description}
              </p>

              {/* Rating Stars Display - Clickable */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        alert('Please login to rate products');
                        return;
                      }
                      onRateProduct(product.id, star);
                    }}
                    className="hover:scale-125 transition-transform active:scale-95 cursor-pointer"
                    title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-3 h-3 md:w-4 md:h-4 transition-all ${
                        star <= Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  ({product.ratings.length})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {product.price.toFixed(2)} TND
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  disabled={!product.inStock}
                  className="p-2 md:p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}