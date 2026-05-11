import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag, X, Check, AlertCircle, Sparkles, Filter, ChevronDown, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Filtres
  const [searchNom, setSearchNom] = useState('');
  const [filterCouleur, setFilterCouleur] = useState('');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Avis (modal)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: '' });
  const [reviewMsg, setReviewMsg] = useState({ text: '', type: '' });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const couleurs = ['Blanc', 'Noir', 'Bleu', 'Rose', 'Vert', 'Beige', 'Gris', 'Violet', 'Orange'];

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
    setReviewMsg({ text: '', type: '' });
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
    setReviewMsg({ text: '', type: '' });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token || !userId) {
      setReviewMsg({ text: 'Connectez-vous pour laisser un avis.', type: 'error' });
      return;
    }
    try {
      await api.post('/reviews', {
        user: { id: parseInt(userId) },
        product: { id: selectedProduct.id },
        note: reviewForm.note,
        commentaire: reviewForm.commentaire
      });
      setReviewMsg({ text: 'Avis ajouté avec succès !', type: 'success' });
      setReviewForm({ note: 5, commentaire: '' });
      const response = await api.get(`/reviews/product/${selectedProduct.id}`);
      setReviews(response.data);
    } catch (err) {
      setReviewMsg({ text: 'Erreur lors de l\'ajout de l\'avis.', type: 'error' });
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-babyPink font-black uppercase tracking-[0.2em] text-xs mb-4"
            >
              <Sparkles size={16} />
              Collection Signature
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl font-black text-darkText leading-none tracking-tighter"
            >
              Découvrez Votre <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyPink to-pink-400">Nouvel Éclat.</span>
            </motion.h2>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="!rounded-2xl"
              icon={isFilterVisible ? ChevronDown : Filter}
            >
              Filtres
            </Button>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-darkText/30" size={18} />
              <input
                className="input-premium pl-12 py-3.5 !rounded-2xl w-full md:w-64"
                placeholder="Rechercher..."
                value={searchNom}
                onChange={e => setSearchNom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {isFilterVisible && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <Card glass className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-darkText/40 ml-2">Couleur</label>
                    <div className="flex flex-wrap gap-2">
                      {couleurs.map(c => (
                        <button
                          key={c}
                          onClick={() => setFilterCouleur(filterCouleur === c ? '' : c)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                            filterCouleur === c 
                              ? 'bg-babyPink border-babyPink text-white shadow-lg shadow-babyPink/20' 
                              : 'bg-white border-pastelPink/30 text-darkText/60 hover:border-babyPink'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-darkText/40 ml-2">Gamme de Prix (€)</label>
                    <div className="flex items-center gap-4">
                      <input
                        className="input-premium !py-3 !rounded-xl text-center"
                        type="number"
                        placeholder="Min"
                        value={prixMin}
                        onChange={e => setPrixMin(e.target.value)}
                      />
                      <span className="text-darkText/20 font-bold">à</span>
                      <input
                        className="input-premium !py-3 !rounded-xl text-center"
                        type="number"
                        placeholder="Max"
                        value={prixMax}
                        onChange={e => setPrixMax(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-end justify-end gap-4">
                    <Button variant="ghost" onClick={resetFilters} icon={RotateCcw}>
                      Réinitialiser
                    </Button>
                    <Button onClick={handleSearch} className="!px-8">
                      Appliquer
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-[3/4] bg-white/50 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60">
            <ShoppingBag size={64} className="mx-auto text-babyPink/20 mb-6" />
            <p className="text-2xl font-bold text-darkText/40">Aucune pépite trouvée ici...</p>
            <Button variant="ghost" onClick={resetFilters} className="mt-4">Voir tout le catalogue</Button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group relative h-[500px] flex flex-col bg-white overflow-hidden !rounded-[2.5rem]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={product.image || `https://images.unsplash.com/photo-1621072156002-e2fcc60b4ef3?w=500&q=80`} 
                      alt={product.nom} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    
                    {/* Quick Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge variant="user" className="!bg-white/90 backdrop-blur-sm">
                        {product.couleur}
                      </Badge>
                      {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="waiting" className="!bg-amber-500/90 !text-white !border-none">
                          Dernières pièces
                        </Badge>
                      )}
                      {product.stock <= 0 && (
                        <Badge variant="cancelled" className="!bg-red-500/90 !text-white !border-none">
                          Victime de son succès
                        </Badge>
                      )}
                    </div>

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-darkText/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <Button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="w-full !rounded-2xl shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                      >
                        {product.stock > 0 ? "Ajouter au Panier" : "Indisponible"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-darkText group-hover:text-babyPink transition-colors truncate pr-4">
                        {product.nom}
                      </h3>
                      <span className="text-2xl font-black text-darkText">{product.prix}€</span>
                    </div>
                    
                    <p className="text-sm text-darkText/40 mb-4 line-clamp-2 italic">
                      {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <button
                        onClick={() => openReviews(product)}
                        className="flex items-center gap-1.5 text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        <div className="flex">
                          {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                        <span className="text-xs font-black uppercase tracking-tighter">Avis Clients</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Reviews Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-darkText/40 backdrop-blur-md"
              onClick={closeReviews}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-pastelPink/20 flex justify-between items-center bg-gradient-to-b from-nudeBeige/30 to-transparent">
                <div>
                  <h3 className="text-3xl font-black text-darkText tracking-tighter">Avis & Expériences</h3>
                  <p className="text-babyPink font-bold mt-1 uppercase tracking-widest text-xs">{selectedProduct.nom}</p>
                </div>
                <button 
                  onClick={closeReviews}
                  className="p-4 bg-white/80 hover:bg-white shadow-sm rounded-2xl transition-all text-darkText/30 hover:text-darkText hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Reviews List */}
              <div className="p-10 overflow-y-auto flex-grow bg-white">
                {reviewLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-pastelPink border-t-babyPink rounded-full animate-spin"></div>
                    <p className="text-darkText/40 font-bold uppercase tracking-widest text-[10px]">Chargement des avis...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    <Star size={64} className="mx-auto mb-4" />
                    <p className="text-xl font-bold">Soyez la première à briller !</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-babyPink shadow-sm">
                              {review.user?.nom?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-darkText">
                              {review.user?.nom || 'Client Anonyme'}
                            </span>
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, index) => (
                              <Star key={index} size={14} fill={index < review.note ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-darkText/70 leading-relaxed italic">"{review.commentaire}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="p-10 bg-[#FAF9F6] border-t border-pastelPink/20">
                {reviewMsg.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl mb-6 flex items-center gap-3 font-bold text-sm ${
                      reviewMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {reviewMsg.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
                    {reviewMsg.text}
                  </motion.div>
                )}

                {token ? (
                  <form onSubmit={submitReview} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <p className="text-xs font-black uppercase tracking-widest text-darkText/40">Votre note :</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, note: n })}
                            className="transition-transform hover:scale-125"
                          >
                            <Star 
                              size={32} 
                              fill={n <= reviewForm.note ? "#fbbf24" : "none"} 
                              color={n <= reviewForm.note ? "#fbbf24" : "#e2e8f0"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        className="input-premium !rounded-[2rem] !p-8 resize-none min-h-[120px]"
                        placeholder="Racontez-nous votre expérience..."
                        value={reviewForm.commentaire}
                        onChange={e => setReviewForm({ ...reviewForm, commentaire: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full !py-5 !text-lg !rounded-[2rem]">
                      Partager mon avis
                    </Button>
                  </form>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-pastelPink/40 rounded-[2rem]">
                    <p className="text-darkText/40 font-medium mb-6">Connectez-vous pour laisser une trace de votre passage.</p>
                    <Link to="/auth">
                      <Button variant="outline" className="!px-10">Me Connecter</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

