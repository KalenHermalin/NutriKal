import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Minus, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocation, useNavigate } from "react-router";
import { Food, FoodLog, MealLog } from "../lib/types";
import { db } from "@/hooks/useIndexDB";
import { time } from "console";

const AddFood = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedServing, setSelectedServing] = useState("0");
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isEnergyExpanded, setIsEnergyExpanded] = useState(true);

const location = useLocation();
  const food: Food | null = location.state?.food;

  const handleQuantityChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setQuantity(num);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.round((prev + 0.25) * 100) / 100);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(0, Math.round((prev - 0.25) * 100) / 100));
  };

  if (!food) {
    return <div>No food selected</div>;
  }

  const handleAddFood = async () => {
    const foodLog: FoodLog = {
      food,
      selectedServing: Number(selectedServing),
      totalCalories: calculatedCalories,
      totalCarbs: calculatedCarbs,
      totalFat: calculatedFat,
      totalProtein: calculatedProtein
    }
    const date = new Date();
    const mealLog: MealLog = {
      foods: [foodLog],
      date: date.toLocaleDateString(),
      timestamp: timestamp,
      mealName: foodLog.food.food_name,
      totalCalories: foodLog.totalCalories,
      totalCarbs: foodLog.totalCarbs,
      totalFat: foodLog.totalFat,
      totalProtein: foodLog.totalProtein
    }
    const id = await db.mealLogs.add(mealLog);
    
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    setSelectedServing(food.servings.findIndex(serving => serving.is_default).toString() || "0");
    setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, [food]);


  // Calculate nutritional values based on quantity
  const servingIndex = Number(selectedServing);
  const calculatedCalories = Math.round(Number(food.servings[servingIndex].calories) * quantity);
  const calculatedProtein = Number(food.servings[servingIndex].protein) * quantity;
  const calculatedCarbs = Number(food.servings[servingIndex].carbohydrate) * quantity;
  const calculatedFat = Number(food.servings[servingIndex].fat) * quantity;

  // Calculate percentages for the circular chart
  const totalMacroCalories = (calculatedProtein * 4) + (calculatedCarbs * 4) + (calculatedFat * 9);
  const proteinPercent = totalMacroCalories > 0 ? (calculatedProtein * 4) / totalMacroCalories * 100 : 0;
  const carbsPercent = totalMacroCalories > 0 ? (calculatedCarbs * 4) / totalMacroCalories * 100 : 0;
  const fatPercent = totalMacroCalories > 0 ? (calculatedFat * 9) / totalMacroCalories * 100 : 0;

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{food.food_name}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Serving Size */}
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium text-foreground">Serving Size</Label>
          <div className="w-40">
            <Select value={selectedServing} onValueChange={setSelectedServing}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Serving Dropdown" />
              </SelectTrigger>
              <SelectContent>
                {food.servings.map((serving, index) => (
                  <SelectItem key={serving.serving_id} value={index.toString()}>
                    {serving.serving_description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium text-foreground">Amount</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              className="h-10 w-10 bg-muted border-border hover:bg-muted/80"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-20 text-center bg-muted border-border"
              step="0.25"
              min="0"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="h-10 w-10 bg-muted border-border hover:bg-muted/80"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium text-foreground">TimeStamp</Label>
          <div className="w-32">
            <Input
              type="time"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="bg-muted border-border"
            />
          </div>
        </div>

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
                        strokeLineCap="square"
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
                          strokeLineCap="square"
                          color="stroke-chart-3"
                        />
                      </div>
                      {/* Carbs segment - offset by protein percentage */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          transform: `rotate(${((fatPercent + proteinPercent) / 100) * 360}deg)`
                        }}
                      >
                        <CircularProgress
                          value={carbsPercent}
                          max={100}
                          size={128}
                          strokeWidth={12}
                          strokeLineCap="square"
                          color="stroke-chart-2"
                        />
                      </div>
                      
                      {/* Center text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-foreground">{calculatedCalories}</div>
                        <div className="text-sm text-muted-foreground">kcal</div>
                      </div>
                    </div>
                  </div>

                  {/* Macro breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-sm font-medium text-green-400">
                        Protein ({Math.round(proteinPercent)}%) - {calculatedProtein.toFixed(1)}g
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-blue-400">
                        Net Carbs ({Math.round(carbsPercent)}%) - {calculatedCarbs.toFixed(1)}g
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-medium text-orange-400">
                        Fat ({Math.round(fatPercent)}%) - {calculatedFat.toFixed(1)}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Add Food Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleAddFood}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          Add Food
        </Button>
      </div>
    </div>
  );
};

export default AddFood;