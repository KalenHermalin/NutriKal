import { Home, Search, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const BottomNavigation = ({ activeTab = "home", onTabChange }: BottomNavigationProps) => {
  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home },
    //{ id: "search", label: "Search", icon: Search },
    { id: "analyze", label: "Analyze", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-8 h-0.5 bg-primary rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}