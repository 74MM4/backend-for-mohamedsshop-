import { useState } from 'react';
import { X, Plus, Minus, Trash2, CreditCard, Store } from 'lucide-react';
import { CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (paymentMethod: 'cash' | 'pickup', deliveryAddress?: string) => void;
  user: { name: string; email: string; isAdmin: boolean } | null;
  storeAddress: string;
}

export function ShoppingCart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  user,
  storeAddress
}: ShoppingCartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'pickup'>('cash');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = paymentMethod === 'cash' ? 9 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (paymentMethod === 'cash' && !deliveryAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    onPlaceOrder(paymentMethod, paymentMethod === 'cash' ? deliveryAddress : undefined);
    setShowCheckout(false);
    setDeliveryAddress('');
    setPaymentMethod('cash');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:bg-gray-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 shadow-md">
          <div className="text-white">
            <h2 className="text-2xl">{showCheckout ? 'Checkout' : 'Shopping Cart'}</h2>
            <p className="text-sm text-purple-100">
              {showCheckout ? 'Complete your order' : `${itemCount} items in cart`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showCheckout ? (
            // Cart Items
            <>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <X className="w-12 h-12 text-purple-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Add some awesome products to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-purple-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 bg-white dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-500">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 truncate font-medium dark:text-white text-gray-800">{item.name}</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-400 mb-3 font-semibold">{item.price.toFixed(2)} TND</p>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 border-2 border-purple-300 dark:border-gray-500 rounded-md hover:bg-purple-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
                          >
                            <Minus className="w-3 h-3 text-purple-600 dark:text-white" />
                          </button>
                          <span className="w-6 text-center font-medium dark:text-white text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 border-2 border-purple-300 dark:border-gray-500 rounded-md hover:bg-purple-100 dark:hover:bg-gray-500 transition-colors shadow-sm"
                          >
                            <Plus className="w-3 h-3 text-purple-600 dark:text-white" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg p-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Checkout Form
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 border border-purple-200 dark:border-gray-600 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-800 dark:text-white text-lg">Select Payment Method</h3>
                
                <div className="space-y-2">
                  <label className={`flex items-center gap-4 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cash' ? 'border-purple-600 bg-white dark:bg-gray-600 shadow-md' : 'border-purple-200 bg-white dark:bg-gray-600 dark:border-gray-500 hover:border-purple-400 dark:hover:border-purple-500'
                  }`}>
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                      className="text-purple-600 focus:ring-purple-600 dark:bg-gray-500 w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <div className="flex-1 dark:text-white text-gray-800">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Pay when you receive</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'pickup' ? 'border-purple-600 bg-white dark:bg-gray-600 shadow-md' : 'border-purple-200 bg-white dark:bg-gray-600 dark:border-gray-500 hover:border-purple-400 dark:hover:border-purple-500'
                  }`}>
                    <input
                      type="radio"
                      value="pickup"
                      checked={paymentMethod === 'pickup'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'pickup')}
                      className="text-purple-600 focus:ring-purple-600 dark:bg-gray-500 w-4 h-4"
                    />
                    <Store className="w-5 h-5 text-purple-600" />
                    <div className="flex-1 dark:text-white text-gray-800">
                      <div className="font-medium">Pick up at Store</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Collect from our store</div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">Delivery Address *</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white bg-white text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none shadow-sm"
                    rows={3}
                    placeholder="Enter your full delivery address..."
                    required
                  />
                </div>
              )}

              {paymentMethod === 'pickup' && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Store className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm mb-1 dark:text-gray-300">Store Location:</div>
                      <div className="text-sm text-gray-700 dark:text-gray-200">{storeAddress}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-purple-200 dark:border-gray-600 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span className="text-gray-600 dark:text-gray-400">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{(item.price * item.quantity).toFixed(2)} TND</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-purple-200 dark:border-gray-700 p-5 space-y-3 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 shadow-lg">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal:</span>
                <span className="font-medium">{subtotal.toFixed(2)} TND</span>
              </div>
              {paymentMethod === 'cash' && (
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 text-xs">
                  <span>Delivery Fee:</span>
                  <span className="font-medium">9.00 TND</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-lg dark:text-white font-semibold text-gray-800 border-t border-purple-200 dark:border-gray-600 pt-3">
              <span>Total:</span>
              <span className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">{total.toFixed(2)} TND</span>
            </div>
            
            {user ? (
              !showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back to Cart
                  </button>
                </div>
              )
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Please login to place an order</p>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Close Cart
                </button>
              </div>
            )}}
          </div>
        )}
      </div>
    </div>
  );
}