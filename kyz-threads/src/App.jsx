import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- Global Layout Component Elements (From Structure Mapping) ---
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminSidebar from './components/admin/AdminSidebar';

// --- Main Pages Destructuring via Barrel Export (src/pages/index.js) ---
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
// 1. GLOBAL LAYOUT WRAPPERS (Tailwind Styles)
// ==========================================

/**
 * Public Front-End Base Layout
 * Wraps all marketplace views with standard header, footer, and fluid grid constraints.
 */
const BaseLayout = () => (
  <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 antialiased">
    <Navbar />
    {/* Setting flex-grow ensures footer stays pinned to screen bottom on tiny pages */}
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 box-border">
      <Outlet />
    </main>
    <Footer />
  </div>
);

/**
 * Back-Office Administration Dashboard Layout
 * Splits screens with a sidebar panel and an independent scrolling control desktop viewport view.
 */
const AdminLayout = () => (
  <div className="flex min-h-screen bg-slate-100 font-sans antialiased">
    <AdminSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="bg-white px-8 py-4 border-b border-slate-200 shadow-sm flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">kyz-threads | Management Suite</h2>
        <div className="text-sm text-slate-500">System Live</div>
      </header>
      <main className="flex-grow p-8 overflow-y-auto box-border">
        <Outlet />
      </main>
    </div>
  </div>
);

// ==========================================
// 2. AUTHENTICATION & SECURITY GUARD ROUTE
// ==========================================
/**
 * Route Interceptor Guard
 * Verifies local tokens and intercepts unauthorized consumers, routing safely to login.
 */
const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const token = localStorage.getItem('kyz_token');
  const userRole = localStorage.getItem('kyz_role'); // Expects 'admin' or 'customer'

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
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl font-black text-zinc-300 tracking-tighter mb-2">404</h1>
    <h2 className="text-2xl font-bold text-zinc-800 mb-1">Thread Not Found</h2>
    <p className="text-zinc-500 max-w-sm">The route or page you are trying to pull doesn't exist within the kyz-threads framework.</p>
  </div>
);

// ==========================================
// 4. MAIN CENTRAL INTERACTIVE ROUTING TREE
// ==========================================
export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* --- Public Storefront Branch --- */}
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<CartPage />} />
          
          {/* Secured Customer Account Routes */}
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

        {/* --- Standalone Identity Authentication Barriers --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Administrative Back-Office Domain (Protected) --- */}
        <Route path="/admin" element={
          <ProtectedRoute isAdminRequired={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* --- Global Fallback Catch-All Block --- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}