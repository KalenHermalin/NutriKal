import React from 'react';
import { Serving } from '../../types';

interface NutritionCardProps {
  serving: Serving;
  quantity?: number;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ serving, quantity = 1 }) => {
  // Handle case where serving might be undefined or malformed
  if (!serving) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Nutrition Facts</h3>
        <p className="text-red-500">No nutrition information available</p>
      </div>
    );
  }

  // Helper function to get value and multiply by quantity
  const getValue = (value: string | undefined): number => {
    return parseFloat(value || '0') * quantity;
  };

  // Helper function to format values
  const formatValue = (value: number, unit: string = ''): string => {
    return value % 1 === 0 ? `${value}${unit}` : `${value.toFixed(1)}${unit}`;
  };

  // Calculate percentages based on recommended daily values
  const calculatePercentage = (value: string | undefined, dailyValue: number) => {
    if (!value) return 0;
    const numValue = getValue(value);
    if (isNaN(numValue) || dailyValue === 0) return 0;
    return Math.round((numValue / dailyValue) * 100);
  };

  // Macro nutrients with recommended daily values (in grams, except calories)
  const macros = [
    {
      name: 'Calories',
      value: serving?.calories || '0',
      dailyValue: 2000,
      unit: 'kcal',
      color: 'bg-blue-600'
    },
    {
      name: 'Carbs',
      value: serving?.carbohydrate || '0',
      dailyValue: 275,
      unit: 'g',
      color: 'bg-blue-400'
    },
    {
      name: 'Protein',
      value: serving?.protein || '0',
      dailyValue: 50,
      unit: 'g',
      color: 'bg-purple-400'
    },
    {
      name: 'Fat',
      value: serving?.fat || '0',
      dailyValue: 78,
      unit: 'g',
      color: 'bg-yellow-400'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Nutrition Facts</h3>
      <p className="text-sm text-gray-600 mb-4">
        Serving: {serving?.serving_description || serving?.measurement_description || 'Standard serving'}
        {quantity !== 1 && ` × ${quantity}`}
      </p>

      <div className="space-y-4">
        {macros.map((macro) => {
          const value = getValue(macro.value);
          const percentage = calculatePercentage(macro.value, macro.dailyValue);

          return (
            <div key={macro.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{macro.name}</span>
                <span className="text-gray-800">
                  {!isNaN(value) ? formatValue(value) : '0'} {macro.unit} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${macro.color} transition-all duration-800 ease-out`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2 text-gray-800">Additional Nutrients</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Fiber</span>
            <span className="text-gray-800">{formatValue(getValue(serving?.fiber), 'g')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sugar</span>
            <span className="text-gray-800">{formatValue(getValue(serving?.sugar), 'g')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sodium</span>
            <span className="text-gray-800">{formatValue(getValue(serving?.sodium), 'mg')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Potassium</span>
            <span className="text-gray-800">{formatValue(getValue(serving?.potassium), 'mg')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vitamin C</span>
            <span className="text-gray-800">{formatValue(getValue(serving.vitamin_c), '%')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Calcium</span>
            <span className="text-gray-800">{formatValue(getValue(serving.calcium), '%')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Iron</span>
            <span className="text-gray-800">{formatValue(getValue(serving.iron), '%')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;