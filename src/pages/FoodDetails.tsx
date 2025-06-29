import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Info, List, Minus } from 'lucide-react';
import NutritionCard from '../components/common/NutritionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MealServerResponse, Food, Serving } from '../types';

interface FoodDetailsProps {
  mealData?: MealServerResponse;
}

interface FoodWithQuantity extends Food {
  currentQuantity: number;
  selectedServingIndex: number;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({ mealData: propMealData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ foodId: string }>();
  const [activeTab, setActiveTab] = useState<'nutrition' | 'servings'>('nutrition');

  // Get meal data from props or location state
  const mealData = propMealData || (location.state?.mealData as MealServerResponse);

  // State for managing food quantities and serving selections
  const [foodsWithQuantity, setFoodsWithQuantity] = useState<FoodWithQuantity[]>([]);

  // Initialize foods with quantities
  useEffect(() => {
    if (mealData?.ingredients) {
      const initializedFoods = mealData.ingredients.map((food) => ({
        ...food,
        currentQuantity: parseFloat(food.quantity || '1'),
        selectedServingIndex: 0,
      }));
      setFoodsWithQuantity(initializedFoods);
    }
  }, [mealData]);

  // Redirect if no data available
  useEffect(() => {
    if (!mealData && !propMealData) {
      console.error('No meal data available', { locationState: location.state, params });
      navigate('/search', { replace: true });
    }
  }, [mealData, navigate, propMealData, location.state, params]);

  if (!mealData || foodsWithQuantity.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading food details..." />
      </div>
    );
  }

  // Update quantity for a specific food
  const updateQuantity = (foodIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setFoodsWithQuantity(prev =>
      prev.map((food, index) =>
        index === foodIndex ? { ...food, currentQuantity: newQuantity } : food
      )
    );
  };

  // Update serving selection for a specific food
  const updateServingSelection = (foodIndex: number, servingIndex: number) => {
    setFoodsWithQuantity(prev =>
      prev.map((food, index) =>
        index === foodIndex ? { ...food, selectedServingIndex: servingIndex } : food
      )
    );
  };

  // Calculate total macros for all foods
  const calculateTotalMacros = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    foodsWithQuantity.forEach((food) => {
      const serving = food.servings[food.selectedServingIndex];
      if (serving) {
        const quantity = food.currentQuantity;
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
  const isMeal = foodsWithQuantity.length > 1;

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
              {isMeal ? mealData.meal_name || 'Custom Meal' : foodsWithQuantity[0]?.food_name}
            </h2>
            {!isMeal && foodsWithQuantity[0]?.brand_name && (
              <p className="text-sm text-gray-600">{foodsWithQuantity[0].brand_name}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">{Math.round(totalMacros.calories)} cal</p>
            <p className="text-xs text-gray-600">
              {isMeal ? `${foodsWithQuantity.length} ingredients` : 'Total'}
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
          {foodsWithQuantity.map((food, foodIndex) => {
            const serving = food.servings[food.selectedServingIndex];
            const foodCalories = (parseFloat(serving?.calories || '0')) * food.currentQuantity;

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
                      onClick={() => updateQuantity(foodIndex, food.currentQuantity - 0.5)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={food.currentQuantity <= 0.5}
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <input
                      type="number"
                      value={food.currentQuantity}
                      onChange={(e) => updateQuantity(foodIndex, parseFloat(e.target.value) || 1)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0.1"
                      step="0.1"
                    />
                    <button
                      onClick={() => updateQuantity(foodIndex, food.currentQuantity + 0.5)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Serving Selector */}
                  {food.servings.length > 1 && (
                    <select
                      className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={food.selectedServingIndex}
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
                onClick={() => updateQuantity(0, foodsWithQuantity[0].currentQuantity - 0.5)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                disabled={foodsWithQuantity[0]?.currentQuantity <= 0.5}
              >
                <Minus size={16} className="text-gray-600" />
              </button>
              <input
                type="number"
                value={foodsWithQuantity[0]?.currentQuantity || 1}
                onChange={(e) => updateQuantity(0, parseFloat(e.target.value) || 1)}
                className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.1"
                step="0.1"
              />
              <button
                onClick={() => updateQuantity(0, foodsWithQuantity[0].currentQuantity + 0.5)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Serving Selector for Single Food */}
          {foodsWithQuantity[0]?.servings.length > 1 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Serving Size</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={foodsWithQuantity[0]?.selectedServingIndex || 0}
                onChange={(e) => updateServingSelection(0, parseInt(e.target.value))}
              >
                {foodsWithQuantity[0]?.servings.map((serving: Serving, index: number) => (
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
          {foodsWithQuantity.map((food) => {
            const serving = food.servings[food.selectedServingIndex];
            return (
              <div key={food.food_id}>
                {isMeal && (
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    {food.food_name} {food.brand_name && `(${food.brand_name})`}
                  </h4>
                )}
                <NutritionCard
                  serving={serving}
                  quantity={food.currentQuantity}
                />
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'servings' && (
        <div className="space-y-6">
          {foodsWithQuantity.map((food, foodIndex) => (
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
                  <span className="font-medium text-gray-800">{food.currentQuantity}</span>
                </div>

                {food.servings.length > 1 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-gray-800">All Available Servings</h4>
                    <div className="space-y-2">
                      {food.servings.map((serving: Serving, index: number) => (
                        <div
                          key={serving.serving_id || index}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${index === food.selectedServingIndex
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