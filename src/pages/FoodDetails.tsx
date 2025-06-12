import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import NutritionCard from '../components/common/NutritionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';

// Mock food data for demonstration
const mockFoods = {
  '1001': {
    food_id: 1001,
    food_name: "Grilled Salmon",
    brand_name: "Generic",
    servings: [
      {
        serving_id: "1",
        serving_description: "100g",
        serving_url: "",
        metric_serving_amount: "100",
        metric_serving_unit: "g",
        number_of_units: "1",
        measurement_description: "100g serving",
        is_default: "true",
        calories: "206",
        carbohydrate: "0",
        protein: "22",
        fat: "13",
        saturated_fat: "3",
        polyunsaturated_fat: "4",
        monounsaturated_fat: "5",
        trans_fat: "0",
        cholesterol: "60",
        sodium: "60",
        potassium: "380",
        fiber: "0",
        sugar: "0",
        added_sugars: "0",
        vitamin_d: "10",
        vitamin_a: "1",
        vitamin_c: "0",
        calcium: "1",
        iron: "1"
      }
    ]
  },
  '1002': {
    food_id: 1002,
    food_name: "Mixed Greens",
    brand_name: "Generic",
    servings: [
      {
        serving_id: "1",
        serving_description: "100g",
        serving_url: "",
        metric_serving_amount: "100",
        metric_serving_unit: "g",
        number_of_units: "1",
        measurement_description: "100g serving",
        is_default: "true",
        calories: "25",
        carbohydrate: "5",
        protein: "2",
        fat: "0",
        saturated_fat: "0",
        polyunsaturated_fat: "0",
        monounsaturated_fat: "0",
        trans_fat: "0",
        cholesterol: "0",
        sodium: "30",
        potassium: "370",
        fiber: "2",
        sugar: "1",
        added_sugars: "0",
        vitamin_d: "0",
        vitamin_a: "70",
        vitamin_c: "40",
        calcium: "5",
        iron: "10"
      }
    ]
  }
};

const FoodDetails = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const [selectedServingIndex, setSelectedServingIndex] = React.useState(0);
  
  // In a real app, this would come from an API
  const food = mockFoods[foodId as keyof typeof mockFoods];
  const isLoading = !food && foodId !== undefined;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading food details..." />
      </div>
    );
  }
  
  if (!food) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium">Food not found</p>
        <Link to="/search" className="text-primary hover:underline mt-2 inline-block">
          Go back to search
        </Link>
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
