import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Food } from "@/lib/types";
import { useNavigate } from "react-router";



interface FoodSearchResultsProps {
  results: Food[];
}

export const FoodSearchResults = ({ results }: FoodSearchResultsProps) => {
  const navigate = useNavigate();

  const onAddFood = (foodId: string) => {
    const food = results.find((item) => item.food_id === Number(foodId));
    navigate("/add-food", { state: { food } });
  };
  return (
    <div className="space-y-3">
      {results.map((food) => (
        <div
          key={food.food_id}
          className="flex items-center justify-between p-4 bg-muted rounded-lg"
        >
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{food.food_name}</h4>
            <div className="text-sm text-muted-foreground">
              {food.brand_name && <div>{food.brand_name}</div>}
              <div>{Number(food.servings.find((serving) => serving.is_default)?.metric_serving_amount).toFixed(0)} {food.servings.find((serving) => serving.is_default)?.metric_serving_unit}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {food.servings.find((serving) => serving.is_default)?.calories} cal
            </span>
            <Button
              size="sm"
              onClick={() => onAddFood(food.food_id.toString())}
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