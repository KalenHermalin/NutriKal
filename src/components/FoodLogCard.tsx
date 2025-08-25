import { Card } from "@/components/ui/card";
import { Clock, X } from "lucide-react";


interface FoodEntry {
  id: string;
  time: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodLogCardProps {
  entries: FoodEntry[];
}

export const FoodLogCard = ({ entries }: FoodLogCardProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Today's Food Log</h2>
        <span className="text-muted-foreground text-sm">{entries.length} items</span>
      </div>
      
      <div className="space-y-3">
        {entries.map((entry) => (
          <FoodLogEntry key={entry.id} entry={entry} />
        ))}
        {entries.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No food logged today
          </div>
        )}
      </div>
    </Card>
  );
};

interface FoodLogEntryProps {
  entry: FoodEntry;
}

export const FoodLogEntry = ({ entry }: FoodLogEntryProps) => {
  return (
    <div className="bg-background rounded-lg p-4 border border-border">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{entry.time}</span>
          </div>
          <div className="font-medium text-foreground mb-1">{entry.name}</div>
          <div className="text-sm text-muted-foreground mb-2">{entry.amount}</div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>P: {entry.protein.toFixed(1)}g</span>
            <span>C: {entry.carbs.toFixed(1)}g</span>
            <span>F: {entry.fat.toFixed(1)}g</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-foreground">{entry.calories}</span>
          <span className="text-xs text-muted-foreground"> cal</span>
          <X className="ml-5 mt-2 cursor-pointer text-muted-foreground hover:text-destructive" />
        </div>
      </div>
    </div>
  );
}