import { useState } from 'react';
import api from '../api/axiosConfig';

export default function Recommendation() {
  const [teint, setTeint] = useState('');
  const [sousTon, setSousTon] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const teints = ['Clair', 'Moyen', 'Mat', 'Foncé'];
  const sousTons = ['Froid', 'Chaud', 'Neutre'];

  const getRecommendations = async () => {
    if (!teint || !sousTon) {
      setError('Veuillez sélectionner un teint et un sous-ton.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/recommendation', {
        teint: teint.toLowerCase(),
        sousTon: sousTon.toLowerCase()
      });
      setRecommendations(response.data);
    } catch (err) {
      setError('Erreur lors de la récupération des recommandations.');
    } finally {
      setLoading(false);
    }
  };

  const getColorHex = (colorName) => {
    const map = {
      'bleu': '#4169E1', 'rose': '#FFB6C1', 'gris': '#808080',
      'vert': '#2E8B57', 'rouge': '#B22222', 'marron': '#8B4513',
      'beige': '#F5F5DC', 'blanc': '#FFFFFF', 'noir': '#000000',
      'orange': '#FF8C00', 'jaune': '#FFD700'
    };
    return map[colorName.toLowerCase()] || '#CCCCCC';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Color Analysis</h2>
      <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '3rem', maxWidth: '600px' }}>
        Trouvez les couleurs de hijabs qui subliment naturellement votre visage grâce à notre algorithme basé sur la colorimétrie.
      </p>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Teint Selection */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>1. Quel est votre teint ?</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {teints.map(t => (
              <button 
                key={t}
                onClick={() => setTeint(t)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: `2px solid ${teint === t ? 'var(--primary-color)' : '#eee'}`,
                  background: teint === t ? 'rgba(212, 163, 115, 0.1)' : 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sous-ton Selection */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>2. Quel est votre sous-ton ?</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {sousTons.map(s => (
              <button 
                key={s}
                onClick={() => setSousTon(s)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: `2px solid ${sousTon === s ? 'var(--primary-color)' : '#eee'}`,
                  background: sousTon === s ? 'rgba(212, 163, 115, 0.1)' : 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#721c24' }}>{error}</p>}

        <button onClick={getRecommendations} className="btn-primary" style={{ alignSelf: 'center', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Analyse en cours...' : 'Découvrir ma palette'}
        </button>

        {/* Résultats */}
        {recommendations.length > 0 && (
          <div className="animate-fade-in" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Vos Couleurs Idéales</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {recommendations.map(color => (
                <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '60px', height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: getColorHex(color),
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}></div>
                  <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
