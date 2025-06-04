import React from "react";
// import { Link } from "react-router-dom"; // No longer a link
import "./AdminProductCard.css"; // Renamed CSS file

const AdminProductCard = ({ product, onDelete, onEdit }) => {
  // Renamed prop and component
  const defaultThumbnail = "https://via.placeholder.com/150x150?text=No+Image";
  let imageToDisplay = defaultThumbnail;

  if (product.imageUrls && product.imageUrls.length > 0) {
    imageToDisplay = product.imageUrls[0];
  } else if (product.imageUrl) {
    // Fallback for older data structure if any
    imageToDisplay = product.imageUrl;
  }

  return (
    <div className="admin-product-card">
      {" "}
      {/* Renamed class */}
      <div className="admin-product-card-image-container">
        {" "}
        {/* Renamed class */}
        <img
          src={imageToDisplay}
          alt={product.name}
          className="admin-product-card-image" /* Renamed class */
          onError={(e) => {
            if (e.target.src !== defaultThumbnail) {
              e.target.onerror = null; // prevents looping if default also fails
              e.target.src = defaultThumbnail;
            }
          }}
        />
      </div>
      <div className="admin-product-card-content">
        {" "}
        {/* Renamed class */}
        <h3 className="admin-product-card-name">{product.name}</h3>{" "}
        {/* Renamed class */}
        <p className="admin-product-card-category">
          Category: {product.category}
        </p>{" "}
        {/* Renamed class */}
        <p className="admin-product-card-price">
          Price: ₹{product.price ? product.price.toFixed(2) : "N/A"}
        </p>{" "}
        {/* Renamed class */}
      </div>
      <div className="admin-product-card-actions">
        {" "}
        {/* Renamed class */}
        <button onClick={onEdit} className="admin-card-action-btn edit-btn">
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id, product.name)}
          className="admin-card-action-btn delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard; // Renamed component
