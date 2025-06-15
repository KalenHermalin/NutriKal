import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import NutritionCard from '../components/common/NutritionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { Food } from '../types';

interface FoodDetailsProps {
  food?: Food;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({ food: propFood }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Check if food data is passed via location state
  const food = propFood || (location.state?.food as Food);
  const [selectedServingIndex, setSelectedServingIndex] = React.useState(0);

  // If food is not available, redirect to search
  React.useEffect(() => {
    if (!food && !propFood) {
      navigate('/search', { replace: true });
    }
  }, [food, navigate, propFood]);

  if (!food) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading food details..." />
      </div>
    );
  }

  const selectedServing = food.servings[selectedServingIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/search" className="text-muted hover:text-foreground mr-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Food Details</h1>
      </div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold">{food.food_name}</h2>
        {food.brand_name && (
          <p className="text-sm text-muted">{food.brand_name}</p>
        )}

        {food.servings.length > 1 && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Serving Size</label>
            <select
              className="input"
              value={selectedServingIndex}
              onChange={(e) => setSelectedServingIndex(parseInt(e.target.value))}
            >
              {food.servings.map((serving, index) => (
                <option key={serving.serving_id} value={index}>
                  {serving.serving_description || serving.measurement_description}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button className="btn btn-primary py-2 px-4">
            <Plus size={16} className="mr-2" />
            Add to Diary
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <NutritionCard serving={selectedServing} />
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">Serving Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted">Serving Size</span>
            <span>{selectedServing.serving_description || selectedServing.measurement_description}</span>
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
        </div>
      </motion.div>
    </div>
  );
};

export default FoodDetails;
