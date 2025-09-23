import { PopularFoods } from "./search/PopularFoods";
import { SearchInput } from "./search/SearchInput";
import { FoodSearchResults } from "./search/FoodSearchResults";
import { useEffect, useState } from "react";
import { searchFoods } from "@/hooks/useApi";




export const FoodSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {data, error, isLoading} = searchFoods(searchQuery);
    const popularFoods = [
        "Chicken Breast",
        "Rice",
        "Eggs",
        "Banana",
        "Apple",
        "Oatmeal",
        "Salmon",
        "Broccoli"
    ];



    const handleSearchFood = async (food: string) => {
        setSearchQuery(food);
       

    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div>
            <div className="mb-2">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={handleClearSearch}
                    placeholder="Search foods to add..."
                />
            </div>
            <div className="mt-2">
            {searchQuery && data ? (
                <FoodSearchResults
                    results={data}
                />
            ) : (
                <PopularFoods
                    foods={popularFoods}
                    onFoodClick={handleSearchFood}
                />
            )}
            </div>
        </div>
    );
}