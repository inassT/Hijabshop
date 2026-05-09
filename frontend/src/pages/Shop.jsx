import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Filtres
  const [searchNom, setSearchNom] = useState('');
  const [filterCouleur, setFilterCouleur] = useState('');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');

  // Avis (modal)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const couleurs = ['Blanc', 'Noir', 'Bleu', 'Rose', 'Vert', 'Beige', 'Gris', 'Violet', 'Orange'];

  // ===================== CHARGEMENT PRODUITS =====================
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur de récupération des produits:", error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchNom) params.append('nom', searchNom);
    if (filterCouleur) params.append('couleur', filterCouleur);
    if (prixMin) params.append('prixMin', prixMin);
    if (prixMax) params.append('prixMax', prixMax);

    api.get(`/products/search?${params.toString()}`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur de recherche:", error);
        setLoading(false);
      });
  };

  const resetFilters = () => {
    setSearchNom('');
    setFilterCouleur('');
    setPrixMin('');
    setPrixMax('');
    loadProducts();
  };

  // ===================== AVIS =====================
  const openReviews = async (product) => {
    setSelectedProduct(product);
    setReviewMsg('');
    setReviewForm({ note: 5, commentaire: '' });
    setReviewLoading(true);
    try {
      const response = await api.get(`/reviews/product/${product.id}`);
      setReviews(response.data);
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const closeReviews = () => {
    setSelectedProduct(null);
    setReviews([]);
    setReviewMsg('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token || !userId) {
      setReviewMsg('❌ Connectez-vous pour laisser un avis.');
      return;
    }
    try {
      await api.post('/reviews', {
        user: { id: parseInt(userId) },
        product: { id: selectedProduct.id },
        note: reviewForm.note,
        commentaire: reviewForm.commentaire
      });
      setReviewMsg('✅ Avis ajouté !');
      setReviewForm({ note: 5, commentaire: '' });
      // Recharger les avis
      const response = await api.get(`/reviews/product/${selectedProduct.id}`);
      setReviews(response.data);
    } catch (err) {
      setReviewMsg('❌ Erreur lors de l\'ajout de l\'avis.');
    }
  };

  const renderStars = (note) => {
    return '★'.repeat(note) + '☆'.repeat(5 - note);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 5%' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Notre Collection</h2>
      <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '2rem' }}>Des hijabs conçus pour toutes les occasions, avec des tissus de haute qualité.</p>

      {/* ===================== BARRE DE FILTRES ===================== */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Recherche par nom */}
          <div style={{ flex: '2', minWidth: '200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px', opacity: 0.7 }}>Rechercher</label>
            <input
              className="input-premium"
              placeholder="Nom du produit..."
              value={searchNom}
              onChange={e => setSearchNom(e.target.value)}
            />
          </div>

          {/* Filtre couleur */}
          <div style={{ flex: '1', minWidth: '140px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px', opacity: 0.7 }}>Couleur</label>
            <select
              className="input-premium"
              value={filterCouleur}
              onChange={e => setFilterCouleur(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Toutes</option>
              {couleurs.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Prix min */}
          <div style={{ flex: '1', minWidth: '100px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px', opacity: 0.7 }}>Prix min (€)</label>
            <input
              className="input-premium"
              type="number"
              placeholder="0"
              value={prixMin}
              onChange={e => setPrixMin(e.target.value)}
            />
          </div>

          {/* Prix max */}
          <div style={{ flex: '1', minWidth: '100px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px', opacity: 0.7 }}>Prix max (€)</label>
            <input
              className="input-premium"
              type="number"
              placeholder="100"
              value={prixMax}
              onChange={e => setPrixMax(e.target.value)}
            />
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSearch} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              🔍 Rechercher
            </button>
            <button onClick={resetFilters} style={{
              padding: '12px 18px', borderRadius: '30px', border: '2px solid #ddd',
              background: 'white', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap'
            }}>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* ===================== GRILLE PRODUITS ===================== */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>Chargement des produits...</div>
      ) : (
        <div className="product-grid">
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Aucun produit trouvé.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <img 
                  src={product.image || `https://images.unsplash.com/photo-1621072156002-e2fcc60b4ef3?w=500&q=80`} 
                  alt={product.nom} 
                  className="product-image"
                />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{product.nom}</h3>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.1rem' }}>{product.prix}€</span>
                  </div>
                  <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', background: 'var(--secondary-color)', padding: '4px 10px', borderRadius: '20px' }}>
                      {product.couleur}
                    </span>
                    <span style={{
                      fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px',
                      background: product.stock > 0 ? '#d4edda' : '#f8d7da',
                      color: product.stock > 0 ? '#155724' : '#721c24'
                    }}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => addToCart(product)}
                      className="btn-primary"
                      style={{ flex: 1 }}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                    </button>
                    <button
                      onClick={() => openReviews(product)}
                      style={{
                        padding: '12px 16px', borderRadius: '30px', border: '2px solid var(--primary-color)',
                        background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer',
                        fontWeight: 500, transition: 'all 0.3s ease', whiteSpace: 'nowrap'
                      }}
                    >
                      ⭐ Avis
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===================== MODAL AVIS ===================== */}
      {selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '2rem'
        }} onClick={closeReviews}>
          <div
            className="glass-panel animate-fade-in"
            style={{
              background: 'white', width: '100%', maxWidth: '600px',
              maxHeight: '80vh', overflowY: 'auto', padding: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Avis — {selectedProduct.nom}</h3>
              <button onClick={closeReviews} style={{
                background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.5
              }}>✕</button>
            </div>

            {/* Liste des avis */}
            {reviewLoading ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</p>
            ) : reviews.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.6 }}>Aucun avis pour ce produit.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {reviews.map((review, i) => (
                  <div key={i} style={{ padding: '1rem', background: '#fafafa', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {review.user?.nom || 'Utilisateur'}
                      </span>
                      <span style={{ color: '#f39c12', fontSize: '0.9rem' }}>
                        {renderStars(review.note)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{review.commentaire}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire ajout d'avis */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Laisser un avis</h4>

              {reviewMsg && (
                <div style={{
                  padding: '0.6rem 1rem', marginBottom: '1rem', borderRadius: '8px', fontSize: '0.9rem',
                  background: reviewMsg.includes('❌') ? '#f8d7da' : '#d4edda',
                  color: reviewMsg.includes('❌') ? '#721c24' : '#155724'
                }}>
                  {reviewMsg}
                </div>
              )}

              {token ? (
                <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Note</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, note: n })}
                          style={{
                            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
                            color: n <= reviewForm.note ? '#f39c12' : '#ddd',
                            transition: 'color 0.2s'
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="input-premium"
                    placeholder="Votre commentaire..."
                    rows={3}
                    value={reviewForm.commentaire}
                    onChange={e => setReviewForm({ ...reviewForm, commentaire: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                  <button type="submit" className="btn-primary">Publier mon avis</button>
                </form>
              ) : (
                <p style={{ opacity: 0.6, textAlign: 'center' }}>
                  <a href="/auth" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Connectez-vous</a> pour laisser un avis.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
