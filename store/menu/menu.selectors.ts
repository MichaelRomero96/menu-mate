import { RootState } from '..';

export const mealsCountriesSelector = (state: RootState) => state.menu.mealsCountries;
export const mealsByCountrySelector = (state: RootState) => state.menu.selectedMeals;
export const selectedCountrySelector = (state: RootState) => state.menu.selectedCountry;
export const mealsByCountriesListSelector = (state: RootState) => state.menu.mealsByCountriesList;
