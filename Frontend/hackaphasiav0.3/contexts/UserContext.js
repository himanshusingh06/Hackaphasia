/**
 * User Context for Global State Management
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AuthService from '../services/authService';

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null
};

// Action types
const USER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT'
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };
    default:
      return state;
  }
}

// Create context
const UserContext = createContext();

/**
 * User Context Provider Component
 * Wraps the app to provide user state and authentication methods
 */
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  /**
   * Check for stored user on app initialization
   */
  useEffect(() => {
    checkStoredUser();
  }, []);

  /**
   * Check if user is stored in AsyncStorage
   */
  const checkStoredUser = async () => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const storedUser = await AuthService.getStoredUser();
      if (storedUser) {
        dispatch({ type: USER_ACTIONS.SET_USER, payload: storedUser });
      } else {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Check stored user error:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Failed to check stored user' });
    }
  };

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = async (email, password) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: null });
    
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        dispatch({ type: USER_ACTIONS.SET_USER, payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: null });
    
    try {
      const result = await AuthService.register(userData);
      
      if (result.success) {
        dispatch({ type: USER_ACTIONS.SET_USER, payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user and clear stored data
   * @returns {Promise<Object>} Logout result
   */
  const logout = async () => {
    try {
      const result = await AuthService.logout();
      
      if (result.success) {
        dispatch({ type: USER_ACTIONS.LOGOUT });
        return { success: true };
      } else {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Logout failed. Please try again.';
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    checkStoredUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Custom hook to access user context
 * @returns {Object} User context value
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;