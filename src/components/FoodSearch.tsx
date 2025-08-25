import { PopularFoods } from "./search/PopularFoods";
import { SearchInput } from "./search/SearchInput";
import { FoodSearchResults } from "./search/FoodSearchResults";
import { useState } from "react";




export const FoodSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");

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

    const searchResults = [
        {
            id: "1",
            name: "Chicken Breast",
            amount: "100 g",
            calories: 195,
            brand: ""
        },
        {
            id: "2",
            name: "Skinless Chicken Breast",
            amount: "100 g",
            calories: 110,
            brand: ""
        },
        {
            id: "3",
            name: "Boneless Skinless Chicken Breasts",
            amount: "4 oz",
            calories: 110,
            brand: "Tyson Foods"
        },
        {
            id: "4",
            name: "Chicken Breast",
            amount: "4 oz",
            calories: 110,
            brand: "Kirkland Signature"
        }
    ];


    const handleSearchFood = (food: string) => {
        setSearchQuery(food);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleAddFood = (foodId: string) => {
        console.log("Adding food:", foodId);
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
            {searchQuery ? (
                <FoodSearchResults
                    results={searchResults}
                    onAddFood={handleAddFood}
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