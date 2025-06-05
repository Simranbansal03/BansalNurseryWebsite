import React, { useState, useEffect, useMemo } from "react";
import AddProductForm from "../components/admin/AddProductForm";
import EditProductForm from "../components/admin/EditProductForm";
import AdminProductCard from "../components/admin/AdminProductCard";
import Pagination from "../components/Pagination";
import productService from "../services/productService";
// import { Link } from "react-router-dom";
import "../App.css";
import "./AdminDashboardPage.css";
import { productCategoriesWithAll } from "../constants/categories";
import { FaThLarge, FaList } from "react-icons/fa";

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open-no-scroll");
    } else {
      document.body.classList.remove("modal-open-no-scroll");
    }
    return () => {
      document.body.classList.remove("modal-open-no-scroll");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12); // Default to desktop view
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const fetchAllProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setErrorProducts(null);
    } catch (err) {
      console.error("Failed to fetch products for admin dashboard:", err);
      setErrorProducts(err.message || "Failed to fetch products.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Set products per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      setProductsPerPage(window.innerWidth <= 768 ? 8 : 12);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleProductAdded = () => {
    fetchAllProducts();
    setIsAddProductModalOpen(false);
  };

  const handleProductUpdated = () => {
    fetchAllProducts();
    setIsEditProductModalOpen(false);
    setEditingProductId(null);
  };

  const openAddProductModal = () => setIsAddProductModalOpen(true);
  const closeAddProductModal = () => setIsAddProductModalOpen(false);

  const openEditProductModal = (productId) => {
    setEditingProductId(productId);
    setIsEditProductModalOpen(true);
  };
  const closeEditProductModal = () => {
    setIsEditProductModalOpen(false);
    setEditingProductId(null);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the product "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        await productService.deleteProduct(productId);
        fetchAllProducts();
      } catch (error) {
        console.error(`Failed to delete product ${productId}:`, error);
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of product section
    document
      .querySelector(".product-management-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-container admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button
          onClick={openAddProductModal}
          className="btn btn-primary add-product-header-btn"
        >
          Add New Product
        </button>
      </div>
      <p className="dashboard-subtitle">
        Manage your nursery inventory and settings from here.
      </p>

      {isAddProductModalOpen && (
        <Modal
          isOpen={isAddProductModalOpen}
          onClose={closeAddProductModal}
          title="Add New Product"
        >
          <AddProductForm onProductAdded={handleProductAdded} />
        </Modal>
      )}

      {isEditProductModalOpen && editingProductId && (
        <Modal
          isOpen={isEditProductModalOpen}
          onClose={closeEditProductModal}
          title={`Edit Product: ${
            products.find((p) => p.id === editingProductId)?.name || ""
          }`}
        >
          <EditProductForm
            productId={editingProductId}
            onProductUpdated={handleProductUpdated}
            onClose={closeEditProductModal}
          />
        </Modal>
      )}

      <section className="admin-section product-management-section">
        <div className="product-management-header">
          <h2>Manage Products</h2>
          <div className="product-management-controls">
            <div className="view-toggle-buttons">
              <button
                className={`view-toggle-btn ${
                  viewMode === "grid" ? "active" : ""
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
              >
                <FaThLarge /> Grid
              </button>
              <button
                className={`view-toggle-btn ${
                  viewMode === "list" ? "active" : ""
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List View"
              >
                <FaList /> List
              </button>
            </div>
            <div className="category-filter-container">
              <label htmlFor="category-filter">Filter by Category: </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter-select"
              >
                {productCategoriesWithAll.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loadingProducts && <p className="loading-text">Loading products...</p>}
        {errorProducts && (
          <p className="error-message">
            Error fetching products: {errorProducts}
          </p>
        )}
        {!loadingProducts && !errorProducts && (
          <>
            {viewMode === "grid" ? (
              <div className="admin-product-cards-grid">
                {filteredProducts.length === 0 ? (
                  <p className="no-products-message full-width-message">
                    {selectedCategory === "All"
                      ? "No products found. Click 'Add New Product' to get started!"
                      : `No products found in the "${selectedCategory}" category.`}
                  </p>
                ) : (
                  currentProducts.map((product) => (
                    <AdminProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDeleteProduct}
                      onEdit={() => openEditProductModal(product.id)}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="admin-product-list-view">
                {filteredProducts.length === 0 ? (
                  <p className="no-products-message full-width-message">
                    {selectedCategory === "All"
                      ? "No products found. Click 'Add New Product' to get started!"
                      : `No products found in the "${selectedCategory}" category.`}
                  </p>
                ) : (
                  <table className="admin-product-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <img
                              src={
                                product.imageUrls &&
                                product.imageUrls.length > 0
                                  ? product.imageUrls[0]
                                  : product.imageUrl ||
                                    "https://via.placeholder.com/150x150?text=No+Image"
                              }
                              alt={product.name}
                              className="admin-product-thumbnail"
                              onError={(e) => {
                                if (
                                  e.target.src !==
                                  "https://via.placeholder.com/150x150?text=No+Image"
                                ) {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/150x150?text=No+Image";
                                }
                              }}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>
                            ₹{product.price ? product.price.toFixed(2) : "N/A"}
                          </td>
                          <td className="actions-cell">
                            <button
                              onClick={() => openEditProductModal(product.id)}
                              className="action-btn edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProduct(product.id, product.name)
                              }
                              className="action-btn delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Only show pagination if there are products and more than one page */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />

                {/* Products count info */}
                <div className="products-count">
                  Showing {indexOfFirstProduct + 1}-
                  {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
