import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Moon, Scale, Target, Save } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useTheme } from "@/contexts/ThemeContext";
export default function Profile() {
  const [units, setUnits] = useState("metric");
  const [calories, setCalories] = useState("2000");
  const [protein, setProtein] = useState("150");
  const [carbs, setCarbs] = useState("300");
  const [fat, setFat] = useState("70");
  //@ts-ignore. For some reason useTheme() throws an error even though it works perfectly fine
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Customize your app settings and nutrition goals
          </p>
        </div>

        {/* App Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
              </div>
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary" />
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
              </div>
              <ToggleGroup 
                type="single" 
                value={theme} 
                onValueChange={setTheme}
                className="bg-muted rounded-lg "
              >
                <ToggleGroupItem value="system" className="text-xs px-3 data-[state=on]:bg-primary">
                  System
                </ToggleGroupItem>
                <ToggleGroupItem value="light" className="text-xs px-3 data-[state=on]:bg-primary">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" className="text-xs px-3 data-[state=on]:bg-primary">
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Units Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-primary" />
                <div>
                  <Label className="text-base font-medium">Units</Label>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred measurement unit
                  </p>
                </div>
              </div>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger className="w-24 bg-muted border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="imperial">Imperial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Goals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Nutrition Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Daily Calories */}
            <div>
              <Label htmlFor="calories" className="text-base font-medium">
                Daily Calories
              </Label>
              <Input
                id="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="mt-2 bg-muted border-0 text-lg font-medium"
              />
            </div>

            {/* Protein */}
            <div>
              <Label htmlFor="protein" className="text-base font-medium">
                Protein (g)
              </Label>
              <Input
                id="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="mt-2 bg-muted border-0 text-lg font-medium"
              />
            </div>

            {/* Carbohydrates */}
            <div>
              <Label htmlFor="carbs" className="text-base font-medium">
                Carbohydrates (g)
              </Label>
              <Input
                id="carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="mt-2 bg-muted border-0 text-lg font-medium"
              />
            </div>

            {/* Fat */}
            <div>
              <Label htmlFor="fat" className="text-base font-medium">
                Fat (g)
              </Label>
              <Input
                id="fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="mt-2 bg-muted border-0 text-lg font-medium"
              />
            </div>

            {/* Save Button */}
            <Button className="w-full mt-6 bg-primary text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* About Card */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Version 0.0.1</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NutriKal helps you monitor your nutrition with ease. Track your meals, 
              scan barcodes, analyze photos, and maintain a healthy lifestyle with 
              comprehensive food logging and progress tracking.
              Powered by: Fat Secret API
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}