/**
 * Custom hook for managing dataset state
 * Handles loading, saving, and persistence with localStorage
 */

import { useState, useEffect } from 'react';
import { validateDataset } from './parser';

const DATASET_STORAGE_KEY = 'insightcart_dataset';

export const useDataset = () => {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load dataset from localStorage on mount
  useEffect(() => {
    const loadStoredDataset = () => {
      try {
        const stored = localStorage.getItem(DATASET_STORAGE_KEY);
        if (stored) {
          const parsedData = JSON.parse(stored);
          if (validateDataset(parsedData)) {
            setDataset(parsedData);
          }
        }
      } catch (err) {
        console.error('Failed to load dataset from localStorage:', err);
      }
    };

    loadStoredDataset();
  }, []);

  /**
   * Load new dataset
   * @param {array} data - Parsed dataset array
   */
  const loadDataset = (data) => {
    try {
      if (!validateDataset(data)) {
        throw new Error('Invalid dataset structure');
      }

      setDataset(data);
      setError(null);

      // Save to localStorage
      localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err.message);
      console.error('Error loading dataset:', err);
    }
  };

  /**
   * Clear dataset
   */
  const clearDataset = () => {
    setDataset(null);
    setError(null);
    localStorage.removeItem(DATASET_STORAGE_KEY);
  };

  /**
   * Check if dataset is loaded
   */
  const hasDataset = dataset !== null && dataset.length > 0;

  return {
    dataset,
    hasDataset,
    loading,
    error,
    loadDataset,
    clearDataset
  };
};
