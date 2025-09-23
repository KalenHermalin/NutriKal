import { useState } from "react";
import { ArrowLeft, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MacroProgressBar } from "@/components/MacroProgressbar";
import { useLocation, useNavigate } from "react-router";
import { Food, foods as _foods, FoodLog, MealLog } from "@/lib/types";
import { db } from "@/hooks/useIndexDB";


interface MealData {
  name: string;
  foods: Food[];
}

const AddMeal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEnergyExpanded, setIsEnergyExpanded] = useState(true);
  const [expandedFoods, setExpandedFoods] = useState<Record<string, boolean>>({});
  const meal: MealData = location.state?.foods;
  const [mealName, setMealName] = useState(meal?.name  || "breakfast");
  const [foods, setFoods] = useState(meal?.foods || _foods)

  const handleAddMeal = async  () => {
    
    const foodLogs: FoodLog[] = foods.map((food) => {
      let foodLog: FoodLog;
      foodLog = {
        food,
        selectedServing: 0,
        totalCalories: Math.round(Number(food.servings[0].calories) * Number(food.quantity)),
        totalFat: Math.round(Number(food.servings[0].fat) * Number(food.quantity)),
        totalCarbs: Math.round(Number(food.servings[0].carbohydrate) * Number(food.quantity)),
        totalProtein: Math.round(Number(food.servings[0].protein) * Number(food.quantity)),
        
      }
      return foodLog
    })
    const date = new Date();
    const mealLog: MealLog = {
      foods: foodLogs,
      date: date.toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealName: mealName,
      totalCalories: totalCalories,
      totalCarbs: totalCarbs,
      totalFat: totalFat,
      totalProtein: totalProtein
    }
    const id = await db.mealLogs.add(mealLog);

    navigate(-1);
  };

  const toggleFoodExpanded = (foodId: string) => {
    setExpandedFoods(prev => ({
      ...prev,
      [foodId]: !prev[foodId]
    }));
  };

