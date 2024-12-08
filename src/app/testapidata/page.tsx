'use client';

import React, { useEffect, useState } from 'react';
import { fetchCategories } from '@/components/fetchDirectoryData/fetchdirectory'; // Adjust path as needed
import { toast } from 'react-toastify';

const FetchAllCategories: React.FC = () => {
  const [categoriesJSON, setCategoriesJSON] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const categories = await fetchCategories();
        setCategoriesJSON(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="categories-container">
      <style jsx>{`
        .categories-container {
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
          max-width: 600px;
          margin: auto;
        }
        pre {
          background: #333;
          color: #fff;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }
      `}</style>

      <h2>Categories in JSON Format</h2>
      {loading ? (
        <p>Loading categories...</p>
      ) : Object.keys(categoriesJSON).length > 0 ? (
        <pre>{JSON.stringify(categoriesJSON, null, 2)}</pre> // Display the JSON result
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default FetchAllCategories;
