import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { Food } from '../types';

interface MealDetailsProps {
  meal?: Food[];
}

const MealDetails: React.FC<MealDetailsProps> = ({ meal: propMeal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const meal = propMeal || (location.state?.meal as Food[]);

  // If meal is not available, redirect to analyze page
  React.useEffect(() => {
    if (!meal) {
      console.error('No meal data available', { locationState: location.state });
      navigate('/analyze', { replace: true });
    }
  }, [meal, navigate, location.state]);

  if (!meal) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading meal details..." />
      </div>
    );
  }

  // Calculate total nutrition for the entire meal
  const calculateTotalNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meal.forEach(food => {
      // Make sure servings is an array
      const servings = Array.isArray(food.servings)
        ? food.servings
        : (food.servings as any)?.serving
          ? (Array.isArray((food.servings as any).serving)
            ? (food.servings as any).serving
            : [(food.servings as any).serving])
          : [];

      if (servings && servings.length > 0) {
        const serving = servings[0];
        totalCalories += parseFloat(serving.calories) || 0;
        totalProtein += parseFloat(serving.protein) || 0;
        totalCarbs += parseFloat(serving.carbohydrate) || 0;
        totalFat += parseFloat(serving.fat) || 0;
      }
    });

    return {
      calories: totalCalories.toFixed(0),
      protein: totalProtein.toFixed(1),
      carbs: totalCarbs.toFixed(1),
      fat: totalFat.toFixed(1),
      proteinPct: totalProtein + totalCarbs + totalFat > 0
        ? Math.round((totalProtein / (totalProtein + totalCarbs + totalFat)) * 100)
        : 33,
      carbsPct: totalProtein + totalCarbs + totalFat > 0
        ? Math.round((totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100)
        : 33,
      fatPct: totalProtein + totalCarbs + totalFat > 0
        ? Math.round((totalFat / (totalProtein + totalCarbs + totalFat)) * 100)
        : 34
    };
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b border-border">
        <div className="flex items-center">
          <Link to="/analyze" className="text-muted hover:text-foreground mr-2">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold">Meal Details</h1>
        </div>
      </div>

      {/* Meal Summary Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Complete Meal</h2>
            <p className="text-sm text-muted">{meal.length} food items</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{totalNutrition.calories} cal</p>
            <p className="text-xs text-muted">Total</p>
          </div>
        </div>

        {/* Macro Visualization */}
        <div className="mt-6">
          <div className="flex gap-1 mt-2 h-2 w-full">
            <div className="bg-purple-400 rounded-l-full" style={{ width: `${totalNutrition.proteinPct}%` }} />
            <div className="bg-blue-400" style={{ width: `${totalNutrition.carbsPct}%` }} />
            <div className="bg-yellow-400 rounded-r-full" style={{ width: `${totalNutrition.fatPct}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted">
            <span>{totalNutrition.proteinPct}% protein</span>
            <span>{totalNutrition.carbsPct}% carbs</span>
            <span>{totalNutrition.fatPct}% fat</span>
          </div>
        </div>

        {/* Macronutrient summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-muted mb-1">Protein</p>
            <p className="font-semibold">{totalNutrition.protein}g</p>
          </div>
          <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-muted mb-1">Carbs</p>
            <p className="font-semibold">{totalNutrition.carbs}g</p>
          </div>
          <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-muted mb-1">Fat</p>
            <p className="font-semibold">{totalNutrition.fat}g</p>
          </div>
        </div>

        {/* Add to Diary Button */}
        <div className="flex justify-end mt-6">
          <button className="btn btn-primary py-2 px-4">
            <Plus size={16} className="mr-2" />
            Add Entire Meal to Diary
          </button>
        </div>
      </motion.div>

      {/* Individual Food Items */}
      <h2 className="text-lg font-semibold mt-8 mb-4">Food Items</h2>
      <div className="space-y-4">
        {meal.map((food, index) => {
          // Make sure servings is an array
          const servings = Array.isArray(food.servings)
            ? food.servings
            : (food.servings as any)?.serving
              ? (Array.isArray((food.servings as any).serving)
                ? (food.servings as any).serving
                : [(food.servings as any).serving])
              : [];

          if (!servings || servings.length === 0) {
            console.error('No serving information available for food:', food);
            return (
              <motion.div
                key={food.food_id || `food-${index}`}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-xl font-semibold">{food.food_name}</h2>
                {food.brand_name && (
                  <p className="text-sm text-muted">{food.brand_name}</p>
                )}
                <p className="text-red-500 mt-2">Error: Missing serving information</p>
              </motion.div>
            );
          }

          const serving = servings[0];

          // Calculate macro percentages
          const protein = parseFloat(serving.protein) || 0;
          const carbs = parseFloat(serving.carbohydrate) || 0;
          const fat = parseFloat(serving.fat) || 0;
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
                  <p className="font-semibold">{serving.calories || '0'} cal</p>
                  <p className="text-xs text-muted">
                    {serving.serving_description || serving.measurement_description || 'Per serving'}
                  </p>
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
                  <span>{proteinPct}% protein</span>
                  <span>{carbsPct}% carbs</span>
                  <span>{fatPct}% fat</span>
                </div>
              </div>

              {/* Individual Add Button */}
              <div className="flex justify-end mt-4">
                <Link to={`/food/${food.food_id}`} state={{ food }} className="text-primary text-sm mr-4 hover:underline flex items-center">
                  View Details
                </Link>
                <button className="btn btn-outline py-1 px-3 text-sm">
                  <Plus size={14} className="mr-1" />
                  Add
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MealDetails;
