import { Home, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, NavLink } from "react-router";
import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

export const BottomNavigation = () => {
  let location = useLocation();
  const [activeTab, setActiveTab] = useState("")
  const navItems: NavItem[] = [
    { id: "", label: "Home", icon: Home },
    //{ id: "search", label: "Search", icon: Search },
    { id: "analyze", label: "Analyze", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User }
  ];
  useEffect(()=> {
    setActiveTab(location.pathname.slice(1, location.pathname.length))
 }, [location])
  
 
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <NavLink
              key={item.id}
              to={item.id}
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
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}