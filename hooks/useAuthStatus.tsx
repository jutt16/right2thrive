"use client";

import { useState, useEffect } from "react";

export default function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return {
    isAuthenticated: isHydrated ? isAuthenticated : false,
    isHydrated,
  };
}
