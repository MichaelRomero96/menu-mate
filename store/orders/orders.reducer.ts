import { createReducer } from '@reduxjs/toolkit';
import { fetchMealsByCountry, fetchMealsCountries } from '../menu/menu.actions';
import { Order } from '../../interfaces/orders';

interface OrdersState {
  ordersList: Order[];
}

const initialState: OrdersState = {
  ordersList: [],
};

export const ordersReducer = createReducer(initialState, builder => {
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

export default ordersReducer;