const updateFoodAmount = (foodId: string, newAmount: number) => {
    setFoods(prev => prev.map(food => {
      if (food.food_id.toString() === foodId) {
        // Calculate new nutritional values based on the ratio
        const ratio = newAmount / Number(food.quantity);
        return {
          ...food,
          quantity: newAmount.toString(),
          calories: Math.round(Number(food.servings[0].calories) * ratio),
          protein: Number((Number(food.servings[0].protein) * ratio).toFixed(1)),
          carbs: Number((Number(food.servings[0].carbohydrate) * ratio).toFixed(1)),
          fat: Number((Number(food.servings[0].fat)* ratio).toFixed(1))
        };
      }
      return food;
    }));
  };

  const removeFoodItem = (foodId: string) => {
    setFoods(prev => prev.filter(food => food.food_id.toString() !== foodId));
  };

  // Calculate totals from current foods state
  const totalGrams = foods.reduce((sum, food) => sum + Number(food.quantity), 0);
  const totalCalories = foods.reduce((sum, food) => sum + Number(food.servings[0].calories), 0);
  const totalProtein = foods.reduce((sum, food) => sum + Number(food.servings[0].protein), 0);
  const totalCarbs = foods.reduce((sum, food) => sum + Number(food.servings[0].carbohydrate), 0);
  const totalFat = foods.reduce((sum, food) => sum + Number(food.servings[0].fat), 0);

  // Calculate percentages for the circular chart
  const totalMacroCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
  const proteinPercent = totalMacroCalories > 0 ? (totalProtein * 4) / totalMacroCalories * 100 : 0;
  const carbsPercent = totalMacroCalories > 0 ? (totalCarbs * 4) / totalMacroCalories * 100 : 0;
  const fatPercent = totalMacroCalories > 0 ? (totalFat * 9) / totalMacroCalories * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <Input
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 flex-1 mr-4"
              placeholder="Enter meal name"
            />
            <div className="w-32">
             {/* <Input
                type="time"
                value={}
                onChange={(e) => setTimestamp(e.target.value)}
                className="bg-muted border-border"
              />*/}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">

        {/* Energy Summary */}
        <Collapsible open={isEnergyExpanded} onOpenChange={setIsEnergyExpanded}>
          <Card className="bg-card border-border overflow-hidden">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                <h3 className="text-lg font-semibold text-foreground">Energy Summary</h3>
                <ChevronUp 
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isEnergyExpanded ? '' : 'rotate-180'
                  }`} 
                />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between">
                  {/* Circular Chart */}
                  <div className="relative">
                    <div className="relative w-32 h-32">
                      {/* Base circle */}
                      <div className="absolute inset-0 rounded-full bg-muted"></div>
                      
                      {/* Protein segment */}
                      <CircularProgress
                        value={proteinPercent}
                        max={100}
                        size={128}
                        strokeWidth={12}
                        strokeLineCap="butt"
                        unfilledColor="transparent"
                        color="stroke-primary"
                        className="absolute inset-0"
                      />
                      
                      {/* Fat segment - offset by protein percentage */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          transform: `rotate(${(proteinPercent / 100) * 360}deg)`
                        }}
                      >
                        <CircularProgress
                          value={fatPercent}
                          max={100}
                          size={128}
                          strokeWidth={12}
                          strokeLineCap="butt"
                          unfilledColor="transparent"
                          color="stroke-chart-2"
                        />
                      </div>

                      {/* Carbs segment - offset by protein percentage */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          transform: `rotate(${(carbsPercent / 100) * 360}deg)`
                        }}
                      >
                        <CircularProgress
                          value={carbsPercent}
                          max={100}
                          size={128}
                          strokeWidth={12}
                          strokeLineCap="butt"
                          unfilledColor="transparent"
                          color="stroke-chart-3"
                        />
                      </div>
                      
                      {/* Center text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center ">
                        <div className="text-2xl font-bold text-foreground">{totalCalories}</div>
                        <div className="text-sm text-muted-foreground">kcal</div>
                      </div>
                    </div>
                  </div>

                  {/* Macro breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium text-primary">
                        Protein ({Math.round(proteinPercent)}%) - {totalProtein.toFixed(1)}g
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                      <span className="text-sm font-medium text-chart-2">
                        Net Carbs ({Math.round(carbsPercent)}%) - {totalCarbs.toFixed(1)}g
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                      <span className="text-sm font-medium text-chart-3">
                        Fat ({Math.round(fatPercent)}%) - {totalFat.toFixed(1)}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Food Items List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Food Items</h3>
          
          {foods.map((food) => (
            <Collapsible 
              key={food.food_id}
              open={expandedFoods[food.food_id]}
              onOpenChange={() => toggleFoodExpanded(food.food_id.toString())}
            >
              <Card className="bg-card border-border overflow-hidden">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{food.food_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {food.quantity}g • {food.servings[0].calories} kcal
                        {food.brand_name && ` • ${food.brand_name}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFoodItem(food.food_id.toString())
                        }}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronUp 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          expandedFoods[food.food_id] ? '' : 'rotate-180'
                        }`} 
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    {/* Quantity Editor */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-foreground">Quantity</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={food.quantity}
                          onChange={(e) => {
                            updateFoodAmount(food.food_id.toString(), Number(e.target.value))
                          }}
                          className="w-20 h-8 text-center"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground">g</span>
                      </div>
                    </div>

                    {/* Combined Macro Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-primary font-medium">Protein {Number(food.servings[0].protein).toFixed(1)}g</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                            <span className="text-chart-2 font-medium">Carbs {Number(food.servings[0].carbohydrate).toFixed(1)}g</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-chart-3"></div>
                            <span className="text-chart-3 font-medium">Fat {Number(food.servings[0].fat).toFixed(1)}g</span>
                          </div>
                        </div>
                      </div>
                      <MacroProgressBar 
                        protein={Number(food.servings[0].protein)}
                        carbs={Number(food.servings[0].carbohydrate)}
                        fat={Number(food.servings[0].protein)}
                        className="h-3"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Add Meal Button */}
      <div className="fixed bottom-18 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleAddMeal}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Add Meal
        </Button>
      </div>
    </div>
  );
};

export default AddMeal;