import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { CircularProgress } from "./ui/circular-progress";
import { useState } from "react";
import { FoodSearch } from "./FoodSearch";


interface MacroData {
    protein: number;
    carbs: number;
    fat: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatGoal?: number;
}

interface CalorieCardProps {
    consumed: number;
    total: number;
    remaining: number;
    data: MacroData;
}

export const CalorieCard = ({ consumed, total, remaining, data }: CalorieCardProps) => {
    const [showSearch, setShowSearch] = useState(false);

    const progressPercentage = (consumed / total) * 100;
    const macros = [
        {
            name: "Protein",
            value: data.protein,
            goal: data.proteinGoal || 50,
            color: "stroke-primary",
            unit: "g"
        },
        {
            name: "Carbs",
            value: data.carbs,
            goal: data.carbsGoal || 150,
            color: "stroke-chart-2",
            unit: "g"
        },
        {
            name: "Fat",
            value: data.fat,
            goal: data.fatGoal || 65,
            color: "stroke-chart-3",
            unit: "g"
        }
    ];

    return (
        <Card className="p-6 bg-card border-border">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Daily Overview</h2>
                <span className="text-muted-foreground text-sm">Today</span>
            </div>
            <div className="flex justify-between items-center">
                {macros.map((macro) => {
                    return (
                        <div key={macro.name} className="flex flex-col items-center">
                            <CircularProgress
                                value={macro.value}
                                max={macro.goal}
                                color={macro.color}
                                size={100}
                                strokeWidth={8}                        >
                                <div className="text-center">

                                    <div className="text-lg font-bold text-foreground">
                                        {macro.value.toFixed(1)}{macro.unit}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {macro.name}
                                    </div>
                                </div>
                            </CircularProgress>
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col justify-center items-center w-full" >
                <div className="text-lg font-bold text-foreground mb-1 w-full text-center">{consumed.toFixed(0)} of {total.toFixed(0)} calories</div>
                <div className="text-base text-primary w-full text-center">{remaining.toFixed(0)} remaining</div>
            </div>

            <div className="mb-6">
                <Progress value={progressPercentage} className="h-2" />
            </div>

            <Button className="w-full" size="lg" onClick={() => setShowSearch(!showSearch)}>
                <Plus className="w-4 h-4 mr-2" />
                {showSearch ? "Hide Search" : "Add Food "}
            </Button>
            {showSearch && (

                <FoodSearch/>
            )}
        </Card>
    );
}