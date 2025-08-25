import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodItem {
  id: string;
  name: string;
  amount: string;
  calories: number;
  brand?: string;
}

interface FoodSearchResultsProps {
  results: FoodItem[];
  onAddFood: (foodId: string) => void;
}

export const FoodSearchResults = ({ results, onAddFood }: FoodSearchResultsProps) => {
  return (
    <div className="space-y-3">
      {results.map((food) => (
        <div
          key={food.id}
          className="flex items-center justify-between p-4 bg-muted rounded-lg"
        >
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{food.name}</h4>
            <div className="text-sm text-muted-foreground">
              {food.brand && <div>{food.brand}</div>}
              <div>{food.amount}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {food.calories} cal
            </span>
            <Button
              size="sm"
              onClick={() => onAddFood(food.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}