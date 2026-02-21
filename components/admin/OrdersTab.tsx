import React, { useEffect } from 'react';
import { Package, Clock, Truck, CircleCheck, Ban, CheckCircle, RefreshCw } from 'lucide-react';
import { Order } from '../../App';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onRefreshOrders?: () => void;
  onDeleteOrder?: (orderId: string) => void;
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'processing':
      return 'bg-blue-100 text-blue-700';
    case 'shipped':
      return 'bg-purple-100 text-purple-700';
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'completed':
      return 'bg-emerald-100 text-emerald-700';
    case 'canceled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'processing':
      return <Package className="w-4 h-4" />;
    case 'shipped':
      return <Truck className="w-4 h-4" />;
    case 'delivered':
      return <CircleCheck className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'canceled':
      return <Ban className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

export function OrdersTab({ orders, onUpdateOrderStatus, onRefreshOrders, onDeleteOrder }: OrdersTabProps) {
  const [refreshing, setRefreshing] = React.useState(false);

  // Auto-refresh orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (onRefreshOrders) {
        onRefreshOrders();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [onRefreshOrders]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    if (onRefreshOrders) {
      onRefreshOrders();
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  const sortedOrders = [...orders].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Stats
  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'from-purple-500 to-pink-500' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'from-yellow-500 to-orange-500' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Orders
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className={`text-4xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg">Order #{order.id}</h3>
                    {
                      (() => {
                        const statusKey = typeof order.status === 'string' && order.status ? order.status : 'unknown';
                        const label = typeof statusKey === 'string' ? (statusKey.charAt(0).toUpperCase() + statusKey.slice(1)) : String(statusKey);
                        return (
                          <span className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${getStatusColor(statusKey as any)}`}>
                            {getStatusIcon(statusKey as any)}
                            {label}
                          </span>
                        );
                      })()
                    }
                  </div>
                  <p className="text-sm text-gray-600">Customer: {order.userName}</p>
                  <p className="text-sm text-gray-600">Email: {order.userId}</p>
                  <p className="text-sm text-gray-600">Phone: {order.userPhone}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Pickup at Store'}
                  </p>
                  {order.deliveryAddress && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span>Delivery Address: {order.deliveryAddress}</span>
                    </p>
                  )}
                </div>

                <div className="text-right">
                  {(() => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const totalLabel = typeof order.total === 'number' ? order.total.toFixed(2) + ' TND' : '—';
                    return (
                      <>
                        <p className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {totalLabel}
                        </p>
                        <p className="text-sm text-gray-600">{items.length} items</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4 p-4 bg-gray-50 rounded-xl">
                {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item?.name || 'Item'} × {item?.quantity ?? 1}</span>
                    <span>{typeof item?.price === 'number' ? (item.price * (item.quantity ?? 1)).toFixed(2) + ' TND' : '—'}</span>
                  </div>
                ))}
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2">
                {order.status !== 'canceled' && order.status !== 'completed' && (
                  <>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'processing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
                      >
                        Mark Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                      >
                        Mark Shipped
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'canceled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDeleteOrder && onDeleteOrder(order.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors text-sm ml-2"
                >
                  Delete Order
                </button>
                {order.status === 'completed' && (
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm">
                    ✓ Order Completed
                  </span>
                )}
                {order.status === 'canceled' && (
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm">
                    ✗ Order Canceled
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}