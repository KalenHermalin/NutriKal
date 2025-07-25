import { useState, useEffect } from 'react';
import { foodTrackingDB, DailyTracking, UserSettings, MealLog } from '../utils/indexedDB';

export const useFoodTracking = () => {
  const [dailyTracking, setDailyTracking] = useState<DailyTracking | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [foodLogs, setFoodLogs] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const date = new Date();
  const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      await foodTrackingDB.init();

      // Load user settings
      const settings = await foodTrackingDB.getUserSettings();
      setUserSettings(settings);

      // Check for daily reset
      await checkDailyReset(settings);

      // Load today's food logs
      const logs = await foodTrackingDB.getFoodLogs(today);
      setFoodLogs(logs);

      setError(null);
    } catch (err) {
      setError('Failed to initialize food tracking data');
      console.error('Food tracking initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkDailyReset = async (settings: UserSettings) => {
    try {
      let tracking = await foodTrackingDB.getDailyTracking(today);

      if (!tracking) {
        // Create new day tracking
        tracking = await foodTrackingDB.createNewDayTracking(today, settings);
      }

      setDailyTracking(tracking);
    } catch (err) {
      console.error('Daily reset check error:', err);
    }
  };

  const addFoodToLog = async (
    mealLog: MealLog
  ) => {
    try {
      await foodTrackingDB.addFoodLog(mealLog);
      await foodTrackingDB.updateDailyTotals(today, mealLog.calories, mealLog.protein, mealLog.carbs, mealLog.fat);

      // Refresh data
      const updatedLogs = await foodTrackingDB.getFoodLogs(today);
      const updatedTracking = await foodTrackingDB.getDailyTracking(today);

      setFoodLogs(updatedLogs);
      setDailyTracking(updatedTracking);

      return true;
    } catch (err) {
      console.error('Add food log error:', err);
      setError('Failed to add food to log');
      return false;
    }
  };

  const removeFoodFromLog = async (logId: string) => {
    try {
      const log = foodLogs.find(l => l.id === logId);
      if (!log) return false;
      await foodTrackingDB.deleteFoodLog(logId);
      await foodTrackingDB.updateDailyTotals(
        today,
        -log.calories,
        -log.protein,
        -log.carbs,
        -log.fat
      );

      // Refresh data
      const updatedLogs = await foodTrackingDB.getFoodLogs(today);
      const updatedTracking = await foodTrackingDB.getDailyTracking(today);

      setFoodLogs(updatedLogs);
      setDailyTracking(updatedTracking);

      return true;
    } catch (err) {
      console.error('Remove food log error:', err);
      setError('Failed to remove food from log');
      return false;
    }
  };
  const getUserSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await foodTrackingDB.getUserSettings();
      setUserSettings(settings);
      return settings;
    } catch (err) {
      console.error('Get user settings error:', err);
      setError('Failed to load user settings');
      return null;
    } finally {
      setIsLoading(false);
    }
  }
  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      if (!userSettings) return false;

      const updatedSettings = { ...userSettings, ...newSettings };
      await foodTrackingDB.saveUserSettings(updatedSettings);
      setUserSettings(updatedSettings);

      // Update daily tracking targets if goals changed
      if (dailyTracking && (
        newSettings.calorieGoal ||
        newSettings.proteinGoal ||
        newSettings.carbsGoal ||
        newSettings.fatGoal
      )) {
        const updatedTracking = {
          ...dailyTracking,
          calorieTarget: newSettings.calorieGoal || dailyTracking.calorieTarget,
          proteinTarget: newSettings.proteinGoal || dailyTracking.proteinTarget,
          carbsTarget: newSettings.carbsGoal || dailyTracking.carbsTarget,
          fatTarget: newSettings.fatGoal || dailyTracking.fatTarget,
        };

        await foodTrackingDB.saveDailyTracking(updatedTracking);
        setDailyTracking(updatedTracking);
      }

      return true;
    } catch (err) {
      console.error('Update settings error:', err);
      setError('Failed to update settings');
      return false;
    }
  };

  return {
    dailyTracking,
    userSettings,
    foodLogs,
    isLoading,
    error,
    addFoodToLog,
    removeFoodFromLog,
    updateUserSettings,
    getUserSettings,
    refreshData: initializeData,
  };
};
