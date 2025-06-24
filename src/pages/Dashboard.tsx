import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useFoodTracking } from '../hooks/useFoodTracking';
import CircularProgress from '../components/common/CircularProgress';
import FoodSearchList from '../components/common/FoodSearchList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const {
    dailyTracking,
    foodLogs,
    isLoading,
    error,
    removeFoodFromLog,
    refreshData
  } = useFoodTracking();

  const [showAddFood, setShowAddFood] = React.useState(false);
  const [circleSize, setCircleSize] = useState(70);

  // Adjust circle size based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 340) {
        setCircleSize(60);
      } else if (width < 400) {
        setCircleSize(80);
      } else if (width < 500) {
        setCircleSize(90);
      } else {
        setCircleSize(120);
      }
    };

    // Set initial size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading your nutrition data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-error/50 bg-error/10">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (!dailyTracking) {
    return (
      <div className="card">
        <p className="text-muted">Unable to load tracking data. Please try refreshing the page.</p>
      </div>
    );
  }

  const caloriesRemaining = Math.max(0, dailyTracking.calorieTarget - dailyTracking.currentCalories);
  const caloriePercentage = Math.min((dailyTracking.currentCalories / dailyTracking.calorieTarget) * 100, 100);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Daily Calories */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Daily Calories</h2>
          <span className="text-xs text-muted">Today</span>
        </div>

        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-3xl font-bold">{dailyTracking.currentCalories}</p>
            <p className="text-xs text-muted">of {dailyTracking.calorieTarget} calories</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-primary">{caloriesRemaining}</p>
            <p className="text-xs text-muted">calories remaining</p>
          </div>
        </div>

        <div className="w-full bg-muted/30 rounded-full h-3 mb-4">
          <motion.div
            className="bg-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${caloriePercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <button
          onClick={() => setShowAddFood(!showAddFood)}
          className="btn btn-primary py-2 px-4 w-full flex items-center justify-center"
        >
          <Plus size={16} className="mr-2" />
          {showAddFood ? 'Hide Food Search' : 'Add Food'}
        </button>
      </motion.div>

      {/* Add Food Section */}
      {showAddFood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Add Food to Log</h3>
          <FoodSearchList onFoodAdded={() => { setShowAddFood(false); refreshData() }} />
        </motion.div>
      )}

      {/* Macronutrients */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-6">Macronutrients</h2>
        <div className="grid grid-cols-3 gap-4">
          <CircularProgress
            value={dailyTracking.currentProtein}
            max={dailyTracking.proteinTarget}
            color="purple-400"
            label="Protein"
            size={circleSize}
            strokeWidth={circleSize < 90 ? 8 : 12}
          />
          <CircularProgress
            value={dailyTracking.currentCarbs}
            max={dailyTracking.carbsTarget}
            color="blue-400"
            label="Carbs"
            size={circleSize}
            strokeWidth={circleSize < 90 ? 8 : 12}
          />
          <CircularProgress
            value={dailyTracking.currentFat}
            max={dailyTracking.fatTarget}
            color="yellow-400"
            label="Fat"
            size={circleSize}
            strokeWidth={circleSize < 90 ? 8 : 12}
          />
        </div>
      </motion.div>

      {/* Today's Food Log */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today's Food Log</h2>
          <span className="text-sm text-muted">{foodLogs.length} items</span>
        </div>

        {foodLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted">No foods logged today</p>
            <p className="text-sm text-muted mt-1">Add your first meal to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {foodLogs
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((log) => (
                <motion.div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-muted/10 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{log.foodName}</h3>
                      <Clock size={12} className="text-muted" />
                      <span className="text-xs text-muted">{formatTime(log.timestamp)}</span>
                    </div>
                    {log.brandName && (
                      <p className="text-sm text-muted">{log.brandName}</p>
                    )}
                    <p className="text-xs text-muted">{log.servingSize}</p>
                    <div className="flex gap-4 text-xs mt-1">
                      <span className="text-purple-400">P: {log.protein}g</span>
                      <span className="text-blue-400">C: {log.carbs}g</span>
                      <span className="text-yellow-400">F: {log.fat}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">{log.calories} cal</p>
                    </div>
                    <button
                      onClick={() => removeFoodFromLog(log.id)}
                      className="opacity-0 group-hover:opacity-100 text-error hover:bg-error/10 p-1 rounded transition-all"
                      aria-label="Remove food"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
