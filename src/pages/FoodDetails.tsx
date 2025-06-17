import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Info, List } from 'lucide-react';
import NutritionCard from '../components/common/NutritionCard';
import MacroChart from '../components/common/MacroChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { Food } from '../types';

interface FoodDetailsProps {
  food?: Food;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({ food: propFood }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ foodId: string }>();
  const [activeTab, setActiveTab] = useState<'nutrition' | 'servings'>('nutrition');

  // Check if food data is passed via location state
  const food = propFood || (location.state?.food as Food);
  const [selectedServingIndex, setSelectedServingIndex] = React.useState(0);

  // If food is not available, redirect to search
  React.useEffect(() => {
    if (!food && !propFood) {
      console.error('No food data available', { locationState: location.state, params });
      navigate('/search', { replace: true });
    }
  }, [food, navigate, propFood, location.state, params]);

  if (!food) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading food details..." />
      </div>
    );
  }

  // Make sure servings is an array
  const servings = Array.isArray(food.servings)
    ? food.servings
    : (food.servings as any)?.serving
      ? (Array.isArray((food.servings as any).serving)
        ? (food.servings as any).serving
        : [(food.servings as any).serving])
      : [];

  // Check if servings array has data  
  if (!servings || servings.length === 0) {
    console.error('No serving information available for food:', food);
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error: Missing serving information</p>
          <button onClick={() => navigate('/search')} className="btn mt-4">
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  const selectedServing = servings[selectedServingIndex];

  // Calculate macro percentages for the visualization
  const calculateMacros = () => {
    if (!selectedServing) return { protein: 0, carbs: 0, fat: 0, total: 0 };

    const protein = parseFloat(selectedServing.protein) || 0;
    const carbs = parseFloat(selectedServing.carbohydrate) || 0;
    const fat = parseFloat(selectedServing.fat) || 0;

    const total = protein + carbs + fat;

    return {
      protein,
      carbs,
      fat,
      total
    };
  };

  const macros = calculateMacros();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b border-border">
        <div className="flex items-center">
          <Link to="/search" className="text-muted hover:text-foreground mr-2">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-2xl font-bold">Food Details</h1>
        </div>
      </div>

      {/* Food Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{food.food_name}</h2>
            {food.brand_name && (
              <p className="text-sm text-muted">{food.brand_name}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold">{selectedServing.calories} cal</p>
            <p className="text-xs text-muted">
              {selectedServing.serving_description || selectedServing.measurement_description || 'Per serving'}
            </p>
          </div>
        </div>

        {/* Serving Selector */}
        {servings.length > 1 && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Serving Size</label>
            <select
              className="input"
              value={selectedServingIndex}
              onChange={(e) => setSelectedServingIndex(parseInt(e.target.value))}
            >
              {servings.map((serving: any, index: number) => (
                <option key={serving.serving_id || index} value={index}>
                  {serving.serving_description || serving.measurement_description || `Serving ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Macro Visualization */}
        <div className="mt-6">
          <div className="flex gap-1 mt-2 h-2 w-full">
            <div className="bg-purple-400 rounded-l-full" style={{ width: `${macros.total === 0 ? 33 : Math.round((macros.protein / macros.total) * 100)}%` }} />
            <div className="bg-blue-400" style={{ width: `${macros.total === 0 ? 33 : Math.round((macros.carbs / macros.total) * 100)}%` }} />
            <div className="bg-yellow-400 rounded-r-full" style={{ width: `${macros.total === 0 ? 34 : Math.round((macros.fat / macros.total) * 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-1 text-muted">
            <span>{macros.total === 0 ? 33 : Math.round((macros.protein / macros.total) * 100)}% protein</span>
            <span>{macros.total === 0 ? 33 : Math.round((macros.carbs / macros.total) * 100)}% carbs</span>
            <span>{macros.total === 0 ? 34 : Math.round((macros.fat / macros.total) * 100)}% fat</span>
          </div>
        </div>

        {/* Add to Diary Button */}
        <div className="flex justify-end mt-6">
          <button className="btn btn-primary py-2 px-4">
            <Plus size={16} className="mr-2" />
            Add to Diary
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'nutrition' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <div className="flex justify-center items-center">
            <Info size={16} className="mr-2" />
            Nutrition
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'servings' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <MacroChart
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
          />

          <NutritionCard serving={selectedServing} />
        </motion.div>
      )}

      {activeTab === 'servings' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Serving Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted">Serving Size</span>
              <span>{selectedServing.serving_description || selectedServing.measurement_description || 'Standard serving'}</span>
            </div>
            {selectedServing.metric_serving_amount && (
              <div className="flex justify-between">
                <span className="text-muted">Metric Amount</span>
                <span>{selectedServing.metric_serving_amount} {selectedServing.metric_serving_unit}</span>
              </div>
            )}
            {selectedServing.number_of_units && (
              <div className="flex justify-between">
                <span className="text-muted">Number of Units</span>
                <span>{selectedServing.number_of_units}</span>
              </div>
            )}

            {/* List all available servings */}
            {servings.length > 1 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">All Available Servings</h4>
                <div className="space-y-2">
                  {servings.map((serving: any, index: number) => (
                    <div
                      key={serving.serving_id || index}
                      className={`p-3 rounded-lg border ${index === selectedServingIndex ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer hover:bg-muted/10`}
                      onClick={() => setSelectedServingIndex(index)}
                    >
                      <div className="flex justify-between">
                        <span>{serving.serving_description || serving.measurement_description || `Serving ${index + 1}`}</span>
                        <span className="font-medium">{serving.calories} cal</span>
                      </div>
                      {serving.metric_serving_amount && (
                        <p className="text-xs text-muted mt-1">
                          {serving.metric_serving_amount} {serving.metric_serving_unit}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FoodDetails;
