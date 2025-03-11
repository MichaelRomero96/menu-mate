import { createReducer } from '@reduxjs/toolkit';
import { MealsCountry, Meal } from '../api/theMealDB';
import { fetchMealsByCountry, fetchMealsCountries } from './meals.actions';

interface MealsState {
  mealsCountries: MealsCountry[];
  selectedCountry: string | null;
  selectedMeals: Meal[];
  mealsByCountriesList: { country: string; meals: Meal[] }[];
}

const initialState: MealsState = {
  mealsCountries: [],
  selectedCountry: null,
  selectedMeals: [],
  mealsByCountriesList: [],
};

export const mealsReducer = createReducer(initialState, builder => {
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

export default mealsReducer;
