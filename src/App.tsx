import { useState } from 'react'
import { CalorieCard } from './components/CalorieCard.tsx'
import { FoodLogCard } from './components/FoodLogCard.tsx'
import { BottomNavigation } from './components/BottomNavigation.tsx'
import Scanner from './pages/Scanner.tsx';

function App() {
  const [activeTab, setActiveTab] = useState("home");


  return (
    <div className="flex flex-col m-1">
      {activeTab === "home" && <HomePage />}
      {activeTab === 'analyze' && <Scanner />}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>

  )
}

export default App


const HomePage = () => {
  const calorieData = {
    consumed: 200,
    total: 2000,
    remaining: 1800
  };
  const macroData = {
    protein: 122.0,
    carbs: 222.0,
    fat: 41.0,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 67
  };
  const foodEntries = [
    {
      id: "1",
      time: "8:30 PM",
      name: "Nutella",
      amount: "2 tbsp",
      calories: 200,
      protein: 2.0,
      carbs: 22.0,
      fat: 11.0
    }
  ];

  return (
    <>
      <div className="mb-[.4rem]">
        <CalorieCard data={macroData} consumed={calorieData.consumed} total={calorieData.total} remaining={calorieData.remaining} />
      </div>
      <div className="mt-[.4rem]">
        <FoodLogCard entries={foodEntries} />
      </div>
    </>
  )
}