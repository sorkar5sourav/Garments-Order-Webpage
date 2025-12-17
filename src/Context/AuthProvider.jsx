import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../Firebase/firebase.init.js";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ensure persistence so auth survives redirects
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Failed to set auth persistence:", err);
    });
  }, []);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    // Clear token cookie if you use it
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const setTokenInCookie = (token) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expires = "expires=" + expirationDate.toUTCString();
    // If your site is HTTPS in production consider adding `; Secure; SameSite=None`
    document.cookie = `token=${token}; ${expires}; path=/; SameSite=Strict`;
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setTokenInCookie(token);
          console.log("Token stored in cookie");
        } catch (err) {
          console.error("Error getting token:", err);
        }
      } else {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    signInUser,
    signInGoogle,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
