import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Charger le panier depuis le backend si l'utilisateur est connecté
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setTotalPrice(0);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get('/cart');
      // On mappe la structure du backend (items { product, quantity, id }) 
      // à la structure attendue par le frontend
      const items = response.data.items.map(item => ({
        ...item.product,
        cartItemId: item.id, // ID de l'item dans le panier
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
      alert("Veuillez vous connecter pour ajouter des articles au panier.");
      return;
    }
    
    try {
      await api.post(`/cart/add/${product.id}?quantity=1`);
      fetchCart(); // Rafraîchir après ajout
    } catch (err) {
      console.error("Erreur ajout panier:", err);
    }
  };

  const removeFromCart = async (productId) => {
    // Note: Dans le backend on utilise l'itemId du CartItem, pas le productId
    // On trouve l'item correspondant
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

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

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
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

