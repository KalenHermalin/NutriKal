import { useState } from "react";
import { Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BottomNavigation } from "@/components/BottomNavigation";

const Scanner = () => {
  const [scanMode, setScanMode] = useState("scan-food");

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 items-center justify-center">
      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="text-xl font-semibold text-foreground">Scanner</h1>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 px-4 pb-6">
        <div className="relative h-full bg-muted rounded-3xl overflow-hidden">
          {/* Viewfinder overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white rounded-3xl"></div>
          </div>
          
          {/* Placeholder for camera feed */}
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Camera size={48} />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-4 pb-8 space-y-4">
        {/* Toggle Group for Scan Options */}
        <ToggleGroup 
          type="single" 
          value={scanMode} 
          onValueChange={(value) => value && setScanMode(value)}
          className="grid grid-cols-3 gap-2"
        >
          <ToggleGroupItem value="scan-food" className="flex flex-col gap-1 h-auto py-3">
            <Camera size={20} />
            <span className="text-xs">Scan food</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="barcode" className="flex flex-col gap-1 h-auto py-3">
            <div className="w-5 h-5 border border-current rounded-sm flex items-center justify-center">
              <div className="w-3 h-2 border-l border-current"></div>
            </div>
            <span className="text-xs">Barcode</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="food-label" className="flex flex-col gap-1 h-auto py-3">
            <div className="w-5 h-5 border border-current rounded-sm flex items-center justify-center">
              <div className="w-3 h-1 bg-current rounded-full"></div>
            </div>
            <span className="text-xs">Food label</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Shutter and Library Buttons */}
        <div className="flex items-center justify-center gap-8">
          <Button variant="outline" size="icon" className="rounded-full">
            <Image size={20} />
          </Button>
          
          <Button 
            size="icon" 
            className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;