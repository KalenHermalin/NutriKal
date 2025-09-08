
 interface Serving {
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
  food_id: number;
  food_name: string;
  brand_name: string;
  servings: Serving[];
  quantity?: string;
}

export interface LogEntry {
    id: string;
    timestamp: number; 
    date: string; // Local String Date
    meal: MealLog;
    
}

export interface MealLog {
    id?: number;
    date: string;
    timestamp: string;
    foods: FoodLog[];
    mealName: string;
    totalCalories: number;
    totalFat: number;
    totalCarbs: number;
    totalProtein: number
}

export interface FoodLog {
    food: Food
    selectedServing: number;
    totalCalories: number;
    totalFat: number;
    totalCarbs: number;
    totalProtein: number

}