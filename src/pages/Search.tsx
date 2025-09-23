import { useState } from "react";
import { FoodSearch } from "@/components/FoodSearch";

const Search = () => {
  const [showSearch, _setShowSearch] = useState(true);
 
  if (!showSearch) {
    return null;
  }
  return <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Add Food to Log</h2>
          <FoodSearch />
        </div>

      </div>
    </div>;
};
export default Search;