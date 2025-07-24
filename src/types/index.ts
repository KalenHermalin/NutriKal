// API response types based on the OpenAPI spec

export interface Serving {
  serving_id: string;
  serving_description: string;
  serving_url: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
  number_of_units: string;
  measurement_description: string;
  is_default: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat: string;
  polyunsaturated_fat: string;
  monounsaturated_fat: string;
  trans_fat: string;
  cholesterol: string;
  sodium: string;
  potassium: string;
  fiber: string;
  sugar: string;
  added_sugars: string;
  vitamin_d: string;
  vitamin_a: string;
  vitamin_c: string;
  calcium: string;
  iron: string;
}

export interface Food {
  food_id?: number;
  food_name: string;
  brand_name?: string;
  servings: Serving[];
  selectedServing?: number;
  quantity?: string;
}

export interface Ingredient {
  ingredient_name: string;
  quantity: string;
}

export interface MealAnalysisResponse {
  success: boolean;
  // TODO: change to use Meal interface in backend so i can change it here
  meal_name: string;
  ingredients: Ingredient[];
}


export interface MealServerResponse {
  success: boolean;
  meal_name: string;
  ingredients: Food[];
}

export interface FoodSearchServerResponse {
  success: boolean;
  foods: Food[];
}

// Additional types for app state management

export interface NutritionSummary {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface RecentFood {
  id: number;
  name: string;
  calories: number;
  timestamp: string;
}

export interface DailyNutrition {
  date: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

// Catalog specific types
export interface CatalogFood extends Food {
  category: string;
  cuisine: string;
  dietary: string[];
  prepTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  image: string;
  rating: number;
  reviews: number;
  instructions: string[];
  ingredients: string[];
}

export interface FilterOptions {
  category: string;
  dietary: string;
  cuisine: string;
  timeRange: string;
}

export interface RecentlyViewed {
  food_id: number;
  food_name: string;
  brand_name: string;
  image: string;
  calories: string;
  viewedAt: number;
}
