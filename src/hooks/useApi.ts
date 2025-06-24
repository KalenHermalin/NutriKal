import { useQuery } from 'react-query';
import { Food, MealServerResponse, FoodSearchServerResponse, Serving } from '../types';
import { useNotification } from '../components/ErrorSystem';

// API error type based on OpenAPI spec
export interface ErrorResponse {
  error: 'MISSING_PICTURE' | 'AI_ANALYSIS_FAILED' | 'MEAL_EXTRACTION_FAILED' |
  'NUTRITION_API_FAILED' | 'MISSING_QUERY' | 'SEARCH_API_FAILED' | 'UNKNOWN_ERROR';
  message: string;
}

const API_URL = 'https://octopus-app-8lwy6.ondigitalocean.app';
//const API_URL = 'http://localhost:8080';

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  // Just log to console with info/warn level (not error)
  if (error instanceof Error) {
    console.warn('API Error:', error.message);
  } else {
    console.info('Unknown API Error:', error);
  }
  // Don't rethrow the error - this prevents React Query from logging it again
  return Promise.resolve(); // Return a resolved promise to prevent unhandled rejections
};

// Helper function to normalize food data from the API
const normalizeFood = (food: any): Food => {
  // Handle case where servings is an object with a serving array
  let normalizedServings: Serving[] = [];

  if (food.servings) {
    if (Array.isArray(food.servings)) {
      normalizedServings = food.servings;
    } else if (food.servings.serving) {
      // Handle both array and single object cases
      normalizedServings = Array.isArray(food.servings.serving)
        ? food.servings.serving
        : [food.servings.serving];
    }
  }

  return {
    ...food,
    servings: normalizedServings
  };
};

// Helper function to normalize meal response
const normalizeMealResponse = (response: any): MealServerResponse => {
  if (!response.ingredients) return response;

  const normalizedIngredients = Array.isArray(response.ingredients)
    ? response.ingredients.map(normalizeFood)
    : [normalizeFood(response.ingredients)];

  return {
    ...response,
    ingredients: normalizedIngredients
  };
};

// Function to search for food items
export const useSearchFood = (query: string, page: number = 0) => {
  const { addNotifications } = useNotification();

  return useQuery<Food[], Error>(
    ['searchFood', query, page], async () => {
      if (!query.trim()) return [];

      try {
        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(query)}&page=${page}`
        );

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json().catch(() => ({
            error: 'UNKNOWN_ERROR',
            message: `Error ${response.status}: ${response.statusText}`
          }));

          console.info(`API Error: ${errorData.error}`, errorData);
          throw new Error(errorData.message);
        }

        const data: FoodSearchServerResponse = await response.json();
        // Normalize the food data to ensure consistent structure
        return data.foods.map(normalizeFood);
      } catch (error) {
        // Handle network errors (like "Failed to fetch")
        console.info('Network error:', error);

        // Create a user-friendly error message
        const message = error instanceof Error
          ? error.message
          : 'Failed to connect to the server';

        throw new Error(message);
      }
    },
    {
      enabled: query.trim().length > 0,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        handleApiError(error);
        addNotifications({
          message: error instanceof Error ? error.message : 'Unknown search error',
          type: 'user-error'
        });
      },
      // Silence React Query's console logging
      useErrorBoundary: false,
    }
  );
};

const analyze = async (base64Image: string) => {
  try {
    const response = await fetch(`${API_URL}/api/picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ picture: base64Image }),
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message)
    }

    return await response.json();

  } catch (e) {
    throw e
  }
}

// Function to analyze a food/meal picture
export const useAnalyzePicture = (base64Image: string) => {
  // No need for useError here as error handling is done in the component
  return useQuery<MealServerResponse, Error>({
    queryKey: ['analyzePicture', base64Image],
    queryFn: () => analyze(base64Image)
  })
}





// Function to get catalog foods with filtering
export const useCatalogFoods = (filters: {
  category?: string;
  dietary?: string;
  cuisine?: string;
  timeRange?: string;
}) => {
  const { addNotifications } = useNotification();

  return useQuery<Food[], Error>(
    ['catalogFoods', filters], async () => {
      // For demo purposes, we'll use search with popular food terms
      const searchTerms = [
        'chicken', 'salmon', 'pasta', 'salad', 'rice', 'beef', 'vegetables',
        'soup', 'sandwich', 'pizza', 'eggs', 'bread', 'cheese', 'yogurt',
        'apple', 'banana', 'oatmeal', 'quinoa', 'tofu', 'beans'
      ];

      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

      try {
        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(randomTerm)}&page=0`
        );

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json().catch(() => ({
            error: 'UNKNOWN_ERROR',
            message: `Error ${response.status}: ${response.statusText}`
          }));

          console.info(`API Error: ${errorData.error}`, errorData);
          throw new Error(errorData.message);
        }

        return response.json();
      } catch (error) {
        // Handle network errors (like "Failed to fetch")
        console.info('Network error:', error);

        // Create a user-friendly error message
        const message = error instanceof Error
          ? error.message
          : 'Failed to connect to the server';

        throw new Error(message);
      }
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        handleApiError(error);
        addNotifications({
          message: error instanceof Error ? error.message : 'Failed to load catalog foods',
          type: 'user-error'
        });
      },
      // Silence React Query's console logging
      useErrorBoundary: false,
    }
  );
};
