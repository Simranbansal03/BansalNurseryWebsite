const express = require("express");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const cors = require("cors");

// Load environment variables from .env file in development
dotenv.config();

// Initialize Firebase Admin SDK using credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const productRoutes = require("./routes/productRoutes"); // Import product routes

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Bansal Nursery Backend API with Firebase is running!");
});

app.use("/api/products", productRoutes); // Use product routes

// Example route to test Firestore connection
app.get("/test-firestore", async (req, res) => {
  try {
    const docRef = db.collection("testCollection").doc("testDoc");
    await docRef.set({
      message: "Firestore connected successfully!",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send("Test data written to Firestore!");
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    res.status(500).send("Error writing to Firestore: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log("Firebase Admin SDK initialized.");
});
