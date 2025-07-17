import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Info, List, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFoodTracking } from '../hooks/useFoodTracking';
import NutritionCard from '../components/common/NutritionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MealServerResponse, Food, Serving } from '../types';

interface FoodDetailsProps {
  mealData?: MealServerResponse;
}

const FoodDetails: React.FC<FoodDetailsProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mealData = location.state?.mealData as MealServerResponse;
  const isMeal = mealData?.ingredients?.length > 1;
  
  // State for managing food quantities and serving selections
  const [foods, setFoods] = useState<Food[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const { addFoodToLog } = useFoodTracking();

  // Initialize foods with quantities and serving selections
  useEffect(() => {
    if (mealData?.ingredients) {
      console.log('Initializing foods with mealData:', mealData);
      const initializedFoods = mealData.ingredients.map((food) => {
        // Ensure we have a valid selectedServing index
        const hasServings = food.servings && food.servings.length > 0;
        return {
          ...food,
          quantity: food.quantity || '1',
          selectedServing: hasServings ? (food.selectedServing || 0) : 0,
        };
      });
      setFoods(initializedFoods);
      
      // Initialize quantities
      const initialQuantities: { [key: string]: number } = {};
      initializedFoods.forEach((food, index) => {
        const key = `${food.food_id || index}`;
        initialQuantities[key] = parseFloat(food.quantity || '1');
      });
      setQuantities(initialQuantities);
    }
  }, [mealData]);

  // Redirect if no data available
  useEffect(() => {
    if (!mealData) {
      console.error('No meal data available', { locationState: location.state });
      navigate('/search', { replace: true });
    }
  }, [mealData, navigate, location.state]);

  // Add more detailed loading check
  if (!mealData) {
    console.log('No mealData found, redirecting...');
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading food details..." />
      </div>
    );
  }

  if (!mealData.ingredients || mealData.ingredients.length === 0) {
    console.log('No ingredients found in mealData:', mealData);
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error: No ingredients found</p>
          <Link to="/search" className="btn btn-primary mt-4">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (foods.length === 0) {
    console.log('Foods array is empty, still initializing...');
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Initializing food details..." />
      </div>
    );
  }

  const calculateMacros = () => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCalories = 0;

    foods.forEach((food, index) => {
      const key = `${food.food_id || index}`;
      const quantity = quantities[key] || 1;
      
      if (food.servings && food.servings.length > 0) {
        const serving = food.servings[food.selectedServing || 0];
        if (serving) {
          totalCalories += (parseFloat(serving.calories) || 0) * quantity;
          totalProtein += (parseFloat(serving.protein) || 0) * quantity;
          totalCarbs += (parseFloat(serving.carbohydrate) || 0) * quantity;
          totalFat += (parseFloat(serving.fat) || 0) * quantity;
        }
      }
    });

    const total = totalProtein + totalCarbs + totalFat;
    return {
      protein: totalProtein.toFixed(1),
      carbs: totalCarbs.toFixed(1),
      fat: totalFat.toFixed(1),
      calories: totalCalories.toFixed(0),
      proteinPct: total > 0 ? Math.round((totalProtein / total) * 100) : 33,
      carbsPct: total > 0 ? Math.round((totalCarbs / total) * 100) : 33,
      fatPct: total > 0 ? Math.round((totalFat / total) * 100) : 34
    };
  };

  const macros = calculateMacros();

  // Function to update quantity for a specific food item
  const updateQuantity = (foodKey: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantities(prev => ({
        ...prev,
        [foodKey]: newQuantity
      }));
    }
  };

  // Function to update serving selection
  const updateServing = (foodIndex: number, servingIndex: number) => {
    setFoods(prev => prev.map((food, index) => 
      index === foodIndex 
        ? { ...food, selectedServing: servingIndex }
        : food
    ));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <Link to="/search" className="text-muted hover:text-foreground mr-2">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold">
            {isMeal ? 'Meal Details' : 'Food Details'}
          </h1>
        </div>
      </motion.div>

      {/* Food/Meal Overview Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              {isMeal ? mealData.meal_name : foods[0]?.food_name}
            </h2>
            {!isMeal && foods[0]?.brand_name && (
              <p className="text-sm text-muted">{foods[0].brand_name}</p>
            )}
            {isMeal && (
              <p className="text-sm text-muted">{foods.length} ingredients</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold">{macros.calories} cal</p>
            <p className="text-xs text-muted">Total</p>
          </div>
        </div>

        {/* Macro Visualization */}
        <div className="mb-6">
          <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden">
            <div
              className="bg-purple-400"
              style={{ width: `${macros.proteinPct}%` }}
            />
            <div
              className="bg-blue-400"
              style={{ width: `${macros.carbsPct}%` }}
            />
            <div
              className="bg-yellow-400"
              style={{ width: `${macros.fatPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted">
            <span>{macros.proteinPct}% protein</span>
            <span>{macros.carbsPct}% carbs</span>
            <span>{macros.fatPct}% fat</span>
          </div>
        </div>

        {/* Macronutrient Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-muted mb-1">Protein</p>
            <p className="font-semibold">{macros.protein}g</p>
          </div>
          <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-muted mb-1">Carbs</p>
            <p className="font-semibold">{macros.carbs}g</p>
          </div>
          <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-muted mb-1">Fat</p>
            <p className="font-semibold">{macros.fat}g</p>
          </div>
        </div>

        {/* Add to Diary Button */}
        <div className="flex justify-end">
          <button className="btn btn-primary py-2 px-4" onClick={() => {
            //TODO: Implement add to diary functionality
          }}>
            <Plus size={16} className="mr-2" />
            {isMeal ? 'Add Entire Meal to Diary' : 'Add to Diary'}
          </button>
        </div>
      </motion.div>

      {/* Individual Food Items - Show header only for meals */}
      {isMeal && (
        <h2 className="text-lg font-semibold mt-8 mb-4">Food Items</h2>
      )}
      
      <div className="space-y-4">
        {foods.map((food, index) => {
          const foodKey = `${food.food_id || index}`;
          const quantity = quantities[foodKey] || 1;
          
          // Check if food has servings array and it's not empty
          if (!food.servings || !Array.isArray(food.servings) || food.servings.length === 0) {
            console.warn('Food missing servings:', food);
            return (
              <motion.div
                key={food.food_id || `food-${index}`}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium">{food.food_name || 'Unknown Food'}</h3>
                {food.brand_name && (
                  <p className="text-sm text-muted">{food.brand_name}</p>
                )}
                <p className="text-red-500 mt-2">Error: Missing serving information</p>
                <pre className="text-xs mt-2 text-gray-500">{JSON.stringify(food, null, 2)}</pre>
              </motion.div>
            );
          }

          // Ensure selectedServing is within bounds, default to 0 (first serving)
          const selectedServingIndex = Math.max(0, Math.min(food.selectedServing || 0, food.servings.length - 1));
          const serving = food.servings[selectedServingIndex];
          
          if (!serving) {
            console.warn('Selected serving not found:', { 
              food, 
              selectedServing: food.selectedServing, 
              servingsLength: food.servings.length,
              calculatedIndex: selectedServingIndex 
            });
            return (
              <motion.div
                key={food.food_id || `food-${index}`}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium">{food.food_name || 'Unknown Food'}</h3>
                <p className="text-red-500 mt-2">Error: Invalid serving selection</p>
                <p className="text-xs mt-1">Available servings: {food.servings.length}</p>
                <p className="text-xs">Selected index: {selectedServingIndex}</p>
              </motion.div>
            );
          }
          
          // Calculate nutrition values with quantity
          const protein = (parseFloat(serving.protein) || 0) * quantity;
          const carbs = (parseFloat(serving.carbohydrate) || 0) * quantity;
          const fat = (parseFloat(serving.fat) || 0) * quantity;
          const calories = (parseFloat(serving.calories) || 0) * quantity;
          const total = protein + carbs + fat;

          const proteinPct = total > 0 ? Math.round((protein / total) * 100) : 33;
          const carbsPct = total > 0 ? Math.round((carbs / total) * 100) : 33;
          const fatPct = total > 0 ? Math.round((fat / total) * 100) : 34;

          return (
            <motion.div
              key={food.food_id || `food-${index}`}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{food.food_name}</h3>
                  {food.brand_name && (
                    <p className="text-sm text-muted">{food.brand_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Math.round(calories)} cal</p>
                  <p className="text-xs text-muted">
                    {serving.serving_description || serving.measurement_description || 'Per serving'}
                  </p>
                </div>
              </div>

              {/* Serving Selection */}
              {food.servings.length > 1 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Serving Size:</label>
                  <select
                    value={selectedServingIndex}
                    onChange={(e) => updateServing(index, parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background"
                  >
                    {food.servings.map((servingOption, servingIndex) => (
                      <option key={servingIndex} value={servingIndex}>
                        {servingOption.serving_description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="text-sm font-medium">Quantity:</span>
                  {food.quantity && (
                    <p className="text-xs text-muted">Original: {food.quantity}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(foodKey, Math.max(0.1, quantity - 0.1))}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string while typing
                      if (value === '') {
                        setQuantities(prev => ({ ...prev, [foodKey]: 0 }));
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue >= 0) {
                          updateQuantity(foodKey, numValue);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure minimum value when user finishes editing
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || value <= 0) {
                        updateQuantity(foodKey, 0.1);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-16 text-center bg-background border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0.1"
                    step="0.1"
                    placeholder="0.1"
                  />
                  <button
                    onClick={() => updateQuantity(foodKey, quantity + 0.1)}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Macro Visualization */}
              <div className="mt-4">
                <div className="flex gap-1 h-2 w-full">
                  <div className="bg-purple-400 rounded-l-full" style={{ width: `${proteinPct}%` }} />
                  <div className="bg-blue-400" style={{ width: `${carbsPct}%` }} />
                  <div className="bg-yellow-400 rounded-r-full" style={{ width: `${fatPct}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1 text-muted">
                  <span>{proteinPct}% protein ({protein.toFixed(1)}g)</span>
                  <span>{carbsPct}% carbs ({carbs.toFixed(1)}g)</span>
                  <span>{fatPct}% fat ({fat.toFixed(1)}g)</span>
                </div>
              </div>

              {/* Individual Add Button for meals */}
              {isMeal && (
                <div className="flex justify-end mt-4">
                  <button className="btn btn-outline py-1 px-3 text-sm">
                    <Plus size={14} className="mr-1" />
                    Add Individual
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodDetails;