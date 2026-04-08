/**
 * CSV Upload Component
 * Handles file upload and default dataset loading
 */

import { useRef } from 'react';
import { loadCSVFile } from '../utils/parser';

export default function Upload({ onDatasetLoaded, defaultDataset }) {
  const fileInputRef = useRef(null);

  /**
   * Handle file upload
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await loadCSVFile(file);
    if (result.success) {
      onDatasetLoaded(result.data, `Loaded: ${file.name}`);
    } else {
      onDatasetLoaded(null, `Error: ${result.error}`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle default dataset loading
   */
  const handleDefaultDataset = () => {
    if (defaultDataset && defaultDataset.length > 0) {
      onDatasetLoaded(defaultDataset, 'Loaded: Default Dataset');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* File Upload */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition duration-200"
          >
            📁 Upload CSV
          </label>
        </div>

        {/* Default Dataset Button */}
        <button
          onClick={handleDefaultDataset}
          disabled={!defaultDataset || defaultDataset.length === 0}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-200"
        >
          📊 Use Sample Data
        </button>
      </div>

      <p className="text-sm text-gray-600 text-center mt-4">
        Upload a CSV with columns: CustomerID, Gender, Age, Location, Product, Category, PurchaseAmount
      </p>
    </div>
  );
}
