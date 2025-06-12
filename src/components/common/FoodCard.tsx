import React from 'react';
import { Link } from 'react-router-dom';
import { Food } from '../../types';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodCardProps {
  food: Food;
  showDetails?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, showDetails = true }) => {
  // Get default serving or first serving if no default
  const defaultServing = food.servings.find(s => s.is_default === "true") || food.servings[0];
  const calories = defaultServing?.calories || '0';
  
  // Calculate macro percentages for the visualization
  const calculateMacroPercentages = () => {
    if (!defaultServing) return { protein: 0, carbs: 0, fat: 0 };
    
    const protein = parseFloat(defaultServing.protein) || 0;
    const carbs = parseFloat(defaultServing.carbohydrate) || 0;
    const fat = parseFloat(defaultServing.fat) || 0;
    
    const total = protein + carbs + fat;
    if (total === 0) return { protein: 33, carbs: 33, fat: 34 };
    
    return {
      protein: Math.round((protein / total) * 100),
      carbs: Math.round((carbs / total) * 100),
      fat: Math.round((fat / total) * 100),
    };
  };
  
  const macros = calculateMacroPercentages();

  return (
    <motion.div 
      className="card hover:shadow-md transition-shadow"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{food.food_name}</h3>
          {food.brand_name && (
            <p className="text-sm text-muted">{food.brand_name}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold">{calories} cal</p>
          <p className="text-xs text-muted">
            {defaultServing?.serving_description || defaultServing?.measurement_description || 'Per serving'}
          </p>
        </div>
      </div>
      
      {showDetails && (
        <>
          <div className="flex gap-1 mt-4 h-2 w-full">
            <div className="bg-purple-400 rounded-l-full" style={{ width: `${macros.protein}%` }} />
            <div className="bg-blue-400" style={{ width: `${macros.carbs}%` }} />
            <div className="bg-yellow-400 rounded-r-full" style={{ width: `${macros.fat}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted">
            <span>{macros.protein}% protein</span>
            <span>{macros.carbs}% carbs</span>
            <span>{macros.fat}% fat</span>
          </div>
          
          <Link 
            to={`/food/${food.food_id}`}
            className="mt-4 flex items-center justify-end text-primary hover:underline text-sm"
          >
            View details
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </>
      )}
    </motion.div>
  );
};

export default FoodCard;
