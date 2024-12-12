import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderRoutes = ['/login', '/register', '/forgot-password'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowHeader && <Header />}
      <main className={!shouldShowHeader ? 'full-height' : ''}>
        {children}
      </main>
      {shouldShowHeader && <Footer />}
    </div>
  );
};

export default Layout;