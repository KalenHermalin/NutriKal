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
export interface Settings {
    id?: number;
    dailyCalorieGoal: number;
    dailyProteinGoal: number;
    dailyCarbGoal: number;
    dailyFatGoal: number;
    theme: "light" | "dark" | "system";
    units: "metric" | "imperial";
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
export const foods: Food[] = [
  {
    food_id: 1,
    food_name: "Grilled Chicken Breast",
    brand_name: "Generic",
    servings: [
      {
        serving_id: "1",
        serving_description: "100g",
        serving_url: "",
        metric_serving_amount: "100",
        metric_serving_unit: "g",
        number_of_units: "1",
        measurement_description: "100g",
        is_default: "1",
        calories: "165",
        carbohydrate: "0",
        protein: "31",
        fat: "3.6",
        saturated_fat: "1",
        polyunsaturated_fat: "0.8",
        monounsaturated_fat: "1.2",
        trans_fat: "0",
        cholesterol: "85",
        sodium: "74",
        potassium: "256",
        fiber: "0",
        sugar: "0",
        added_sugars: "0",
        vitamin_d: "0",
        vitamin_a: "13",
        vitamin_c: "0",
        calcium: "15",
        iron: "1"
      }
    ],
    quantity: "100"
  },
  {
    food_id: 2,
    food_name: "Brown Rice",
    brand_name: "Generic",
    servings: [
      {
        serving_id: "2",
        serving_description: "1 cup cooked",
        serving_url: "",
        metric_serving_amount: "195",
        metric_serving_unit: "g",
        number_of_units: "1",
        measurement_description: "1 cup",
        is_default: "1",
        calories: "216",
        carbohydrate: "44.8",
        protein: "5",
        fat: "1.8",
        saturated_fat: "0.4",
        polyunsaturated_fat: "0.6",
        monounsaturated_fat: "0.7",
        trans_fat: "0",
        cholesterol: "0",
        sodium: "10",
        potassium: "84",
        fiber: "3.5",
        sugar: "0.7",
        added_sugars: "0",
        vitamin_d: "0",
        vitamin_a: "0",
        vitamin_c: "0",
        calcium: "20",
        iron: "0.8"
      }
    ],
    quantity: "195"
  },
  {
    food_id: 3,
    food_name: "Broccoli",
    brand_name: "Generic",
    servings: [
      {
        serving_id: "3",
        serving_description: "1 cup chopped",
        serving_url: "",
        metric_serving_amount: "91",
        metric_serving_unit: "g",
        number_of_units: "1",
        measurement_description: "1 cup",
        is_default: "1",
        calories: "31",
        carbohydrate: "6",
        protein: "2.5",
        fat: "0.3",
        saturated_fat: "0.1",
        polyunsaturated_fat: "0.1",
        monounsaturated_fat: "0",
        trans_fat: "0",
        cholesterol: "0",
        sodium: "30",
        potassium: "288",
        fiber: "2.4",
        sugar: "1.5",
        added_sugars: "0",
        vitamin_d: "0",
        vitamin_a: "567",
        vitamin_c: "81.2",
        calcium: "42",
        iron: "0.7"
      }
    ],
    quantity: "91"
  }
];