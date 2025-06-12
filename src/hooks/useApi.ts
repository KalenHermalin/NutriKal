import { useQuery, useMutation } from 'react-query';
import { Food, MealServerResponse } from '../types';

const API_URL = 'https://seashell-app-l9wr9.ondigitalocean.app';

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  return Promise.reject(error);
};

// Function to search for food items
export const useSearchFood = (query: string, page: number = 0) => {
  return useQuery<Food[], Error>(
    ['searchFood', query, page],
    async () => {
      if (!query.trim()) return [];
      
      const response = await fetch(
        `${API_URL}/api/search?q=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    {
      enabled: query.trim().length > 0,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: handleApiError,
    }
  );
};

// Function to get food information by barcode
export const useBarcodeSearch = (barcode: string) => {
  return useQuery<Food, Error>(
    ['barcode', barcode],
    async () => {
      if (!barcode.trim()) throw new Error('Barcode is required');
      
      const response = await fetch(
        `${API_URL}/api/barcode?code=${encodeURIComponent(barcode)}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    {
      enabled: barcode.trim().length > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes
      onError: handleApiError,
    }
  );
};

// Function to analyze a food/meal picture
export const useAnalyzePicture = () => {
  return useMutation<MealServerResponse, Error, string>(
    async (base64Image: string) => {
      const response = await fetch(`${API_URL}/api/picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ picture: base64Image }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    {
      onError: handleApiError,
    }
  );
};

// Function to get catalog foods with filtering
export const useCatalogFoods = (filters: {
  category?: string;
  dietary?: string;
  cuisine?: string;
  timeRange?: string;
}) => {
  return useQuery<Food[], Error>(
    ['catalogFoods', filters],
    async () => {
      // For demo purposes, we'll use search with popular food terms
      const searchTerms = [
        'chicken', 'salmon', 'pasta', 'salad', 'rice', 'beef', 'vegetables',
        'soup', 'sandwich', 'pizza', 'eggs', 'bread', 'cheese', 'yogurt',
        'apple', 'banana', 'oatmeal', 'quinoa', 'tofu', 'beans'
      ];
      
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await fetch(
        `${API_URL}/api/search?q=${encodeURIComponent(randomTerm)}&page=0`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      onError: handleApiError,
    }
  );
};
