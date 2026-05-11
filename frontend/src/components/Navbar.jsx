import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Package, Shield, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userNom = localStorage.getItem('userNom');
  const { getCartCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = userRole === 'ROLE_ADMIN';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNom');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`relative group flex items-center gap-2 px-4 py-2 transition-all duration-300 font-medium ${isActive ? 'text-babyPink' : 'text-darkText/70 hover:text-babyPink'}`}
      >
        {Icon && <Icon size={18} className={isActive ? 'text-babyPink' : 'text-darkText/40 group-hover:text-babyPink transition-colors'} />}
        {children}
        {isActive && (
          <motion.div 
            layoutId="nav-underline"
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-babyPink rounded-full"
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center px-6 py-3 transition-all duration-500 rounded-full border border-white/20 ${isScrolled ? 'bg-white/70 backdrop-blur-xl shadow-premium' : 'bg-transparent'}`}>
            
            {/* Logo */}
            <Link to="/" className="text-2xl font-black tracking-tight text-darkText flex items-center gap-2 group">
              <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center shadow-soft group-hover:rotate-12 transition-transform duration-500">
                <span className="text-white text-xl">✨</span>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-darkText to-gray-500">HijabShop</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              <NavLink to="/">Accueil</NavLink>
              <NavLink to="/shop">Boutique</NavLink>
              <NavLink to="/recommendation">Analyse Couleur</NavLink>
              {token && <NavLink to="/orders" icon={Package}>Commandes</NavLink>}
              {isAdmin && <NavLink to="/admin" icon={Shield}>Dashboard Admin</NavLink>}
            </div>

            {/* Icons Menu */}
            <div className="hidden md:flex items-center gap-4">
              {token ? (
                <div className="flex items-center gap-3 pl-4 border-l border-pastelPink/30">
                  <div className="w-8 h-8 rounded-full bg-babyPink/20 flex items-center justify-center text-babyPink font-bold text-xs">
                    {userNom?.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-darkText/40 hover:text-red-400 transition-colors" title="Déconnexion">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="!px-4 !py-2 !text-sm">Connexion</Button>
                </Link>
              )}
              
              <Link to="/cart" className="relative p-2.5 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:shadow-md hover:bg-babyPink/10 text-darkText/60 hover:text-babyPink transition-all duration-300">
                <ShoppingBag size={22} />
                {getCartCount() > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-babyPink text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-button border-2 border-white"
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-darkText/60">
                <ShoppingBag size={22} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-babyPink text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm text-darkText"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-2xl p-8 flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black text-babyPink">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-pastelPink/30 rounded-2xl">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <NavLink to="/">Accueil</NavLink>
              <NavLink to="/shop">Boutique</NavLink>
              <NavLink to="/recommendation">Analyse Couleur</NavLink>
              {token && <NavLink to="/orders" icon={Package}>Commandes</NavLink>}
              {isAdmin && <NavLink to="/admin" icon={Shield}>Admin</NavLink>}
            </div>

            <div className="mt-auto pt-8 border-t border-pastelPink/50">
              {token ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-babyPink/10 flex items-center justify-center text-babyPink text-xl font-black">
                      {userNom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-darkText/40 uppercase tracking-widest font-black">Utilisateur</p>
                      <p className="text-xl font-bold text-darkText">{userNom}</p>
                    </div>
                  </div>
                  <Button variant="danger" onClick={handleLogout} className="w-full py-4 !rounded-3xl">
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full py-4 !rounded-3xl">Connexion / Inscription</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


