import { MealLog, Settings } from "@/lib/types";
import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie('NutriKal-DB') as Dexie & {
    mealLogs: EntityTable<
        MealLog,
        "id"
    >;
    settings: EntityTable<Settings, "id">;
};


db.version(2).stores({
    mealLogs: '++id, foods, mealName, totalCalories, totalFat, totalCarbs, totalProtein',
    settings: '++id, dailyCalorieGoal, dailyProteinGoal, dailyCarbGoal, dailyFatGoal, theme, units'

})
