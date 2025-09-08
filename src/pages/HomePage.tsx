import { CalorieCard } from "@/components/CalorieCard";
import { FoodLogCard } from "@/components/FoodLogCard";
import { db } from "@/hooks/useIndexDB";
import { MealLog } from "@/lib/types";
import { useEffect } from "react";
import {useLiveQuery} from 'dexie-react-hooks'

export const HomePage = () => {
const mealLogs = useLiveQuery(() => db.mealLogs.toArray())
const today = new Date();
today.setHours(0,0,0,0);
const getTodaysLogs = () => {
   return mealLogs?.map((meal) => {
        const meal_date = new Date(meal.date)
        meal_date.setHours(0,0,0,0)
        if (meal_date.getTime() === today.getTime())
            return meal;
        return
    })
}

const todayLogs = getTodaysLogs();
const consumedMacros = () => {
    let totalCalories: number = 0;
    let totalFat: number = 0;
    let totalProtein: number = 0;
    let totalCarbs: number = 0;
    todayLogs?.forEach((meal)=> {
        totalCalories += meal?.totalCalories || 0
        totalCarbs += meal?.totalCarbs || 0
        totalFat += meal?.totalFat || 0
        totalProtein += meal?.totalProtein || 0
    })

    return {
        totalCalories,
        totalCarbs,
        totalFat,
        totalProtein
    }
};

const macros = consumedMacros()
  const calorieData = {
    consumed: macros.totalCalories,
    total: 2000,
    remaining: 2000 - macros.totalCalories
  };
  const macroData = {
    protein: macros.totalProtein,
    carbs: macros.totalCarbs,
    fat: macros.totalFat,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 67
  };
 

  return (
    <div className='pb-20'>
      <div className="mb-[.4rem]">
        <CalorieCard data={macroData} consumed={calorieData.consumed} total={calorieData.total} remaining={calorieData.remaining} />
      </div>
      <div className="mt-[.4rem]">
        <FoodLogCard entries={todayLogs} />
      </div>
    </div>
  )
}