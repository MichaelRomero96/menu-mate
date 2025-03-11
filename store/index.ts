import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import menuReducer from './menu/menu.reducer';
import ordersReducer from './orders/orders.reducer';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    orders: ordersReducer,
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
