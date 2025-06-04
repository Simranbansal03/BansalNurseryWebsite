import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();

  const defaultImageUrl =
    "https://via.placeholder.com/300x300?text=No+Image+Available";

  let imageSource = defaultImageUrl;

  if (product && product.imageUrls && product.imageUrls.length > 0) {
    imageSource = product.imageUrls[0];
  } else if (product && product.imageUrl) {
    imageSource = product.imageUrl;
  }

  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageSource,
    };
    addItemToCart(itemToAdd);
    // alert(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageSource}
          alt={product.name || "Product image"}
          className="product-image"
          onError={(e) => {
            if (e.target.src !== defaultImageUrl) {
              e.target.onerror = null;
              e.target.src = defaultImageUrl;
            }
          }}
        />
        <div className="quick-action">
          <button
            onClick={handleAddToCart}
            className="quick-add-button"
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category || "Plant"}</div>
        <h3 className="product-name">{product.name || "Unnamed Product"}</h3>
        <div className="product-price">
          ₹{product.price ? product.price.toFixed(2) : "N/A"}
        </div>
      </div>

      <div className="product-actions">
        <Link to={`/products/${product.id}`} className="view-details-button">
          View Details
        </Link>
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
