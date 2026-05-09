import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  if (role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
