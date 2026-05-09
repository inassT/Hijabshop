import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  
  // --- Produits ---
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ nom: '', description: '', prix: '', couleur: '', image: '', stock: '' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [productMsg, setProductMsg] = useState('');

  // --- Commandes ---
  const [orders, setOrders] = useState([]);

  // --- Utilisateurs ---
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  // ===================== CHARGEMENT =====================
  useEffect(() => {
    loadProducts();
    loadOrders();
    loadUsers();
  }, []);

  const loadProducts = () => {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  };

  const loadOrders = () => {
    api.get('/orders/all').then(r => setOrders(r.data)).catch(console.error);
  };

  const loadUsers = () => {
    api.get('/users').then(r => setUsers(r.data)).catch(console.error);
  };

  // ===================== PRODUITS CRUD =====================
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProductMsg('');
    
    const payload = {
      ...productForm,
      prix: parseFloat(productForm.prix),
      stock: parseInt(productForm.stock)
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        setProductMsg('✅ Produit modifié avec succès !');
      } else {
        await api.post('/products', payload);
        setProductMsg('✅ Produit ajouté avec succès !');
      }
      resetProductForm();
      loadProducts();
    } catch (err) {
      setProductMsg('❌ Erreur: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      nom: product.nom,
      description: product.description || '',
      prix: product.prix.toString(),
      couleur: product.couleur,
      image: product.image || '',
      stock: product.stock.toString()
    });
    setProductMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProductMsg('🗑️ Produit supprimé.');
      loadProducts();
    } catch (err) {
      setProductMsg('❌ Erreur lors de la suppression.');
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({ nom: '', description: '', prix: '', couleur: '', image: '', stock: '' });
  };

  // ===================== STATUTS COMMANDES =====================
  const getStatusStyle = (statut) => {
    const styles = {
      'EN_ATTENTE': { background: '#fff3cd', color: '#856404' },
      'CONFIRMEE': { background: '#d4edda', color: '#155724' },
      'EXPEDIEE': { background: '#cce5ff', color: '#004085' },
      'LIVREE': { background: '#d1ecf1', color: '#0c5460' },
      'ANNULEE': { background: '#f8d7da', color: '#721c24' }
    };
    return styles[statut] || { background: '#e2e3e5', color: '#383d41' };
  };

  // ===================== TABS =====================
  const tabs = [
    { id: 'products', label: '📦 Produits', count: products.length },
    { id: 'orders', label: '🛒 Commandes', count: orders.length },
    { id: 'users', label: '👥 Utilisateurs', count: users.length }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard Admin</h2>
      <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Gérez vos produits, commandes et utilisateurs.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              background: activeTab === tab.id ? 'var(--primary-color)' : 'white',
              color: activeTab === tab.id ? 'white' : 'var(--text-color)',
              boxShadow: activeTab === tab.id ? '0 4px 15px rgba(212, 163, 115, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* ===================== TAB PRODUITS ===================== */}
      {activeTab === 'products' && (
        <div>
          {/* Formulaire ajout/modification */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              {editingProductId ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}
            </h3>

            {productMsg && (
              <div style={{
                padding: '0.8rem 1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                background: productMsg.includes('❌') ? '#f8d7da' : '#d4edda',
                color: productMsg.includes('❌') ? '#721c24' : '#155724',
                fontSize: '0.9rem'
              }}>
                {productMsg}
              </div>
            )}

            <form onSubmit={handleProductSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                className="input-premium"
                placeholder="Nom du produit"
                value={productForm.nom}
                onChange={e => setProductForm({ ...productForm, nom: e.target.value })}
                required
              />
              <input
                className="input-premium"
                placeholder="Couleur"
                value={productForm.couleur}
                onChange={e => setProductForm({ ...productForm, couleur: e.target.value })}
                required
              />
              <input
                className="input-premium"
                type="number"
                step="0.01"
                placeholder="Prix (€)"
                value={productForm.prix}
                onChange={e => setProductForm({ ...productForm, prix: e.target.value })}
                required
              />
              <input
                className="input-premium"
                type="number"
                placeholder="Stock"
                value={productForm.stock}
                onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                required
              />
              <input
                className="input-premium"
                placeholder="URL de l'image"
                value={productForm.image}
                onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                style={{ gridColumn: '1 / -1' }}
              />
              <textarea
                className="input-premium"
                placeholder="Description"
                rows={3}
                value={productForm.description}
                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                style={{ gridColumn: '1 / -1', resize: 'vertical' }}
              />
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'En cours...' : (editingProductId ? 'Modifier' : 'Ajouter')}
                </button>
                {editingProductId && (
                  <button type="button" onClick={resetProductForm} style={{
                    padding: '12px 24px', borderRadius: '30px', border: '2px solid #ddd',
                    background: 'white', cursor: 'pointer', fontWeight: 500
                  }}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Liste des produits */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <thead>
                <tr style={{ background: 'var(--secondary-color)' }}>
                  <th style={thStyle}>Image</th>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Prix</th>
                  <th style={thStyle}>Couleur</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={tdStyle}>
                      <img
                        src={product.image || 'https://via.placeholder.com/60'}
                        alt={product.nom}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{product.nom}</td>
                    <td style={tdStyle}>{product.prix}€</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--secondary-color)', fontSize: '0.85rem' }}>
                        {product.couleur}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: product.stock < 10 ? '#c0392b' : '#27ae60' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => editProduct(product)} style={actionBtnStyle}>✏️</button>
                        <button onClick={() => deleteProduct(product.id)} style={{ ...actionBtnStyle, color: '#c0392b' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB COMMANDES ===================== */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
              Aucune commande pour le moment.
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <strong>Commande #{order.id}</strong>
                    <span style={{ marginLeft: '1rem', fontSize: '0.85rem', opacity: 0.6 }}>
                      {order.date ? new Date(order.date).toLocaleDateString('fr-FR') : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                      ...getStatusStyle(order.statut)
                    }}>
                      {order.statut}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{order.total?.toFixed(2)}€</span>
                  </div>
                </div>
                {order.user && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                    👤 {order.user.nom} ({order.user.email})
                  </div>
                )}
                {order.items && order.items.length > 0 && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '2px 0' }}>
                        <span>{item.product?.nom || `Produit #${item.product?.id}`}</span>
                        <span style={{ opacity: 0.7 }}>x{item.quantite} — {item.prix?.toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ===================== TAB UTILISATEURS ===================== */}
      {activeTab === 'users' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <thead>
              <tr style={{ background: 'var(--secondary-color)' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}>{user.id}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{user.nom}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: user.role === 'ADMIN' ? '#ffeaa7' : 'var(--secondary-color)',
                      color: user.role === 'ADMIN' ? '#d68910' : 'var(--text-color)'
                    }}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles des tableaux
const thStyle = { padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' };
const tdStyle = { padding: '12px 16px', fontSize: '0.9rem' };
const actionBtnStyle = {
  background: 'none', border: '1px solid #eee', borderRadius: '8px',
  padding: '6px 10px', cursor: 'pointer', fontSize: '1rem',
  transition: 'all 0.2s ease'
};
