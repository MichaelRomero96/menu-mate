import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mealsReducer from './meals.reducer';

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
