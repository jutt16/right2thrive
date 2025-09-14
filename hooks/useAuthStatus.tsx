"use client";

import { useState, useEffect } from "react";

export default function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // adjust "token" to whatever key you store your auth token under
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated;
}
