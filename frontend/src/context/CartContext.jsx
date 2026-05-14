import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setTotalPrice(0);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get('/cart');
      const items = response.data.items.map(item => ({
        ...item.product,
        cartItemId: item.id,
        quantity: item.quantity
      }));
      setCartItems(items);
      setTotalPrice(response.data.totalPrice);
    } catch (err) {
      console.error("Erreur lors du chargement du panier:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (product) => {
    if (!token) {
      setNotification({ 
        show: true, 
        message: "Veuillez vous connecter pour ajouter des articles au panier.", 
        type: 'error' 
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
      return;
    }
    
    try {
      await api.post(`/cart/add/${product.id}?quantity=1`);
      setNotification({ 
        show: true, 
        message: `${product.nom} ajouté au panier !`, 
        type: 'success' 
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
      fetchCart();
    } catch (err) {
      console.error("Erreur ajout panier:", err);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item || !item.cartItemId) return;

    try {
      await api.delete(`/cart/remove/${item.cartItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Erreur suppression panier:", err);
    }
  };

  const updateQuantity = async (productId, amount) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item || !item.cartItemId) return;

    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      await api.put(`/cart/update/${item.cartItemId}?quantity=${newQuantity}`);
      fetchCart();
    } catch (err) {
      console.error("Erreur modification quantité:", err);
    }
  };

  const clearCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      await api.delete('/cart/clear');
      fetchCart();
    } catch (err) {
      console.error("Erreur vidage panier:", err);
    }
  };

  const getCartTotal = () => totalPrice;
  const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      fetchCart
    }}>
      {children}

      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-6"
          >
            <div className={`p-5 rounded-[2.5rem] shadow-premium backdrop-blur-xl border flex items-center gap-4 ${
              notification.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-100 text-emerald-700' 
                : 'bg-white/95 border-pastelPink/30 text-darkText shadow-2xl'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-babyPink text-white shadow-lg shadow-babyPink/20'
              }`}>
                {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              
              <div className="flex-grow">
                <p className="text-sm font-black leading-tight tracking-tight">
                  {notification.message}
                </p>
              </div>

              <button 
                onClick={() => setNotification({ ...notification, show: false })}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={18} className="opacity-30" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

