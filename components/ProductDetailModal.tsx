import { useState } from 'react';
import { X, ShoppingCart, Star, Package } from 'lucide-react';
import { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRateProduct: (productId: string, rating: number) => void;
  user: { name: string; email: string; isAdmin: boolean } | null;
}

export function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onRateProduct, 
  user 
}: ProductDetailModalProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const averageRating = product.ratings.length > 0
    ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
    : 0;

  // Find user's current rating for this product
  const userRating = user 
    ? product.ratings.find(r => r.userId === user.email)?.rating || 0
    : 0;

  const handleRate = (rating: number) => {
    if (!user) {
      alert('Please login to rate products');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Please select a valid rating (1-5 stars)');
      return;
    }
    onRateProduct(product.id, rating);
    alert(userRating ? `Rating updated to ${rating} star${rating !== 1 ? 's' : ''}!` : `Thank you for rating! You gave ${rating} star${rating !== 1 ? 's' : ''}!`);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    alert('Added to cart!');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-850 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Rating Display */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-purple-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm dark:text-gray-300">Average Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg dark:text-white">
                      {averageRating.toFixed(1)} ({product.ratings.length})
                    </span>
                  </div>
                </div>

                {/* User Rating */}
                {user && (
                  <div className="border-t border-purple-200 dark:border-gray-600 pt-3 mt-3">
                    <p className="text-sm mb-3 dark:text-gray-300 font-semibold">
                      {userRating > 0 ? '⭐ Update your rating:' : '⭐ Rate this product:'}
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRate(rating)}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-all transform hover:scale-125 active:scale-95"
                          title={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-8 h-8 transition-all ${
                              rating <= (hoveredRating || userRating)
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                                : 'text-gray-300 dark:text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-3 flex items-center gap-1">
                        <span>✓</span>
                        <span>You rated this {userRating} star{userRating !== 1 ? 's' : ''} - Click to update</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-lg text-sm mb-3">
                  {product.brand}
                </div>
                <h2 className="text-3xl mb-2 dark:text-white">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {product.price.toFixed(2)} TND
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <Package className={`w-5 h-5 ${product.inStock ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Specifications */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
                <h3 className="mb-3 dark:text-white">Product Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Brand:</span>
                    <p className="dark:text-white">{product.brand}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="capitalize dark:text-white">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Ratings:</span>
                    <p className="dark:text-white">{product.ratings.length} reviews</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <p className="dark:text-white">{product.inStock ? 'Available' : 'Unavailable'}</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
