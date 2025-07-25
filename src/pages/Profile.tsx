import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFoodTracking } from '../hooks/useFoodTracking';
import { Sun, Moon, Scale, Target, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../components/ErrorSystem';
const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { userSettings, updateUserSettings, isLoading, getUserSettings } = useFoodTracking();
const { addNotifications } = useNotification();
  const [localSettings, setLocalSettings] = useState({
    units: userSettings?.units || 'metric',
    calorieGoal: userSettings?.calorieGoal || 2000,
    proteinGoal: userSettings?.proteinGoal || 150,
    carbsGoal: userSettings?.carbsGoal || 300,
    fatGoal: userSettings?.fatGoal || 70,
  });
  useEffect(() => {
    getUserSettings().then(settings => {
      if (settings) {
        setLocalSettings({
          units: settings.units,
          calorieGoal: settings.calorieGoal,
          proteinGoal: settings.proteinGoal,
          carbsGoal: settings.carbsGoal,
          fatGoal: settings.fatGoal,
        });
      }
    });
  }, []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const success = await updateUserSettings({
        ...localSettings,
        theme: theme,
      });

      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted">Customize your app settings and nutrition goals</p>
      </motion.div>

      {/* App Settings */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4">App Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="text-primary" /> : <Sun className="text-primary" />}
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted">Choose your preferred theme</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="btn btn-outline py-2 px-4"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="text-primary" />
              <div>
                <h3 className="font-medium">Units</h3>
                <p className="text-sm text-muted">Set your preferred measurement unit</p>
              </div>
            </div>
            <select
              value={localSettings.units}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, units: e.target.value as 'metric' | 'imperial' }))}
              className="input py-2 px-4 w-auto"
            >
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Nutrition Goals */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-primary" />
          <h2 className="text-lg font-semibold">Nutrition Goals</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Daily Calories</label>
            <input
              type="number"
              min="1000"
              max="5000"
              value={localSettings.calorieGoal}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, calorieGoal: parseInt(e.target.value) }))}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setLocalSettings(prev => ({ ...prev, calorieGoal: userSettings?.calorieGoal || 2000 }));
                }
              }}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Protein (g)</label>
            <input
              type="number"
              min="50"
              max="300"
              value={localSettings.proteinGoal}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, proteinGoal: parseInt(e.target.value) }))}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setLocalSettings(prev => ({ ...prev, proteinGoal: userSettings?.proteinGoal || 150 }));
                }
              }}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Carbohydrates (g)</label>
            <input
              type="number"
              min="100"
              max="500"
              value={localSettings.carbsGoal}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, carbsGoal: parseInt(e.target.value) }))}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setLocalSettings(prev => ({ ...prev, carbsGoal: userSettings?.carbsGoal || 300 }));
                }
              }}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fat (g)</label>
            <input
              type="number"
              min="30"
              max="150"
              value={localSettings.fatGoal}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, fatGoal: parseInt(e.target.value) }))}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setLocalSettings(prev => ({ ...prev, fatGoal: userSettings?.fatGoal || 70 }));
                }
              }}
              className="input"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="btn btn-primary py-2 px-4 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>

          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 text-success"
            >
              <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Settings saved!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-4">About</h2>
        <p className="text-sm text-muted mb-2">Version 0.0.1</p>
        <p className="text-sm text-muted">
          NutriKal helps you monitor your nutrition with ease. Track your meals,
          scan barcodes, analyze photos, and maintain a healthy lifestyle with
          comprehensive food logging and progress tracking.
        </p>
      </motion.div>
    </div>
  );
};

export default Profile;
