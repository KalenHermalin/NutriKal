import { Food } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';


const API_URL = 'https://octopus-app-8lwy6.ondigitalocean.app/'

interface FoodSearchServerResponse {
  success: boolean;
  foods: Food[];
}
export const searchFoods = (query: string, page: number = 0) => {
    const search = async (): Promise<FoodSearchServerResponse> => {
        if (query.length === 0) throw new Error("Query cannot be empty");
        const response = await fetch(API_URL+`api/search?q=${query}&page=${page}`);
        return response.json();
    }
    return useQuery({
        queryKey: ['searchfoods', query, page],
        queryFn: search,
        enabled: !!query
    });
} 

export const scanBarcode = (barcode: string) => {
 const scan = async () => {
    const response = await fetch(`${API_URL}/api/barcode/search?barcode=${encodeURIComponent(barcode)}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
        
      const json = await response.json();
      console.log(json)

 }
 return useQuery({
    queryKey: ['scanBarcode', barcode],
    queryFn: scan,
    enabled: !!barcode
 })
}