import { useState } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, ChevronRight, Check, Wand2, Info, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function Recommendation() {
  const [teint, setTeint] = useState('');
  const [sousTon, setSousTon] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const teints = [
    { id: 'Clair', color: '#FCE4EC', name: 'Lumière de Soie' }, 
    { id: 'Moyen', color: '#F5E6DA', name: 'Sable Doré' }, 
    { id: 'Mat', color: '#D4A373', name: 'Ambre Nude' }, 
    { id: 'Foncé', color: '#8B5A2B', name: 'Ebène Royal' }
  ];
  
  const sousTons = [
    { id: 'Froid', desc: 'Veines bleutées, bijoux argentés', label: 'Eclat Lunaire' }, 
    { id: 'Chaud', desc: 'Veines vertes, bijoux dorés', label: 'Souffle Solaire' }, 
    { id: 'Neutre', desc: 'Mélange harmonieux des deux', label: 'Equilibre Pur' }
  ];

  const getRecommendations = async () => {
    if (!teint || !sousTon) {
      setError('Veuillez définir votre profil pour commencer l\'analyse.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/recommendation', {
        teint: teint.toLowerCase(),
        sousTon: sousTon.toLowerCase()
      });
      setTimeout(() => {
        setRecommendations(response.data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('L\'IA rencontre un problème technique. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const getColorHex = (colorName) => {
    const map = {
      'bleu': '#4169E1', 'rose': '#FFB6C1', 'gris': '#808080',
      'vert': '#2E8B57', 'rouge': '#B22222', 'marron': '#8B4513',
      'beige': '#F5F5DC', 'blanc': '#FFFFFF', 'noir': '#000000',
      'orange': '#FF8C00', 'jaune': '#FFD700', 'violet': '#DDA0DD'
    };
    return map[colorName.toLowerCase()] || '#CCCCCC';
  };

  return (
    <div className="pt-32 pb-24 min-h-screen relative bg-[#FAF9F6] overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-pastelPink/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-nudeBeige/30 rounded-full blur-[130px] translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <Badge variant="confirmed" className="mb-6 !px-6 !py-2 !text-xs !font-black uppercase tracking-[0.3em]">
            <Wand2 size={14} className="mr-2" /> Analyse Colorimétrique AI
          </Badge>
          <h2 className="text-6xl md:text-7xl font-black text-darkText tracking-tighter leading-[0.9] mb-8">
            Révélez l'Éclat de <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyPink via-pink-400 to-rose-300">Votre Visage.</span>
          </h2>
          <p className="text-xl text-darkText/40 max-w-2xl mx-auto font-medium leading-relaxed">
            Notre intelligence artificielle analyse vos pigments naturels pour définir la palette qui sublimera votre teint et vos yeux.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          
          <Card glass className="p-10 lg:p-16 !rounded-[4rem] shadow-premium">
            
            <div className="space-y-20">
              {/* Step 1 */}
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-babyPink flex items-center justify-center text-white font-black shadow-lg shadow-babyPink/20">01</div>
                  <div>
                    <h3 className="text-2xl font-black text-darkText tracking-tight">Le Teint</h3>
                    <p className="text-sm font-bold text-darkText/30 uppercase tracking-widest">Base de votre carnation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {teints.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setTeint(t.id)}
                      className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 group flex flex-col items-center gap-6
                        ${teint === t.id 
                          ? 'border-babyPink bg-white shadow-2xl shadow-babyPink/10 scale-105' 
                          : 'border-pastelPink/20 bg-white/40 hover:border-babyPink/40 hover:bg-white'}`}
                    >
                      <div className="relative">
                        <div 
                          className="w-20 h-20 rounded-full shadow-inner border-4 border-white"
                          style={{ backgroundColor: t.color }}
                        />
                        {teint === t.id && (
                          <motion.div 
                            layoutId="check-teint"
                            className="absolute -top-2 -right-2 w-8 h-8 bg-babyPink rounded-full flex items-center justify-center text-white shadow-lg"
                          >
                            <Check size={16} strokeWidth={4} />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`font-black text-sm uppercase tracking-widest ${teint === t.id ? 'text-babyPink' : 'text-darkText/40'}`}>
                          {t.id}
                        </p>
                        <p className="text-[10px] font-bold text-darkText/20 mt-1 italic">{t.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-babyPink flex items-center justify-center text-white font-black shadow-lg shadow-babyPink/20">02</div>
                  <div>
                    <h3 className="text-2xl font-black text-darkText tracking-tight">Le Sous-ton</h3>
                    <p className="text-sm font-bold text-darkText/30 uppercase tracking-widest">La température de votre peau</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sousTons.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSousTon(s.id)}
                      className={`relative p-10 rounded-[2.5rem] border-2 transition-all duration-500 text-left flex flex-col gap-4
                        ${sousTon === s.id 
                          ? 'border-babyPink bg-white shadow-2xl shadow-babyPink/10 scale-105' 
                          : 'border-pastelPink/20 bg-white/40 hover:border-babyPink/40 hover:bg-white'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className={`text-xl font-black ${sousTon === s.id ? 'text-babyPink' : 'text-darkText'}`}>
                          {s.label}
                        </h4>
                        {sousTon === s.id && <Check size={20} className="text-babyPink" strokeWidth={3} />}
                      </div>
                      <p className="text-sm font-medium text-darkText/40 leading-relaxed">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col items-center pt-10 border-t border-pastelPink/10">
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2 text-red-500 font-bold text-sm mb-8 bg-red-50 px-6 py-3 rounded-2xl"
                    >
                      <Info size={16} /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  onClick={getRecommendations}
                  className="!px-16 !py-6 !text-xl !rounded-[2.5rem] shadow-premium"
                  isLoading={loading}
                >
                  {loading ? 'Analyse des Pigments...' : 'Révéler Ma Palette Idéale'}
                  {!loading && <Sparkles size={22} className="ml-2" />}
                </Button>
              </div>
            </div>

            {/* Results */}
            <AnimatePresence>
              {recommendations.length > 0 && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-24 pt-24 border-t-2 border-dashed border-pastelPink/20"
                >
                  <div className="text-center mb-16">
                    <h3 className="text-4xl font-black text-darkText tracking-tighter mb-4">Votre Signature Chromatique</h3>
                    <p className="text-darkText/40 font-bold uppercase tracking-[0.2em] text-xs italic">Sélectionnée exclusivement pour vous par notre IA</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {recommendations.map((color, index) => (
                      <motion.div 
                        key={color}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex flex-col items-center gap-4"
                      >
                        <div className="relative w-full aspect-square rounded-[2rem] p-2 bg-white shadow-premium transition-all duration-500 group-hover:-translate-y-4">
                          <div 
                            className="w-full h-full rounded-[1.5rem] shadow-inner"
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem]" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest text-darkText/40 group-hover:text-babyPink transition-colors">
                          {color}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-20 flex justify-center">
                    <Link to="/shop">
                      <Button variant="outline" className="!px-10 !rounded-2xl group">
                        Découvrir la Collection Associée 
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}

