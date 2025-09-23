import { cn } from "@/lib/utils";

interface MacroProgressBarProps {
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
}

export const MacroProgressBar = ({ protein, carbs, fat, className }: MacroProgressBarProps) => {
  // Calculate total macro calories
  const totalMacroCalories = (protein * 4) + (carbs * 4) + (fat * 9);
  
  // Calculate percentages
  const proteinPercent = totalMacroCalories > 0 ? (protein * 4) / totalMacroCalories * 100 : 0;
  const carbsPercent = totalMacroCalories > 0 ? (carbs * 4) / totalMacroCalories * 100 : 0;
  const fatPercent = totalMacroCalories > 0 ? (fat * 9) / totalMacroCalories * 100 : 0;

  return (
    <div className={cn("relative h-3 w-full overflow-hidden rounded-full bg-muted", className)}>
      {/* Protein section */}
      <div
        className="absolute top-0 left-0 h-full bg-primary transition-all"
        style={{ width: `${proteinPercent}%` }}
      />
      
      {/* Carbs section */}
      <div
        className="absolute top-0 h-full bg-chart-2 transition-all"
        style={{ 
          left: `${proteinPercent}%`, 
          width: `${carbsPercent}%` 
        }}
      />
      
      {/* Fat section */}
      <div
        className="absolute top-0 h-full bg-chart-3 transition-all"
        style={{ 
          left: `${proteinPercent + carbsPercent}%`, 
          width: `${fatPercent}%` 
        }}
      />
    </div>
  );
};