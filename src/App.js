import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";

// Import Context Providers
import { AuthProvider } from "./context/AuthContext"; // Assuming AuthProvider is here
import { CartProvider } from "./context/CartContext"; // Import CartProvider

// Import Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Import Pages
import HomePage from "./pages/HomePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailsPage from "./pages/ProductDetailsPage"; // Renamed import
import AdminLoginPage from "./pages/AdminLoginPage";
import CartPage from "./pages/CartPage"; // Import CartPage

// Helper component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminLoginPage = location.pathname === "/admin/login";

  return (
    <div className="App">
      {!isAdminLoginPage && <Navbar />}
      <main
        className={`main-content ${
          isAdminLoginPage ? "main-content-full-page" : ""
        }`}
      >
        {children}
      </main>
      {!isAdminLoginPage && (
        <footer className="footer">
          <p>
            &copy; {new Date().getFullYear()} Bansal Nursery. All rights
            reserved.
            <br />
            <strong>Address:</strong> Jaipur, Rajasthan
          </p>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    // AuthProvider should wrap CartProvider if Cart needs auth info, or vice-versa.
    // For now, let's assume they are independent or AuthProvider is outermost.
    <AuthProvider>
      <CartProvider>
        {" "}
        {/* Wrap Router with CartProvider */}
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />{" "}
              {/* Add route for CartPage */}
              <Route
                path="/products/:productId"
                element={<ProductDetailsPage />}
              />{" "}
              {/* Updated route and param */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* Fallback for old plant routes, redirect or show ProductDetailsPage */}
              {/* This is optional and depends on SEO / user experience goals */}
              {/* For now, let's assume direct change is okay */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
