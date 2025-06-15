import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import NutritionCard from '../components/common/NutritionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { Food } from '../types';

interface MealDetailsProps {
  meal?: Food[];
}

const MealDetails: React.FC<MealDetailsProps> = ({ meal: propMeal }) => {
  const location = useLocation();
  const meal = propMeal || (location.state?.meal as Food[]);

  if (!meal) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading meal details..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/analyze" className="text-muted hover:text-foreground mr-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Meal Details</h1>
      </div>

      {meal.map((food) => (
        <motion.div
          key={food.food_id}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">{food.food_name}</h2>
          {food.brand_name && (
            <p className="text-sm text-muted">{food.brand_name}</p>
          )}

          <div className="flex justify-end mt-4">
            <button className="btn btn-primary py-2 px-4">
              <Plus size={16} className="mr-2" />
              Add to Diary
            </button>
          </div>

          <NutritionCard serving={food.servings[0]} />
        </motion.div>
      ))}
    </div>
  );
};

export default MealDetails;
