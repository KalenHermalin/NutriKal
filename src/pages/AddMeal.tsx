import { useState } from "react";
import { ArrowLeft, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useLocation, useNavigate } from "react-router";
import { Food } from "@/lib/types";


interface MealData {
    name: string;
    foods: Food[];
}

const AddMeal = () => {
    const navigate = useNavigate();
    const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [isEnergyExpanded, setIsEnergyExpanded] = useState(true);
    const [expandedFoods, setExpandedFoods] = useState<Record<string, boolean>>({});
    const location = useLocation();
    const meal: MealData | null = location.state?.meal;

    if (!meal) {
        alert("No meal data passed!");
        setTimeout(() => {
            navigate(-1);
        }, 1000)
    }
    const handleAddMeal = () => {

        navigate(-1);
    };

    const toggleFoodExpanded = (foodId: number) => {
        setExpandedFoods(prev => ({
            ...prev,
            [foodId]: !prev[foodId]
        }));
    };

    // Calculate totals
    const totalGrams = meal?.foods.reduce((sum, food) => sum + Number(food?.quantity), 0) || 0;
    const totalCalories = meal?.foods.reduce((sum, food) => sum + Number(food.servings[0].calories) * Number(food?.quantity), 0) || 0;
    const totalProtein = meal?.foods.reduce((sum, food) => sum + Number(food.servings[0].protein) * Number(food?.quantity), 0) || 0;
    const totalCarbs = meal?.foods.reduce((sum, food) => sum + Number(food.servings[0].carbohydrate) * Number(food?.quantity), 0) || 0;
    const totalFat = meal?.foods.reduce((sum, food) => sum + Number(food.servings[0].fat) * Number(food?.quantity), 0) || 0;

    // Calculate percentages for the circular chart
    const totalMacroCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
    const proteinPercent = totalMacroCalories > 0 ? (totalProtein * 4) / totalMacroCalories * 100 : 0;
    const carbsPercent = totalMacroCalories > 0 ? (totalCarbs * 4) / totalMacroCalories * 100 : 0;
    const fatPercent = totalMacroCalories > 0 ? (totalFat * 9) / totalMacroCalories * 100 : 0;


    return (
        <div className="min-h-screen bg-background">
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
                <h1 className="text-xl font-semibold text-foreground">{meal?.name}</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Serving Size (Total Grams) */}
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium text-foreground">Serving Size</Label>
                    <div className="px-4 py-2 bg-muted rounded-lg border border-border">
                        <span className="text-foreground font-medium">{totalGrams} g</span>
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
                                    className={`h-5 w-5 text-muted-foreground transition-transform ${isEnergyExpanded ? '' : 'rotate-180'
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
                                                unfilledColor="transparent"

                                                color="stroke-green-600"
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
                                                    unfilledColor="transparent"

                                                    color="stroke-orange-500"
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
                                                    unfilledColor="transparent"
                                                    strokeLineCap="square"
                                                    color="stroke-chart-2"
                                                />
                                            </div>

                                            {/* Center text */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="text-2xl font-bold text-foreground">{totalCalories}</div>
                                                <div className="text-sm text-muted-foreground">kcal</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Macro breakdown */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                            <span className="text-sm font-medium text-green-400">
                                                Protein ({Math.round(proteinPercent)}%) - {totalProtein.toFixed(1)}g
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium text-blue-400">
                                                Net Carbs ({Math.round(carbsPercent)}%) - {totalCarbs.toFixed(1)}g
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                            <span className="text-sm font-medium text-orange-400">
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

                    {meal?.foods.map((food) => (
                        <Collapsible
                            key={food.food_id}
                            open={expandedFoods[food.food_id]}
                            onOpenChange={() => toggleFoodExpanded(food.food_id)}
                        >
                            <Card className="bg-card border-border overflow-hidden">
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                                        <div>
                                            <h4 className="font-medium text-foreground">{food.food_name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {food.quantity}g • {food.servings[0].calories} kcal
                                                {food.brand_name && ` • ${food.brand_name}`}
                                            </p>
                                        </div>
                                        <ChevronUp
                                            className={`h-5 w-5 text-muted-foreground transition-transform ${expandedFoods[food.food_id] ? '' : 'rotate-180'
                                                }`}
                                        />
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <div className="px-4 pb-4 space-y-4">
                                        {/* Macronutrient Progress Bars */}
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-green-600">Protein</span>
                                                    <span className="text-sm text-muted-foreground">{Number(food.servings[0].protein).toFixed(1)}g</span>
                                                </div>
                                                <Progress
                                                    value={(Number(food.servings[0].protein) / 50) * 100}
                                                    className="h-2"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-blue-500">Carbs</span>
                                                    <span className="text-sm text-muted-foreground">{Number(food.servings[0].carbohydrate).toFixed(1)}g</span>
                                                </div>
                                                <Progress
                                                    value={(Number(food.servings[0].carbohydrate) / 50) * 100}
                                                    className="h-2"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-orange-500">Fat</span>
                                                    <span className="text-sm text-muted-foreground">{Number(food.servings[0].fat).toFixed(1)}g</span>
                                                </div>
                                                <Progress
                                                    value={(Number(food.servings[0].fat) / 30) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    ))}
                </div>
            </div>

            {/* Add Meal Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
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