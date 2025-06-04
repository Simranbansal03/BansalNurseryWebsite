const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();
const productsCollection = db.collection("products");

// POST /api/products - Add a new product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      scientificName,
      description,
      price,
      stockQuantity,
      imageUrls,
      category,
      careInstructions,
    } = req.body;

    // Only name, price, and category are required
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Missing required fields: name, price, category",
      });
    }

    const newProduct = {
      name,
      scientificName: scientificName || "",
      description: description || "",
      price: parseFloat(price),
      stockQuantity: stockQuantity ? parseInt(stockQuantity, 10) : 0,
      imageUrls: imageUrls && Array.isArray(imageUrls) ? imageUrls : [],
      category,
      careInstructions: careInstructions || {},
      addedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await productsCollection.add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
});

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const snapshot = await productsCollection.orderBy("addedAt", "desc").get();
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res
      .status(500)
      .json({ message: "Error getting products", error: error.message });
  }
});

// GET /api/products/:id - Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const doc = await productsCollection.doc(productId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res
      .status(500)
      .json({ message: "Error getting product by ID", error: error.message });
  }
});

// PUT /api/products/:id - Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productRef = productsCollection.doc(productId);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = { ...req.body };
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stockQuantity)
      updateData.stockQuantity = parseInt(updateData.stockQuantity, 10);

    // Ensure imageUrls is an array if provided
    if (updateData.imageUrls && !Array.isArray(updateData.imageUrls)) {
      updateData.imageUrls = [updateData.imageUrls];
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await productRef.update(updateData);
    const updatedDoc = await productRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productRef = productsCollection.doc(productId);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productRef.delete();
    res
      .status(200)
      .json({ message: "Product deleted successfully", id: productId });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

module.exports = router;
