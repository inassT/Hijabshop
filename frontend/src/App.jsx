import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import Recommendation from './pages/Recommendation';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/recommendation" element={<Recommendation />} />

            {/* Routes protégées (utilisateur connecté) */}
            <Route path="/cart" element={
              <PrivateRoute><Cart /></PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute><Orders /></PrivateRoute>
            } />

            {/* Routes admin uniquement */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
          </Routes>
        </main>
        <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)', opacity: 0.7 }}>
          <p>&copy; 2026 HijabShop. Tous droits réservés.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
