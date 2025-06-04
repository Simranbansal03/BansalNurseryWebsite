import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase"; // Your Firebase auth instance

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To track auth state loading

  useEffect(() => {
    // Subscribe to user auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Unsubscribe when component unmounts
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    // Firebase login function
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    // Firebase logout function
    return firebaseSignOut(auth);
  };

  // Google sign-in function
  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // We can add more functions here later if needed (e.g., signup, password reset)

  const value = {
    currentUser,
    loading, // Expose loading state
    login,
    logout,
    signInWithGoogle, // Add Google sign-in function
    // Add other values/functions as needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}{" "}
      {/* Render children only when auth state is resolved */}
    </AuthContext.Provider>
  );
};
