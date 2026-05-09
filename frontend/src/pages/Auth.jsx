import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', nom: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Mode Connexion
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        const data = response.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userNom', data.nom);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);
        navigate('/shop');
        window.location.reload();
        
      } else {
        // Mode Inscription
        await api.post('/auth/register', formData);
        // Après l'inscription, on bascule sur la connexion
        setIsLogin(true);
        setError('Inscription réussie ! Veuillez vous connecter.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </h2>
        
        {error && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: error.includes('réussie') ? '#d4edda' : '#f8d7da', color: error.includes('réussie') ? '#155724' : '#721c24' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <input
              type="text"
              name="nom"
              placeholder="Nom complet"
              className="input-premium"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-premium"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="input-premium"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
          {isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?'}{' '}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? "S'inscrire" : 'Se connecter'}
          </span>
        </p>
      </div>
    </div>
  );
}
