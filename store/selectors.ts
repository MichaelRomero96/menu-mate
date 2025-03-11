import { RootState } from '.';

export const mealsCountriesSelector = (state: RootState) => state.meals.mealsCountries;
export const mealsByCountrySelector = (state: RootState) => state.meals.selectedMeals;
export const selectedCountrySelector = (state: RootState) => state.meals.selectedCountry;
export const mealsByCountriesListSelector = (state: RootState) => state.meals.mealsByCountriesList;
