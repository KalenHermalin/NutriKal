import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Loader2 } from 'lucide-react';
import { useSearchFood } from '../../hooks/useApi';
import { useFoodTracking } from '../../hooks/useFoodTracking';
import { Food, Serving } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface FoodSearchListProps {
  onFoodAdded?: () => void;
}

const FoodSearchList: React.FC<FoodSearchListProps> = ({ onFoodAdded }) => {
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedServing, setSelectedServing] = useState<Serving | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addFoodToLog } = useFoodTracking();

  const {
    data: foods,
    isLoading,
    isError,
    error
  } = useSearchFood(query, 0);

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    const servingsArray = food.servings;
    const defaultServing = Array.isArray(servingsArray) && servingsArray.length > 0
      ? servingsArray.find(s => s.is_default === "1") || servingsArray[0]
      : null;
    setSelectedServing(defaultServing);
    setQuantity(1);
  };

  const handleAddFood = async () => {
    if (!selectedFood || !selectedServing) return;

    setIsAdding(true);
    try {
      const calories = Math.round(parseFloat(selectedServing.calories) * quantity);
      const protein = Math.round(parseFloat(selectedServing.protein) * quantity * 10) / 10;
      const carbs = Math.round(parseFloat(selectedServing.carbohydrate) * quantity * 10) / 10;
      const fat = Math.round(parseFloat(selectedServing.fat) * quantity * 10) / 10;

      const success = await addFoodToLog(
        selectedFood.food_id,
        selectedFood.food_name,
        selectedFood.brand_name,
        `${quantity} × ${selectedServing.serving_description || selectedServing.measurement_description}`,
        calories,
        protein,
        carbs,
        fat
      );

      if (success) {
        setSelectedFood(null);
        setSelectedServing(null);
        setQuery('');
        onFoodAdded?.();
      }
    } catch (err) {
      console.error('Error adding food:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedFood(null);
    setSelectedServing(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted" />
        </div>
        <input
          type="text"
          className="input pl-10 pr-10"
          placeholder="Search foods to add..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-muted hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && query && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner text="Searching foods..." />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="card border-error/50 bg-error/10">
          <p className="text-error">Error: {(error as Error).message}</p>
        </div>
      )}

      {/* No Results */}
      {!isLoading && query && foods && foods.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg font-medium">No foods found</p>
          <p className="text-muted">Try a different search term</p>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && foods && foods.length > 0 && !selectedFood && (
        <motion.div
          className="space-y-2 max-h-96 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {foods.map((food) => {
            const servingsArray = food.servings;
            const defaultServing = Array.isArray(servingsArray)
              ? servingsArray.find(s => s.is_default === "1") || servingsArray[0]
              : null;
            const calories = servingsArray[0].calories;

            return (
              <motion.div
                key={food.food_id}
                className="card cursor-pointer hover:shadow-md transition-shadow p-4"
                onClick={() => handleFoodSelect(food)}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{food.food_name}</h3>
                    {food.brand_name && (
                      <p className="text-sm text-muted">{food.brand_name}</p>
                    )}
                    <p className="text-xs text-muted">
                      {defaultServing?.serving_description || defaultServing?.measurement_description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{calories} cal</p>
                    <Plus className="h-5 w-5 text-primary ml-auto mt-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Food Selection Modal */}
      <AnimatePresence>
        {selectedFood && selectedServing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card border-primary/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedFood.food_name}</h3>
                {selectedFood.brand_name && (
                  <p className="text-sm text-muted">{selectedFood.brand_name}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Serving Selection */}
            {selectedFood.servings?.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Serving Size</label>
                <select
                  className="input"
                  value={selectedServing.serving_id}
                  onChange={(e) => {
                    const serving = selectedFood.servings?.find(s => s.serving_id === e.target.value);
                    if (serving) setSelectedServing(serving);
                  }}
                >
                  {selectedFood.servings?.map((serving) => (
                    <option key={serving.serving_id} value={serving.serving_id}>
                      {serving.serving_description || serving.measurement_description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(0.25, quantity - 0.25))}
                  className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                  className="input text-center flex-1"
                />
                <button
                  onClick={() => setQuantity(quantity + 0.25)}
                  className="btn btn-outline w-10 h-10 p-0 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nutrition Preview */}
            <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-background rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted">Calories</p>
                <p className="font-semibold">{Math.round(parseFloat(selectedServing.calories) * quantity)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">Protein</p>
                <p className="font-semibold">{Math.round(parseFloat(selectedServing.protein) * quantity * 10) / 10}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">Carbs</p>
                <p className="font-semibold">{Math.round(parseFloat(selectedServing.carbohydrate) * quantity * 10) / 10}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">Fat</p>
                <p className="font-semibold">{Math.round(parseFloat(selectedServing.fat) * quantity * 10) / 10}g</p>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddFood}
              disabled={isAdding}
              className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add to Log
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      {!query && !selectedFood && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3 text-muted">Popular Foods</h3>
          <div className="flex flex-wrap gap-2">
            {['Chicken Breast', 'Rice', 'Eggs', 'Banana', 'Apple', 'Oatmeal', 'Salmon', 'Broccoli'].map((term) => (
              <button
                key={term}
                className="btn btn-outline py-1 px-3 text-sm"
                onClick={() => setQuery(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearchList;
