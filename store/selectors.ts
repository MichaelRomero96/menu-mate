import { RootState } from '.';


export const mealsCountriesDataSelector = (state: RootState) => state.meals.mealsCountries;
export const mealsByCountryDataSelector = (state: RootState) => state.meals.selectedMeals;
