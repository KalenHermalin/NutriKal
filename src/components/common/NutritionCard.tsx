import React from 'react';
import { motion } from 'framer-motion';
import { Serving } from '../../types';

interface NutritionCardProps {
  serving: Serving;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ serving }) => {
  // Calculate percentages based on recommended daily values
  const calculatePercentage = (value: string, dailyValue: number) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || dailyValue === 0) return 0;
    return Math.round((numValue / dailyValue) * 100);
  };

  // Macro nutrients with recommended daily values (in grams, except calories)
  const macros = [
    { 
      name: 'Calories', 
      value: serving.calories, 
      dailyValue: 2000, 
      unit: 'kcal',
      color: 'bg-primary'
    },
    { 
      name: 'Carbs', 
      value: serving.carbohydrate, 
      dailyValue: 275, 
      unit: 'g',
      color: 'bg-blue-400' 
    },
    { 
      name: 'Protein', 
      value: serving.protein, 
      dailyValue: 50, 
      unit: 'g',
      color: 'bg-purple-400' 
    },
    { 
      name: 'Fat', 
      value: serving.fat, 
      dailyValue: 78, 
      unit: 'g',
      color: 'bg-yellow-400' 
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
      <p className="text-sm text-muted mb-4">
        Serving: {serving.serving_description || serving.measurement_description}
      </p>

      <div className="space-y-4">
        {macros.map((macro) => {
          const value = parseFloat(macro.value);
          const percentage = calculatePercentage(macro.value, macro.dailyValue);
          
          return (
            <div key={macro.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{macro.name}</span>
                <span>
                  {!isNaN(value) ? value.toFixed(1) : '0'} {macro.unit} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${macro.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-medium mb-2">Additional Nutrients</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Fiber</span>
            <span>{serving.fiber || '0'}g</span>
          </div>
          <div className="flex justify-between">
            <span>Sugar</span>
            <span>{serving.sugar || '0'}g</span>
          </div>
          <div className="flex justify-between">
            <span>Sodium</span>
            <span>{serving.sodium || '0'}mg</span>
          </div>
          <div className="flex justify-between">
            <span>Potassium</span>
            <span>{serving.potassium || '0'}mg</span>
          </div>
          <div className="flex justify-between">
            <span>Vitamin C</span>
            <span>{serving.vitamin_c || '0'}%</span>
          </div>
          <div className="flex justify-between">
            <span>Calcium</span>
            <span>{serving.calcium || '0'}%</span>
          </div>
          <div className="flex justify-between">
            <span>Iron</span>
            <span>{serving.iron || '0'}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;
