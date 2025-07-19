

// IndexedDB utility for food tracking data
export interface DailyTracking {
  id: string;
  date: string;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  currentCalories: number;
  currentProtein: number;
  currentCarbs: number;
  currentFat: number;
}

export interface UserSettings {
  id: string;
  theme: 'light' | 'dark';
  units: 'metric' | 'imperial';
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

export interface MealLog {
  timestamp: number;
  meal: {
    meal_name: string;
    ingredients: FoodLog[];
  };
  id: string;
  date: string;
}
export interface FoodLog {
  id: string;
  date: string;
  foodId: number;
  foodName: string;
  brandName?: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

class FoodTrackingDB {
  private dbName = 'FoodTrackingDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Daily tracking store
        if (!db.objectStoreNames.contains('dailyTracking')) {
          const dailyStore = db.createObjectStore('dailyTracking', { keyPath: 'id' });
          dailyStore.createIndex('date', 'date', { unique: true });
        }

        // User settings store
        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'id' });
        }

        // Food logs store
        if (!db.objectStoreNames.contains('foodLogs')) {
          const logsStore = db.createObjectStore('foodLogs', { keyPath: 'id' });
          logsStore.createIndex('date', 'date', { unique: false });
          logsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Daily Tracking Methods
  async getDailyTracking(date: string): Promise<DailyTracking | null> {
    const store = this.getStore('dailyTracking');
    const request = store.index('date').get(date);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveDailyTracking(data: DailyTracking): Promise<void> {
    const store = this.getStore('dailyTracking', 'readwrite');
    const request = store.put(data);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async createNewDayTracking(date: string, settings: UserSettings): Promise<DailyTracking> {
    const newTracking: DailyTracking = {
      id: `daily_${date}`,
      date,
      calorieTarget: settings.calorieGoal,
      proteinTarget: settings.proteinGoal,
      carbsTarget: settings.carbsGoal,
      fatTarget: settings.fatGoal,
      currentCalories: 0,
      currentProtein: 0,
      currentCarbs: 0,
      currentFat: 0,
    };

    await this.saveDailyTracking(newTracking);
    return newTracking;
  }

  // User Settings Methods
  async getUserSettings(): Promise<UserSettings> {
    const store = this.getStore('userSettings');
    const request = store.get('main');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve(result);
        } else {
          // Return default settings
          const defaultSettings: UserSettings = {
            id: 'main',
            theme: 'light',
            units: 'metric',
            calorieGoal: 2000,
            proteinGoal: 150,
            carbsGoal: 300,
            fatGoal: 70,
          };
          resolve(defaultSettings);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveUserSettings(settings: UserSettings): Promise<void> {
    const store = this.getStore('userSettings', 'readwrite');
    const request = store.put(settings);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Food Logs Methods
  async getFoodLogs(date: string): Promise<MealLog[]> {
    const store = this.getStore('foodLogs');
    const request = store.index('date').getAll(date);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async addFoodLog(log: MealLog): Promise<void> {
    const store = this.getStore('foodLogs', 'readwrite');
    const request = store.add(log);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFoodLog(id: string): Promise<void> {
    const store = this.getStore('foodLogs', 'readwrite');
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateDailyTotals(date: string, calories: number, protein: number, carbs: number, fat: number): Promise<void> {
    const dailyTracking = await this.getDailyTracking(date);
    if (dailyTracking) {
      dailyTracking.currentCalories += calories;
      dailyTracking.currentProtein += protein;
      dailyTracking.currentCarbs += carbs;
      dailyTracking.currentFat += fat;
      await this.saveDailyTracking(dailyTracking);
    }
  }
}

export const foodTrackingDB = new FoodTrackingDB();
