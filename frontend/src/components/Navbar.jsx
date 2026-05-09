import { Link } from 'react-router-dom';
import { ShoppingBag, User, Package, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userNom = localStorage.getItem('userNom');
  const { getCartCount } = useCart();
  
  const isAdmin = userRole === 'ROLE_ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNom');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 5%',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
        HijabShop.
      </Link>
      
      <div style={{ display: 'flex', gap: '2rem', fontWeight: 500 }}>
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/shop" className="nav-link">Boutique</Link>
        <Link to="/recommendation" className="nav-link">Color Analysis</Link>
        {token && (
          <Link to="/orders" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Package size={16} /> Mes Commandes
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)' }}>
            <Shield size={16} /> Admin
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-color)', alignItems: 'center' }}>
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.8 }}>{userNom}</span>
            <span onClick={handleLogout} style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#c0392b' }}>Déconnexion</span>
          </div>
        ) : (
          <Link to="/auth" style={{ display: 'flex', alignItems: 'center' }}>
            <User style={{ cursor: 'pointer' }} />
          </Link>
        )}
        
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <ShoppingBag style={{ cursor: 'pointer' }} />
          {getCartCount() > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--primary-color)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {getCartCount()}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

