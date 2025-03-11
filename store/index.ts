import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import menuReducer from './menu/menu.reducer';
import ordersReducer from './orders/orders.reducer';
import { listenForOrderUpdates } from './orders/orders.actions';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

store.dispatch(listenForOrderUpdates());

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
