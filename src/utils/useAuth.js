/**
 * Authentication Context Hook
 * Manages user login state with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';

const USERS_STORAGE_KEY = 'insightcart_users';
const CURRENT_USER_KEY = 'insightcart_current_user';

/**
 * Initialize auth system
 * @returns {object} Auth object with methods
 */
const initializeAuth = () => {
  return {
    /**
     * Register new user
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @returns {object} {success, error, user}
     */
    register(email, password, name) {
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      if (!email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
      }

      let users = [];
      try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
          users = JSON.parse(stored);
        }
      } catch (err) {
        console.error('Error reading users:', err);
      }

      // Check if user exists
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, hash this!
        name,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
      } catch (err) {
        return { success: false, error: 'Failed to save user' };
      }
    },

    /**
     * Login user
     * @param {string} email
     * @param {string} password
     * @returns {object} {success, error, user}
     */
    login(email, password) {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      let users = [];
      try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
          users = JSON.parse(stored);
        }
      } catch (err) {
        console.error('Error reading users:', err);
      }

      // Find user
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Set as current user
      const currentUser = { id: user.id, email: user.email, name: user.name };
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        return { success: true, user: currentUser };
      } catch (err) {
        return { success: false, error: 'Failed to login' };
      }
    },

    /**
     * Get current user
     * @returns {object|null} Current user or null
     */
    getCurrentUser() {
      try {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (err) {
        return null;
      }
    },

    /**
     * Logout user
     */
    logout() {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };
};

/**
 * React hook for authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth] = useState(() => initializeAuth());

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, [auth]);

  const register = useCallback((email, password, name) => {
    const result = auth.register(email, password, name);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, [auth]);

  const login = useCallback((email, password) => {
    const result = auth.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, [auth]);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, [auth]);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    register,
    login,
    logout
  };
};
