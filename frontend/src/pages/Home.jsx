import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ padding: '0 5%' }}>
      <section style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        minHeight: '70vh',
        gap: '4rem'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '4rem', color: 'var(--text-color)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Trouvez la couleur <br/>
            qui révèle <span style={{ color: 'var(--primary-color)' }}>votre éclat</span>.
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2.5rem', maxWidth: '500px' }}>
            Découvrez notre collection de hijabs premium et utilisez notre intelligence de recommandation colorimétrique pour trouver les teintes qui subliment votre teint.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/shop">
              <button className="btn-primary">Voir la collection</button>
            </Link>
            <Link to="/recommendation">
              <button className="btn-primary" style={{ background: 'transparent', border: '2px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                Faire le test de couleur
              </button>
            </Link>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {/* Placeholder for hero image */}
          <div style={{
            width: '100%',
            height: '500px',
            background: 'linear-gradient(45deg, var(--secondary-color), var(--primary-color))',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            boxShadow: '0 20px 50px rgba(212, 163, 115, 0.2)'
          }}></div>
        </div>
      </section>
    </div>
  );
}
