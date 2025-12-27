
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
import ArticleView from './pages/ArticleView';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditor from './pages/AdminEditor';
import AdminCategories from './pages/AdminCategories';
import AdminAuthors from './pages/AdminAuthors';
import Login from './pages/Login';
import { authService } from './services/authService';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  if (isAdminPage || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticleView />} />
          <Route path="/category/:category" element={<Home />} />
          <Route path="/search" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/editor" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
          <Route path="/admin/editor/:id" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/authors" element={<ProtectedRoute><AdminAuthors /></ProtectedRoute>} />
          
          {/* Default Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;
