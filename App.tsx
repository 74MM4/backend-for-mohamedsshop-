import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { ShoppingCart } from './components/ShoppingCart';
import { UserSettings } from './components/UserSettings';
import { generateOrderConfirmationEmail } from './utils/emailTemplates';

// Resolve API URL dynamically so mobile devices that open the site
// will post to the same host serving the frontend (not their own localhost).
const API_URL =
  (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === undefined)
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

export interface Rating {
  userId: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  inStock: boolean;
  ratings: Rating[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'canceled';
  paymentMethod: 'cash' | 'pickup';
  deliveryAddress?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isAdmin: boolean;
}

export interface EmailConfig {
  email: string;
  appPassword: string;
}

export interface StoreConfig {
  address: string;
  ads: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    phone: string;
  };
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'keyboard', name: 'Keyboards', icon: '⌨️' },
  { id: 'mouse', name: 'Mice', icon: '🖱️' },
  { id: 'headset', name: 'Headsets', icon: '🎧' },
  { id: 'mousepad', name: 'Mousepads', icon: '📐' },
  { id: 'webcam', name: 'Webcams', icon: '📷' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Mechanical RGB Keyboard',
    category: 'keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjUxMDU2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Cherry MX switches with full RGB lighting',
    brand: 'ProGamer',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 4 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '2',
    name: 'Wireless Gaming Mouse',
    category: 'mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1628832307345-7404b47f1751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NjUwNDExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '16000 DPI sensor with wireless connectivity',
    brand: 'TechMaster',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }, { userId: 'demo3', rating: 4 }]
  },
  {
    id: '3',
    name: '7.1 Surround Gaming Headset',
    category: 'headset',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1677086813101-496781a0f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0fGVufDF8fHx8MTc2NTA0MTAyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Virtual 7.1 surround sound with noise cancellation',
    brand: 'AudioPro',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 5 }]
  },
  {
    id: '4',
    name: 'Extended Gaming Mousepad',
    category: 'mousepad',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1629429408708-3a59f51979c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXBhZHxlbnwxfHx8fDE3NjUxMjUzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'XXL size with RGB edge lighting',
    brand: 'ProGamer',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 4 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '5',
    name: 'HD Streaming Webcam',
    category: 'webcam',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1623949556303-b0d17d198863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW18ZW58MXx8fHwxNzY1MDE3OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '1080p 60fps with auto-focus',
    brand: 'StreamTech',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }]
  },
  {
    id: '6',
    name: 'Compact Gaming Keyboard',
    category: 'keyboard',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjUxMDU2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '60% layout with hot-swappable switches',
    brand: 'MiniTech',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 4 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '7',
    name: 'Ergonomic Gaming Mouse',
    category: 'mouse',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1628832307345-7404b47f1751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NjUwNDExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Comfortable design with 6 programmable buttons',
    brand: 'ComfortGrip',
    inStock: false,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 3 }, { userId: 'demo3', rating: 4 }]
  },
  {
    id: '8',
    name: 'Wireless Headset Pro',
    category: 'headset',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1677086813101-496781a0f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0fGVufDF8fHx8MTc2NTA0MTAyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Premium wireless audio with 30-hour battery',
    brand: 'AudioPro',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '9',
    name: 'RGB Gaming Headset',
    category: 'headset',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1677086813101-496781a0f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0fGVufDF8fHx8MTc2NTA0MTAyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Crystal clear sound with RGB lighting',
    brand: 'SoundMax',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 4 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '10',
    name: 'Ultra Precision Gaming Mouse',
    category: 'mouse',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1628832307345-7404b47f1751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NjUwNDExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Professional esports grade mouse with 25000 DPI',
    brand: 'ProGamer',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }]
  },
  {
    id: '11',
    name: 'Mechanical Keyboard RGB Pro',
    category: 'keyboard',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjUxMDU2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Custom switches with macro keys and programmable keys',
    brand: 'TechMaster',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }, { userId: 'demo3', rating: 4 }]
  },
  {
    id: '12',
    name: 'Large Gaming Mousepad',
    category: 'mousepad',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1629429408708-3a59f51979c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXBhZHxlbnwxfHx8fDE3NjUxMjUzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ultra-large mousepad with non-slip rubber base',
    brand: 'SurfacePro',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '13',
    name: '4K Streaming Webcam',
    category: 'webcam',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1623949556303-b0d17d198863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW18ZW58MXx8fHwxNzY1MDE3OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '4K 30fps professional streaming camera',
    brand: 'StreamTech',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }, { userId: 'demo3', rating: 4 }]
  },
  {
    id: '14',
    name: 'Portable USB Webcam',
    category: 'webcam',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1623949556303-b0d17d198863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW18ZW58MXx8fHwxNzY1MDE3OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '1080p portable webcam with clip mount',
    brand: 'PortableVision',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 4 }, { userId: 'demo3', rating: 4 }, { userId: 'demo4', rating: 5 }]
  },
  {
    id: '15',
    name: 'Ultra-thin Gaming Keyboard',
    category: 'keyboard',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjUxMDU2ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Slim profile with ultra-responsive keys',
    brand: 'SlimTech',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 5 }]
  },
  {
    id: '16',
    name: 'Portable Gaming Mouse',
    category: 'mouse',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1628832307345-7404b47f1751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NjUwNDExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Compact and lightweight for travel gaming',
    brand: 'TravelGear',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 4 }, { userId: 'demo2', rating: 4 }, { userId: 'demo3', rating: 5 }]
  },
  {
    id: '17',
    name: 'Professional Gaming Mousepad',
    category: 'mousepad',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1629429408708-3a59f51979c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXBhZHxlbnwxfHx8fDE3NjUxMjUzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Pro esports mousepad with speed surface',
    brand: 'ProSurface',
    inStock: true,
    ratings: [{ userId: 'demo1', rating: 5 }, { userId: 'demo2', rating: 5 }]
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({ email: '', appPassword: '' });
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    address: '*** Store Address ***',
    ads: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200',
      'https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=1200'
    ],
    socialMedia: {
      facebook: 'https://facebook.com/yourstore',
      instagram: 'https://instagram.com/yourstore',
      twitter: 'https://twitter.com/yourstore',
      phone: '+216 12 345 678'
    }
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Fetch orders from backend on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          console.log('Orders fetched from backend:', data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Poll orders every 5 seconds to keep UI in sync when orders are created from other devices
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/orders`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error('Polling orders failed:', e);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products, categories and config from backend (if any)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = API_URL;
        const [prodRes, catRes, cfgRes] = await Promise.all([
          fetch(`${base}/products`),
          fetch(`${base}/categories`),
          fetch(`${base}/config`)
        ]);

        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods)) setProducts(prods);
        }
        if (catRes.ok) {
          const cats = await catRes.json();
          if (Array.isArray(cats)) setCategories(cats);
        }
        if (cfgRes.ok) {
          const cfg = await cfgRes.json();
          if (cfg.emailConfig) setEmailConfig(cfg.emailConfig);
          if (cfg.storeConfig) setStoreConfig(cfg.storeConfig);
        }
      } catch (e) {
        console.error('Failed to fetch persisted data:', e);
      }
    };
    fetchData();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const newCart = existingItem
        ? prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      } else {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        alert('Order deleted successfully');
      } else {
        console.error('Failed to delete order on server');
        alert('Failed to delete order');
      }
    } catch (e) {
      console.error('Failed to delete order:', e);
      alert('Error deleting order: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const placeOrder = async (paymentMethod: 'cash' | 'pickup', deliveryAddress?: string) => {
    if (!user || cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.email,
      userName: user.name,
      userPhone: user.phone,
      items: [...cart],
      total,
      date: new Date().toISOString(),
      status: 'pending',
      paymentMethod,
      deliveryAddress
    };

    try {
      // Send order to backend API
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        setOrders(prev => [...prev, newOrder]);
        setCart([]);
        setIsCartOpen(false);

        // Send order confirmation email
        sendOrderConfirmationEmail(newOrder);
        
        alert('Order placed successfully!');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // Fallback: save locally if backend fails
      setOrders(prev => [...prev, newOrder]);
      setCart([]);
      setIsCartOpen(false);
      sendOrderConfirmationEmail(newOrder);
      alert('Order placed! (saved locally)');
    }
  };

  const sendOrderConfirmationEmail = (order: Order) => {
    const emailHtml = generateOrderConfirmationEmail(order, 'GamerGear');
    
    console.log('='.repeat(80));
    console.log('ORDER CONFIRMATION EMAIL');
    console.log('='.repeat(80));
    console.log('To:', order.userId);
    console.log('Subject: Order Confirmation - ' + order.id);
    console.log('='.repeat(80));

    // Send order confirmation email via backend
    if (emailConfig.email && emailConfig.appPassword) {
      fetch(`${API_URL}/send-order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order,
          appPassword: emailConfig.appPassword,
          senderEmail: emailConfig.email
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('✓ Order confirmation email sent successfully!');
          console.log('Response:', data);
        })
        .catch(error => {
          console.error('Failed to send order confirmation email:', error);
        });
    } else {
      console.warn('Email credentials not configured. Order confirmation email not sent.');
    }
  };

  const handleLogin = (email: string, password: string, name: string, phone: string, dateOfBirth: string) => {
    // Validate credentials against backend
    fetch(`${API_URL}/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid && data.user) {
          setUser(data.user);
          setIsLoginOpen(false);
          if (data.user.isAdmin) {
            setCurrentPage('admin');
          }
        } else {
          alert('Invalid email or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Login validation failed:', error);
        alert('Login failed. Please try again.');
      });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };


  const addProduct = (product: Product) => {
    setProducts(prev => {
      const next = [...prev, product];
      const base = API_URL;
      fetch(`${base}/products`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save products:', e));
      return next;
    });
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const next = prev.map(product => product.id === productId ? { ...product, ...updates } : product);
      const base = API_URL;
      fetch(`${base}/products`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save products:', e));
      return next;
    });
  };

  const rateProduct = (productId: string, rating: number) => {
    if (!user) {
      alert('Please login to rate products');
      return;
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      console.error('Invalid rating:', rating);
      return;
    }
    
    setProducts(prev => {
      const updated = prev.map(product => {
        if (product.id === productId) {
          // Check if user already rated this product - ONLY ONE RATING PER USER
          const existingRatingIndex = product.ratings.findIndex(r => r.userId === user.email);
          
          let updatedRatings;
          if (existingRatingIndex !== -1) {
            // Update existing rating
            updatedRatings = [...product.ratings];
            updatedRatings[existingRatingIndex] = { userId: user.email, rating };
          } else {
            // Add new rating (only one per user)
            updatedRatings = [...product.ratings, { userId: user.email, rating }];
          }
          return { ...product, ratings: updatedRatings };
        }
        return product;
      });

      // Save to backend
      const base = API_URL;
      fetch(`${base}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(e => console.error('Failed to save ratings:', e));

      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const next = prev.filter(product => product.id !== productId);
      const base = API_URL;
      fetch(`${base}/products`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save products:', e));
      return next;
    });
  };

  const addCategory = (category: Category) => {
    setCategories(prev => {
      const next = [...prev, category];
      const base = API_URL;
      fetch(`${base}/categories`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save categories:', e));
      return next;
    });
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories(prev => {
      const next = prev.map(category => category.id === categoryId ? { ...category, ...updates } : category);
      const base = API_URL;
      fetch(`${base}/categories`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save categories:', e));
      return next;
    });
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => {
      const next = prev.filter(category => category.id !== categoryId);
      const base = API_URL.replace(/\/api$/, '');
      fetch(`${base}/categories`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save categories:', e));
      return next;
    });
    // Also update products that use this category
    setProducts(prev => {
      const next = prev.map(product => product.category === categoryId ? { ...product, category: 'other' } : product);
      const base = API_URL.replace(/\/api$/, '');
      fetch(`${base}/products`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next)
      }).catch(e => console.error('Failed to save products:', e));
      return next;
    });
  };

  // Persist config changes
  useEffect(() => {
    const cfg = { emailConfig, storeConfig };
    const base = API_URL;
    console.log('[App] persisting config to', `${base}/config`, 'ads:', storeConfig.ads.length);
    fetch(`${base}/config`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg)
    })
      .then(res => {
        console.log('[App] config PUT response status:', res.status);
        return res.json().catch(() => ({}));
      })
      .then(body => console.log('[App] config PUT response body:', body))
      .catch(e => console.error('[App] Failed to save config:', e));
  }, [emailConfig, storeConfig]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50'}>
        {showSettings ? (
          <UserSettings
            user={user}
            orders={orders}
            onBack={() => setShowSettings(false)}
            onUpdateUser={setUser}
          />
        ) : currentPage === 'home' ? (
          <HomePage
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            user={user}
            onLogout={handleLogout}
            onAddToCart={addToCart}
            cartItemCount={cartItemCount}
            products={products}
            categories={categories}
            onGoToAdmin={() => setCurrentPage('admin')}
            storeConfig={storeConfig}
            onRateProduct={rateProduct}
            onOpenSettings={() => setShowSettings(true)}
            theme={theme}
            onThemeChange={setTheme}
          />
        ) : (
          <AdminPanel
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
            onBack={() => setCurrentPage('home')}
            onLogout={handleLogout}
            user={user}
            products={products}
            categories={categories}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onDeleteOrder={deleteOrder}
            emailConfig={emailConfig}
            onUpdateEmailConfig={setEmailConfig}
            storeConfig={storeConfig}
            onUpdateStoreConfig={setStoreConfig}
          />
        )}

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
          emailConfig={emailConfig}
        />

        <ShoppingCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onPlaceOrder={placeOrder}
          user={user}
          storeAddress={storeConfig.address}
        />
      </div>
    </div>
  );
}