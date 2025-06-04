import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import "./AddProductForm.css"; // Reuse styles from AddProductForm
import { productCategories } from "../../constants/categories";

const EditProductForm = ({ productId, onProductUpdated, onClose }) => {
  const [formData, setFormData] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoadingData(true);
        const data = await productService.getProductById(productId);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || productCategories[0],
          imageUrls: data.imageUrls || [],
        });
        setError(null);
      } catch (err) {
        console.error(
          `Failed to fetch product details for ID ${productId}:`,
          err
        );
        setError("Failed to load product data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setSuccessMessage("");
    setError(null);

    if (name === "imageUpload") {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 0) {
        setNewImageFiles(selectedFiles);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Function to upload images to Cloudinary
  const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    setIsUploading(true);
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET; // Your Cloudinary upload preset
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME; // Your Cloudinary cloud name
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      // Create an array of promises for each file upload
      const uploadPromises = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        return fetch(uploadUrl, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.secure_url) {
              return data.secure_url;
            } else {
              throw new Error(data.error?.message || "Upload failed");
            }
          });
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("Error uploading images to Cloudinary:", error);
      throw new Error("Failed to upload images: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.description
    ) {
      setError(
        "Please fill in all required fields: Name, Price, Category, and Description"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Handle image uploads to Cloudinary if there are new images
      let productImages = [...(formData.imageUrls || [])];

      if (newImageFiles.length > 0) {
        try {
          const newImageUrls = await uploadImagesToCloudinary(newImageFiles);
          productImages = [...productImages, ...newImageUrls];
          setNewImageFiles([]);
        } catch (uploadError) {
          setError("Error uploading images: " + uploadError.message);
          setIsSubmitting(false);
          return;
        }
      }

      // Create product data to send to backend
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrls: productImages,
      };

      // Call the service to update product
      const updatedProduct = await productService.updateProduct(
        productId,
        productData
      );
      setSuccessMessage("Product updated successfully!");

      // Notify parent component
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }

      // Close modal if function is provided
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(err.message || "Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product data...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="error-message">
        Product not found or data couldn't be loaded.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="edit-product-form">
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`edit-name-${productId}`} className="required">
            Name
          </label>
          <input
            type="text"
            id={`edit-name-${productId}`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Snake Plant"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`edit-price-${productId}`} className="required">
            Price (₹)
          </label>
          <input
            type="number"
            id={`edit-price-${productId}`}
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="e.g. 299.99"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`edit-category-${productId}`} className="required">
            Category
          </label>
          <select
            id={`edit-category-${productId}`}
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {productCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor={`edit-description-${productId}`} className="required">
            Description
          </label>
          <textarea
            id={`edit-description-${productId}`}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the product..."
            rows={5}
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label htmlFor={`edit-imageUpload-${productId}`}>
            Upload Additional Images
          </label>
          <input
            type="file"
            id={`edit-imageUpload-${productId}`}
            name="imageUpload"
            onChange={handleChange}
            multiple
            accept="image/*"
          />
          <p className="help-text">You can select multiple images to add</p>

          {formData.imageUrls && formData.imageUrls.length > 0 && (
            <div className="current-images">
              <p>Current Images ({formData.imageUrls.length}):</p>
              <div className="image-thumbnails">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="image-thumbnail">
                    <img src={url} alt={`Product ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {newImageFiles.length > 0 && (
            <div className="selected-files">
              <p>Selected {newImageFiles.length} new file(s):</p>
              <ul>
                {newImageFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {isUploading && (
            <p className="loading-text">Uploading images to Cloudinary...</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onClose}
          disabled={isSubmitting || isUploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting
            ? "Updating Product..."
            : isUploading
            ? "Uploading Images..."
            : "Update Product"}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
