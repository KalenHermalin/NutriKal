import { MealLog } from "@/lib/types";
import Dexie, {type EntityTable} from "dexie";

export const db = new Dexie('NutriKal-DB') as Dexie & {
    mealLogs: EntityTable<
    MealLog,
    "id"
    >;
};


db.version(1).stores({
    mealLogs: '++id, foods, mealName, totalCalories, totalFat, totalCarbs, totalProtein'
})