import { Button } from "@/components/ui/button";

interface PopularFoodsProps {
  foods: string[];
  onFoodClick: (food: string) => void;
}

export const PopularFoods = ({ foods, onFoodClick }: PopularFoodsProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Popular Foods</h3>
      <div className="flex flex-wrap gap-2">
        {foods.map((food) => (
          <Button
            key={food}
            variant="outline"
            size="sm"
            onClick={() => onFoodClick(food)}
            className="bg-muted border-0 text-foreground hover:bg-muted/80"
          >
            {food}
          </Button>
        ))}
      </div>
    </div>
  );
}