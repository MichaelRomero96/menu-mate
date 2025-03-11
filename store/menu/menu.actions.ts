import {createAsyncThunk} from '@reduxjs/toolkit';
import MealDBApi, {Meal, MealsCountry} from '../../api/theMealDB';

export const fetchMealsCountries = createAsyncThunk<MealsCountry[]>(
  'menu/fetchMealsCountries',
  MealDBApi.getMealsCountries,
);

export const fetchMealsByCountry = createAsyncThunk<Meal[], string>(
  'menu/fetchMealsByCountry',
  async (country: string) => {
    const meal = await MealDBApi.getMealsByCountry(country);
    return meal;
  },
);
