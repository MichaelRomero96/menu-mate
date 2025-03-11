import { createReducer } from '@reduxjs/toolkit';
import { MealsCountry, Meal } from '../../api/theMealDB';
import { fetchMealsByCountry, fetchMealsCountries } from './menu.actions';

interface MenuState {
  mealsCountries: MealsCountry[];
  selectedCountry: string | null;
  selectedMeals: Meal[];
  mealsByCountriesList: { country: string; meals: Meal[] }[];
}

const initialState: MenuState = {
  mealsCountries: [],
  selectedCountry: null,
  selectedMeals: [],
  mealsByCountriesList: [],
};

export const menuReducer = createReducer(initialState, builder => {
  // Fetch Meals countries
  builder.addCase(fetchMealsCountries.pending, state => ({
    ...state,
    mealsCountries: [],
  }));
  builder.addCase(fetchMealsCountries.rejected, state => ({
    ...state,
    mealsCountries: [],
  }));
  builder.addCase(fetchMealsCountries.fulfilled, (state, action) => ({
    ...state,
    mealsCountries: action.payload,
  }));
  // Fetch Meal by country
  builder.addCase(fetchMealsByCountry.pending, state => ({
    ...state,
    selectedMeals: [],
  }));
  builder.addCase(fetchMealsByCountry.rejected, state => ({
    ...state,
    selectedMeals: [],
  }));
  builder.addCase(fetchMealsByCountry.fulfilled, (state, action) => ({
    ...state,
    selectedMeals: action.payload,
  }));
});

export default menuReducer;
