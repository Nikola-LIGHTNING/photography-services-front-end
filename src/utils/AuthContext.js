import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Named import to decode JWTs

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Validates the JWT by checking its expiration
  function isTokenValid(token) {
    try {
      const decoded = jwtDecode(token); // Decodes the JWT to get payload (e.g., { exp: 1740816000 })
      return decoded.exp > Date.now() / 1000; // Compares expiration (seconds) to current time (converted to seconds)
    } catch (error) {
      return false; // Returns false if token is malformed or decoding fails
    }
  }

  // Runs on mount to check initial auth state
  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    setIsAuthenticated(!!token && isTokenValid(token)); // True if token exists and is valid
  }, []);

  const logout = () => {
    sessionStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);