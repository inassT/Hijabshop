import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('Utilisateur non identifié.');
      setLoading(false);
      return;
    }

    api.get(`/orders/user/${userId}`)
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Erreur lors du chargement des commandes.');
        setLoading(false);
      });
  }, [userId]);

  const getStatusStyle = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return { background: '#fff3cd', color: '#856404' };
      case 'CONFIRMEE':
        return { background: '#d4edda', color: '#155724' };
      case 'EXPEDIEE':
        return { background: '#cce5ff', color: '#004085' };
      case 'LIVREE':
        return { background: '#d1ecf1', color: '#0c5460' };
      case 'ANNULEE':
        return { background: '#f8d7da', color: '#721c24' };
      default:
        return { background: '#e2e3e5', color: '#383d41' };
    }
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'EN_ATTENTE': '⏳ En attente',
      'CONFIRMEE': '✅ Confirmée',
      'EXPEDIEE': '🚚 Expédiée',
      'LIVREE': '📦 Livrée',
      'ANNULEE': '❌ Annulée'
    };
    return labels[statut] || statut;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Mes Commandes</h2>
      <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Suivez l'état de vos commandes en temps réel.</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>Chargement...</div>
      ) : error ? (
        <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: 0.8 }}>Vous n'avez aucune commande pour le moment.</p>
          <Link to="/shop">
            <button className="btn-primary">Découvrir nos collections</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '2rem' }}>
              {/* En-tête commande */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Commande #{order.id}</h3>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                    {order.date ? new Date(order.date).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Date inconnue'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    ...getStatusStyle(order.statut)
                  }}>
                    {getStatusLabel(order.statut)}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                    {order.total?.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Articles */}
              {order.items && order.items.length > 0 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0',
                      borderBottom: index < order.items.length - 1 ? '1px solid #f5f5f5' : 'none'
                    }}>
                      <span style={{ fontWeight: 500 }}>
                        {item.product?.nom || `Produit #${item.product?.id}`}
                      </span>
                      <span style={{ opacity: 0.7 }}>
                        x{item.quantite} — {item.prix?.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
