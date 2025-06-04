import React, { useState, useEffect, useMemo } from "react";
import productService from "../services/productService";
import ProductCard from "../components/ProductCard";
import { productCategoriesWithAll } from "../constants/categories";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(
          err.message || "Failed to fetch products. Please try again later."
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    // First filter by category
    let result = products;
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Then filter by search term if it exists
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchTermLower)) ||
          product.category.toLowerCase().includes(searchTermLower)
      );
    }

    return result;
  }, [products, selectedCategory, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Bring The Nature
            <br />
            Close To You
          </h1>
          <p>
            Discover beautiful and healthy plants to bring nature into your home
            and create a green sanctuary.
          </p>
          <a href="#products-section" className="hero-button">
            Shop Now
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefit-item">
          <div className="benefit-icon">🚚</div>
          <h3>Nationwide Shipping</h3>
          <p>
            Available across India via Delhivery, DTDC, India Post, Tirupati,
            Trackon, etc.
          </p>
          <p>Get your tracking link NOW</p>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">💸</div>
          <h3>Safe Payment</h3>
          <p>Multiple payment options for your convenience</p>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🌱</div>
          <h3>Friendly Service</h3>
          <p>Expert gardening advice and plant care tips</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products-section">
        <div className="section-header">
          <h2>Our Products</h2>
          <p>
            Browse our collection of beautiful plants for your home or garden
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="clear-search-btn">
                  ×
                </button>
              )}
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>

        <div className="category-filters">
          {productCategoriesWithAll.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {!loading && error && <p className="error-message">Error: {error}</p>}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="no-products-message">
            {searchTerm
              ? `No products found matching "${searchTerm}". Try a different search term or category.`
              : "No products available in this category at the moment. Please check back later or try a different category!"}
          </p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Plant Care Section */}
      <section className="plant-care-section">
        <div className="plant-care-content">
          <h2>
            Grow Plant For
            <br />A Better Life
          </h2>
          <p>
            Plants help reduce stress, improve air quality, and create a calming
            environment in your home.
          </p>
          {/* <Link to="/care-tips" className="care-button">
            Learn More
          </Link> */}
        </div>
      </section>

      {/* Plant Care Tips */}
      <section className="care-tips-section">
        <h2>Steps to start taking care of your plants</h2>
        <p>The right solution for the care of green and indoor plants</p>

        <div className="care-tips-grid">
          <div className="care-tip-item">
            <div className="care-tip-icon">💧</div>
            <h3>Humidity Control</h3>
            <p>
              Effective humidity control measures for your tropical plant
              varieties.
            </p>
          </div>

          <div className="care-tip-item">
            <div className="care-tip-icon">🌞</div>
            <h3>Pest Elimination</h3>
            <p>
              Understanding possible plant diseases and the right treatment
              methods.
            </p>
          </div>

          <div className="care-tip-item">
            <div className="care-tip-icon">🌱</div>
            <h3>Pruning Needs</h3>
            <p>
              Caring and proper pruning techniques to encourage healthy growth.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
