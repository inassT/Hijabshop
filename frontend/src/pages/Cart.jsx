import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleCheckout = async () => {
    if (!token) {
      setError('Veuillez vous connecter pour valider la commande.');
      return;
    }

    setLoading(true);
    setError('');

    // Création de l'objet Order correspondant à ce que le Backend attend
    // Attention, le Backend s'attend à: { items: [ { product: {id}, quantity, price }, ... ], totalAmount }
    const orderData = {
      totalAmount: getCartTotal(),
      status: 'PENDING',
      items: cartItems.map(item => ({
        product: { id: item.id },
        quantity: item.quantity,
        price: item.prix
      }))
    };

    try {
      await api.post('/orders', orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la validation de la commande.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="animate-fade-in" style={{ padding: '5rem 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Merci pour votre commande !</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Votre commande a été validée avec succès.</p>
        <Link to="/shop">
          <button className="btn-primary">Retour à la boutique</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Mon Panier</h2>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: '#f8d7da', color: '#721c24' }}>
          {error} {!token && <Link to="/auth" style={{ textDecoration: 'underline' }}>Se connecter</Link>}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Votre panier est vide.</p>
          <Link to="/shop">
            <button className="btn-primary">Découvrir nos collections</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Liste des articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map(item => (
              <div key={item.id} className="glass-panel" style={{ display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'center' }}>
                <img 
                  src={item.image || `https://images.unsplash.com/photo-1621072156002-e2fcc60b4ef3?w=150&q=80`} 
                  alt={item.nom} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.nom}</h3>
                  <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{item.prix}€</p>
                </div>
                
                {/* Contrôles quantité */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd' }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd' }}>+</button>
                </div>

                <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Résumé</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Sous-total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span>Livraison</span>
              <span style={{ color: 'var(--primary-color)' }}>Gratuite</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '2rem' }}>
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>

            <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Validation en cours...' : 'Valider la commande'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
