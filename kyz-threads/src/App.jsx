import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- Components Imports ---
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminSidebar from './components/admin/AdminSidebar';

// --- Consolidated Pages Imports (Via Barrel File) ---
import {
  Home,
  Shop,
  ProductDetails,
  CartPage,
  Measurements,
  UserProfile,
  Checkout,
  AdminDashboard,
  AdminInventory,
  AdminOrders,
  Login,
  Register
} from './pages';

// ==========================================
// 1. LAYOUT WRAPPERS
// ==========================================

/**
 * Public Front-End Layout
 * Standard wrapper for customer-facing store views.
 */
const BaseLayout = () => (
  <div style={styles.baseLayout}>
    <Navbar />
    <main style={styles.mainContent}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

/**
 * Administrative Back-Office Layout
 * Splitted layout featuring a persistent sidebar dashboard navigation.
 */
const AdminLayout = () => (
  <div style={styles.adminLayout}>
    <AdminSidebar />
    <div style={styles.adminContentWrapper}>
      <header style={styles.adminHeader}>
        <h2>kyz-threads | Control Panel</h2>
      </header>
      <main style={styles.adminMain}>
        <Outlet />
      </main>
    </div>
  </div>
);

// ==========================================
// 2. AUTHENTICATION GUARD (MOCK)
// ==========================================
// Protects administrative routes from public access.
const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const token = localStorage.getItem('kyz_token');
  const userRole = localStorage.getItem('kyz_role'); // e.g., 'admin' or 'customer'

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminRequired && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ==========================================
// 3. FALLBACK 404 COMPONENT
// ==========================================
const NotFound = () => (
  <div style={styles.notFound}>
    <h2>404 - Thread Not Found</h2>
    <p>The page you are trying to access doesn't exist.</p>
  </div>
);

// ==========================================
// 4. MAIN ROUTING ARCHITECTURE
// ==========================================
export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* --- Public Storefront Routes --- */}
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<CartPage />} />
          
          {/* Secured Interactive Customer Routes */}
          <Route path="measurements" element={
            <ProtectedRoute><Measurements /></ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute><UserProfile /></ProtectedRoute>
          } />
          <Route path="checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
        </Route>

        {/* --- Authentication Routes (Isolated) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Back-Office Admin Routes (Protected) --- */}
        <Route path="/admin" element={
          <ProtectedRoute isAdminRequired={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* --- Global Catch-All 404 --- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

// ==========================================
// 5. LAYOUT STYLES
// ==========================================
const styles = {
  // Storefront Styles
  baseLayout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  
  // Admin Layout Styles
  adminLayout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f6f9',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
  },
  adminContentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  adminHeader: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    borderBottom: '1px solid #e0e0e0',
  },
  adminMain: {
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
  },
  
  // Utility View Styles
  notFound: {
    textAlign: 'center',
    marginTop: '10%',
    fontFamily: 'sans-serif',
  }
};