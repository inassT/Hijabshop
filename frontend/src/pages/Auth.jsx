import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

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
        
        if (data.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/shop');
        }
        window.location.reload();
        
      } else {
        await api.post('/auth/register', formData);
        setIsLogin(true);
        setError('Inscription réussie ! Veuillez vous connecter.');
      }
    } catch (err) {
      console.error("Auth error:", err);
      const message = err.response?.data?.message || err.response?.statusText || 'Erreur de connexion.';
      setError(message === 'Forbidden' ? 'Identifiants incorrects' : message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6 relative overflow-hidden bg-[#FAF9F6]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-pastelPink/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-nudeBeige/30 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" 
        />
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col gap-8"
        >
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-premium group-hover:rotate-12 transition-transform">
              <ChevronLeft className="text-babyPink" size={24} />
            </div>
            <span className="font-black text-darkText/40 uppercase tracking-[0.3em] text-xs">Retour à l'accueil</span>
          </Link>

          <h1 className="text-7xl font-black text-darkText leading-[0.9] tracking-tighter">
            Prête pour <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyPink to-pink-400">l'expérience ?</span>
          </h1>
          
          <p className="text-xl text-darkText/40 font-medium max-w-md leading-relaxed">
            Rejoignez une communauté de femmes qui allient foi et élégance moderne au quotidien.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-babyPink" />
              <p className="text-sm font-bold text-darkText/60">Analyse colorimétrique personnalisée</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-babyPink" />
              <p className="text-sm font-bold text-darkText/60">Accès aux collections limitées</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-babyPink" />
              <p className="text-sm font-bold text-darkText/60">Suivi de commande premium</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="p-10 lg:p-14 bg-white/80 backdrop-blur-2xl !rounded-[3rem] shadow-premium relative">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-premium-gradient rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-babyPink/30">
                <Sparkles className="text-white" size={36} />
              </div>
              <h2 className="text-4xl font-black text-darkText tracking-tighter mb-2">
                {isLogin ? 'Connexion' : 'Bienvenue'}
              </h2>
              <p className="text-darkText/40 font-bold uppercase tracking-widest text-[10px]">
                {isLogin ? 'Accédez à votre univers' : 'Créez votre profil luxe'}
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 mb-8 rounded-3xl flex items-center gap-3 text-sm font-black tracking-tight ${
                    error.includes('réussie') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {error.includes('réussie') ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4 mb-2 block">Nom Complet</label>
                    <div className="relative">
                      <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-darkText/20" />
                      <input type="text" name="nom" className="input-premium pl-14" placeholder="Sarah ..." value={formData.nom} onChange={handleChange} required={!isLogin} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4 mb-2 block">Adresse Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-darkText/20" />
                  <input type="email" name="email" className="input-premium pl-14" placeholder="sarah@exemple.com" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30">Mot de Passe</label>
                  {isLogin && <button type="button" className="text-[10px] text-babyPink font-black uppercase tracking-widest hover:underline">Oublié ?</button>}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-darkText/20" />
                  <input type="password" name="password" className="input-premium pl-14" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                </div>
              </div>

              <Button type="submit" className="w-full !py-5 !text-lg !rounded-[2rem] mt-4" isLoading={loading}>
                {isLogin ? 'Se Connecter' : "S'Inscrire"}
                {!loading && <ArrowRight size={20} />}
              </Button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-darkText/40 font-bold uppercase tracking-widest text-[10px]">
                {isLogin ? "Nouveau chez nous ?" : 'Déjà une habituée ?'}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-babyPink ml-2 hover:underline">
                  {isLogin ? "Rejoignez-nous" : 'Identifiez-vous'}
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

