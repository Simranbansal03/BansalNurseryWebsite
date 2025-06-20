import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path if necessary
import { useCart } from "../context/CartContext"; // Import useCart
import "../App.css"; // We might create a specific Navbar.css later
import "./Navbar.css"; // Create or ensure this file exists for Navbar specific styles

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to handle home navigation and scroll to top
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // WhatsApp contact link
  const whatsappNumber = "919549416150"; // Format: country code + number without +
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20products.`;

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="nav-logo" onClick={handleHomeClick}>
          Bansal Nursery
        </Link>

        <div className="navbar-right">
          {/* Cart icon - always visible */}
          <div className="cart-link-container">
            <Link
              to="/cart"
              className={`cart-icon ${
                location.pathname === "/cart" ? "active" : ""
              }`}
            >
              🛒
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </Link>
          </div>

          {/* Contact Us button - always visible on desktop */}
          <div className="contact-btn-container desktop-only">
            <a
              href={whatsappUrl}
              className="whatsapp-contact-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
          </div>

          {/* Hamburger menu button - only show when menu is closed */}
          {!mobileMenuOpen && (
            <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        ref={mobileMenuRef}
        className={`mobile-menu-overlay ${mobileMenuOpen ? "show" : ""}`}
      >
        <div className="mobile-menu-header">
          <button
            className="close-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="mobile-nav-links">
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={handleHomeClick}
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="/#products-section"
              className={
                location.pathname === "/#products-section" ? "active" : ""
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </a>
          </li>
          <li className="mobile-only">
            <a
              href={whatsappUrl}
              className="whatsapp-contact-btn"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>
          </li>
          {currentUser && (
            <li>
              <Link
                to="/admin"
                className={location.pathname.includes("/admin") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
          )}
          {currentUser ? (
            <li>
              <button onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/admin/login"
                className={location.pathname === "/admin/login" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Desktop navigation links */}
      <ul className="desktop-nav-links">
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={handleHomeClick}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href="/#products-section"
            className={
              location.pathname === "/#products-section" ? "active" : ""
            }
          >
            Products
          </a>
        </li>
        {currentUser && (
          <li>
            <Link
              to="/admin"
              className={location.pathname.includes("/admin") ? "active" : ""}
            >
              Dashboard
            </Link>
          </li>
        )}
        {currentUser ? (
          <li>
            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/admin/login"
              className={location.pathname === "/admin/login" ? "active" : ""}
            >
              Admin
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
