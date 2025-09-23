import { useState } from "react";
import { FoodSearch } from "@/components/FoodSearch";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const popularFoods = ["Chicken Breast", "Rice", "Eggs", "Banana", "Apple", "Oatmeal", "Salmon", "Broccoli"];
  const searchResults = [{
    id: "1",
    name: "Chicken Breast",
    amount: "100 g",
    calories: 195,
    brand: ""
  }, {
    id: "2",
    name: "Skinless Chicken Breast",
    amount: "100 g",
    calories: 110,
    brand: ""
  }, {
    id: "3",
    name: "Boneless Skinless Chicken Breasts",
    amount: "4 oz",
    calories: 110,
    brand: "Tyson Foods"
  }, {
    id: "4",
    name: "Chicken Breast",
    amount: "4 oz",
    calories: 110,
    brand: "Kirkland Signature"
  }];
  const macroData = {
    protein: 0.0,
    carbs: 0.0,
    fat: 0.0
  };
  const handleSearchFood = (food: string) => {
    setSearchQuery(food);
  };
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  const handleAddFood = (foodId: string) => {
    console.log("Adding food:", foodId);
  };
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