import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000/api/products"; // Use environment variable for API endpoint

// Fetch all products
const getAllProducts = async () => {
  // Renamed function
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error); // Updated message
    throw error;
  }
};

// Fetch a single product by ID
const getProductById = async (id) => {
  // Renamed function
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error); // Updated message
    throw error;
  }
};

// Add a new product
const addProduct = async (productData) => {
  // Renamed function and param
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error("Error adding new product:", error); // Updated message
    throw error;
  }
};

// Update an existing product
const updateProduct = async (id, productData) => {
  // Renamed function and param
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error); // Updated message
    throw error;
  }
};

// Delete a product
const deleteProduct = async (id) => {
  // Renamed function
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error); // Updated message
    throw error;
  }
};

const productService = {
  // Renamed service object
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

export default productService; // Export renamed service
