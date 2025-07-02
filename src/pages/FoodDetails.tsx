import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Info, List, Minus } from 'lucide-react';
import NutritionCard from '../components/common/NutritionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MealServerResponse, Food, Serving } from '../types';

interface FoodDetailsProps {
  mealData?: MealServerResponse;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({ mealData: propMealData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'nutrition' | 'servings'>('nutrition');

  // Get meal data from props or location state
  const mealData = propMealData || (location.state?.mealData as MealServerResponse);

  // State for managing food quantities and serving selections
  const [foods, setFoods] = useState<Food[]>([]);

  // Initialize foods with quantities and serving selections
  useEffect(() => {
    if (mealData?.ingredients) {
      const initializedFoods = mealData.ingredients.map((food) => ({
        ...food,
        quantity: food.quantity || '1',
        selectedServing: food.selectedServing || 0,
      }));
      setFoods(initializedFoods);
    }
  }, [mealData]);

  // Redirect if no data available
  useEffect(() => {
    if (!mealData && !propMealData) {
      console.error('No meal data available', { locationState: location.state });
      navigate('/search', { replace: true });
    }
  }, [mealData, navigate, propMealData, location.state]);

  if (!mealData || foods.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading food details..." />
      </div>
    );
  }

  // Update quantity for a specific food
  const updateQuantity = (foodIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setFoods(prev =>
      prev.map((food, index) =>
        index === foodIndex ? { ...food, quantity: newQuantity.toString() } : food
      )
    );
  };

  // Update serving selection for a specific food
  const updateServingSelection = (foodIndex: number, servingIndex: number) => {
    setFoods(prev =>
      prev.map((food, index) =>
        index === foodIndex ? { ...food, selectedServing: servingIndex } : food
      )
    );
  };

  // Calculate total macros for all foods
  const calculateTotalMacros = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    foods.forEach((food) => {
      const serving = food.servings[food.selectedServing];
      if (serving) {
        const quantity = parseFloat(food.quantity || '1');
        totalCalories += (parseFloat(serving.calories) || 0) * quantity;
        totalProtein += (parseFloat(serving.protein) || 0) * quantity;
        totalCarbs += (parseFloat(serving.carbohydrate) || 0) * quantity;
        totalFat += (parseFloat(serving.fat) || 0) * quantity;
      }
    });

    const total = totalProtein + totalCarbs + totalFat;
    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      total
    };
  };

  const totalMacros = calculateTotalMacros();
  const isMeal = foods.length > 1;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <Link to="/search" className="text-gray-600 hover:text-gray-800 mr-2">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isMeal ? mealData.meal_name || 'Meal Details' : 'Food Details'}
          </h1>
        </div>
      </div>

      {/* Meal/Food Overview Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isMeal ? mealData.meal_name || 'Custom Meal' : foods[0]?.food_name}
            </h2>
            {!isMeal && foods[0]?.brand_name && (
              <p className="text-sm text-gray-600">{foods[0].brand_name}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">{Math.round(totalMacros.calories)} cal</p>
            <p className="text-xs text-gray-600">
              {isMeal ? `${foods.length} ingredients` : 'Total'}
            </p>
          </div>
        </div>

        {/* Macro Visualization */}
        <div className="mb-6">
          <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden">
            <div
              className="bg-purple-400"
              style={{ width: `${totalMacros.total === 0 ? 33 : Math.round((totalMacros.protein / totalMacros.total) * 100)}%` }}
            />
            <div
              className="bg-blue-400"
              style={{ width: `${totalMacros.total === 0 ? 33 : Math.round((totalMacros.carbs / totalMacros.total) * 100)}%` }}
            />
            <div
              className="bg-yellow-400"
              style={{ width: `${totalMacros.total === 0 ? 34 : Math.round((totalMacros.fat / totalMacros.total) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-600">
            <span>{totalMacros.total === 0 ? 33 : Math.round((totalMacros.protein / totalMacros.total) * 100)}% protein</span>
            <span>{totalMacros.total === 0 ? 33 : Math.round((totalMacros.carbs / totalMacros.total) * 100)}% carbs</span>
            <span>{totalMacros.total === 0 ? 34 : Math.round((totalMacros.fat / totalMacros.total) * 100)}% fat</span>
          </div>
        </div>

        {/* Add to Diary Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
            <Plus size={16} className="mr-2" />
            Add to Diary
          </button>
        </div>
      </div>

      {/* Individual Food Items */}
      {isMeal && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
          {foods.map((food, foodIndex) => {
            const serving = food.servings[food.selectedServing];
            const quantity = parseFloat(food.quantity || '1');
            const foodCalories = (parseFloat(serving?.calories || '0')) * quantity;

            return (
              <div key={food.food_id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{food.food_name}</h4>
                    {food.brand_name && (
                      <p className="text-sm text-gray-600">{food.brand_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{Math.round(foodCalories)} cal</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(foodIndex, quantity - 0.5)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={quantity <= 0.5}
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => updateQuantity(foodIndex, parseFloat(e.target.value) || 1)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0.1"
                      step="0.1"
                    />
                    <button
                      onClick={() => updateQuantity(foodIndex, quantity + 0.5)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Serving Selector */}
                  {food.servings.length > 1 && (
                    <select
                      className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={food.selectedServing}
                      onChange={(e) => updateServingSelection(foodIndex, parseInt(e.target.value))}
                    >
                      {food.servings.map((serving: Serving, index: number) => (
                        <option key={serving.serving_id || index} value={index}>
                          {serving.serving_description || serving.measurement_description || `Serving ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Food Quantity Controls */}
      {!isMeal && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(0, parseFloat(foods[0]?.quantity || '1') - 0.5)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                disabled={parseFloat(foods[0]?.quantity || '1') <= 0.5}
              >
                <Minus size={16} className="text-gray-600" />
              </button>
              <input
                type="number"
                value={parseFloat(foods[0]?.quantity || '1')}
                onChange={(e) => updateQuantity(0, parseFloat(e.target.value) || 1)}
                className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.1"
                step="0.1"
              />
              <button
                onClick={() => updateQuantity(0, parseFloat(foods[0]?.quantity || '1') + 0.5)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Serving Selector for Single Food */}
          {foods[0]?.servings.length > 1 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Serving Size</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={foods[0]?.selectedServing || 0}
                onChange={(e) => updateServingSelection(0, parseInt(e.target.value))}
              >
                {foods[0]?.servings.map((serving: Serving, index: number) => (
                  <option key={serving.serving_id || index} value={index}>
                    {serving.serving_description || serving.measurement_description || `Serving ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'nutrition'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
          onClick={() => setActiveTab('nutrition')}
        >
          <div className="flex justify-center items-center">
            <Info size={16} className="mr-2" />
            Nutrition
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'servings'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
          onClick={() => setActiveTab('servings')}
        >
          <div className="flex justify-center items-center">
            <List size={16} className="mr-2" />
            Serving Info
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          {foods.map((food) => {
            const serving = food.servings[food.selectedServing];
            const quantity = parseFloat(food.quantity || '1');
            return (
              <div key={food.food_id}>
                {isMeal && (
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    {food.food_name} {food.brand_name && `(${food.brand_name})`}
                  </h4>
                )}
                <NutritionCard
                  serving={serving}
                  quantity={quantity}
                />
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'servings' && (
        <div className="space-y-6">
          {foods.map((food, foodIndex) => (
            <div key={food.food_id} className="bg-white rounded-lg shadow-md p-6">
              {isMeal && (
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  {food.food_name} {food.brand_name && `(${food.brand_name})`}
                </h4>
              )}

              <h3 className="text-lg font-semibold mb-4 text-gray-800">Serving Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Quantity</span>
                  <span className="font-medium text-gray-800">{food.quantity}</span>
                </div>

                {food.servings.length > 1 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-gray-800">All Available Servings</h4>
                    <div className="space-y-2">
                      {food.servings.map((serving: Serving, index: number) => (
                        <div
                          key={serving.serving_id || index}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${index === food.selectedServing
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          onClick={() => updateServingSelection(foodIndex, index)}
                        >
                          <div className="flex justify-between">
                            <span className="text-gray-800">
                              {serving.serving_description || serving.measurement_description || `Serving ${index + 1}`}
                            </span>
                            <span className="font-medium text-gray-800">{serving.calories} cal</span>
                          </div>
                          {serving.metric_serving_amount && (
                            <p className="text-xs text-gray-600 mt-1">
                              {serving.metric_serving_amount} {serving.metric_serving_unit}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDetails;