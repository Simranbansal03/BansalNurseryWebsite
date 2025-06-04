import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";
import "../App.css"; // For page-container
import "./ProductDetailsPage.css"; // For specific styling for this page
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel"; // Import Carousel component
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error(
          `Failed to fetch product details for ID ${productId}:`,
          err
        );
        setError(err.message || "Failed to fetch product details.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]); // Re-run effect if productId changes

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">Error: {error}</div>
        <a href="/#products-section" className="back-to-products-link">
          Back to All Products
        </a>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="error-message">Product not found.</div>
        <a href="/#products-section" className="back-to-products-link">
          Back to All Products
        </a>
      </div>
    );
  }

  const defaultImageUrl =
    "https://via.placeholder.com/600x400?text=No+Image+Available";

  // Prepare images for carousel or single display
  let imagesToDisplay = [];
  if (product.imageUrls && product.imageUrls.length > 0) {
    imagesToDisplay = product.imageUrls;
  } else if (product.imageUrl) {
    imagesToDisplay = [product.imageUrl];
  }

  const handleAddToCart = () => {
    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imagesToDisplay[0] || defaultImageUrl,
    });
  };

  return (
    <div className="page-container product-details-container">
      <a href="/#products-section" className="back-to-products-link">
        Back to All Products
      </a>
      <div className="product-details-content">
        <div className="product-details-image-container">
          <div className="modern-carousel-container">
            {imagesToDisplay.length > 0 ? (
              <Carousel
                showArrows={true}
                showThumbs={imagesToDisplay.length > 1}
                dynamicHeight={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={3500}
                showStatus={false}
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="carousel-arrow carousel-arrow-prev overlay-arrow"
                    >
                      &#8592;
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                  hasNext && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="carousel-arrow carousel-arrow-next overlay-arrow"
                    >
                      &#8594;
                    </button>
                  )
                }
                renderIndicator={(onClickHandler, isSelected, index, label) => {
                  return (
                    <li
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: isSelected ? "#0A472E" : "#ccc",
                        margin: "0 4px",
                        cursor: "pointer",
                        border: isSelected ? "2px solid #0A472E" : "none",
                        boxShadow: isSelected
                          ? "0 0 4px rgba(10, 71, 46, 0.3)"
                          : "none",
                      }}
                      onClick={onClickHandler}
                      onKeyDown={onClickHandler}
                      value={index}
                      key={index}
                      role="button"
                      tabIndex={0}
                      aria-label={`${label} ${index + 1}`}
                    />
                  );
                }}
                className="product-details-carousel"
              >
                {imagesToDisplay.map((url, index) => (
                  <div key={index} className="carousel-image-wrapper">
                    <img
                      src={url}
                      alt={`${product.name || "Product"} ${index + 1}`}
                      className="carousel-image"
                      onError={(e) => {
                        if (e.target.src !== defaultImageUrl) {
                          e.target.onerror = null;
                          e.target.src = defaultImageUrl;
                        }
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src={defaultImageUrl}
                alt={product.name || "Product"}
                className="product-details-image"
              />
            )}
          </div>
        </div>
        <div className="product-details-info">
          <h1>{product.name || "Unnamed Product"}</h1>

          <div className="product-price">
            ₹{product.price ? product.price.toFixed(2) : "N/A"}
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          <button className="btn-add-to-cart-details" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
