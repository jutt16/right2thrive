"use client";

import { useState, useEffect } from "react";

export default function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true);
    
    // Then check for token
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Return false during SSR and initial hydration to prevent mismatch
  return isHydrated ? isAuthenticated : false;
}
