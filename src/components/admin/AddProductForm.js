import React, { useState } from "react";
import productService from "../../services/productService";
import "./AddProductForm.css";
import { productCategories } from "../../constants/categories";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  imageUrls: [],
  category: productCategories[0],
};

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setSuccessMessage("");
    setError(null);

    if (name === "imageUpload") {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 0) {
        setImageFiles(selectedFiles);
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

      // Upload images to Cloudinary and get URLs
      let productImages = [];
      if (imageFiles.length > 0) {
        try {
          productImages = await uploadImagesToCloudinary(imageFiles);
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

      // Call the service to add product
      const newProduct = await productService.addProduct(productData);
      setSuccessMessage("Product added successfully!");
      setFormData(initialFormState);
      setImageFiles([]);

      // Notify parent component
      if (onProductAdded) {
        onProductAdded(newProduct);
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err.message || "Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name" className="required">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Snake Plant"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="required">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
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
          <label htmlFor="category" className="required">
            Category
          </label>
          <select
            id="category"
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
          <label htmlFor="description" className="required">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the product..."
            rows={5}
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label htmlFor="imageUpload" className="required">
            Product Image(s)
          </label>
          <input
            type="file"
            id="imageUpload"
            name="imageUpload"
            multiple
            accept="image/*"
            onChange={handleChange}
            disabled={isUploading || imageFiles.length >= 5}
          />
          {imageFiles.length > 0 && (
            <div className="image-previews">
              <p>Selected files ({imageFiles.length}):</p>
              {Array.from(imageFiles).map((file, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "0.8em",
                    marginRight: "10px",
                    display: "block",
                  }}
                >
                  {file.name}
                </span>
              ))}
            </div>
          )}
          {isUploading && (
            <p className="loading-text">Uploading images to Cloudinary...</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting
            ? "Adding Product..."
            : isUploading
            ? "Uploading Images..."
            : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
