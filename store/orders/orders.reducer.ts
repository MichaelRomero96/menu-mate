import {createReducer} from '@reduxjs/toolkit';
import {IOrder} from '../../interfaces/orders';
import {getOrders, newOrder, restoreProcessingOrders} from './orders.actions';

enum Status {
  NOT_INITIALIZED = 'not_initialized',
  PROCESSING = 'processing',
  ERROR = 'error',
  SUCCESS = 'success',
}

interface OrdersState {
  ordersList: IOrder[];
  newOrderStatus: Status;
  newOrder: IOrder | null;
  restoreProcessingOrdersStatus: Status;
}

const initialState: OrdersState = {
  ordersList: [],
  newOrderStatus: Status.NOT_INITIALIZED,
  newOrder: null,
  restoreProcessingOrdersStatus: Status.NOT_INITIALIZED,
};

export const ordersReducer = createReducer(initialState, builder => {
  // Get orders
  builder.addCase(getOrders.pending, state => ({
    ...state,
    ordersList: [],
  }));
  builder.addCase(getOrders.rejected, state => ({
    ...state,
    ordersList: [],
  }));
  builder.addCase(getOrders.fulfilled, (state, action) => ({
    ...state,
    ordersList: action.payload,
  }));
  // Add a new order
  builder.addCase(newOrder.pending, state => ({
    ...state,
    newOrderStatus: Status.PROCESSING,
  }));
  builder.addCase(newOrder.rejected, state => ({
    ...state,
    newOrderStatus: Status.ERROR,
  }));
  builder.addCase(newOrder.fulfilled, (state, action) => {
    state.newOrderStatus = Status.SUCCESS;
    state.newOrder = action.payload;
    state.ordersList.push(action.payload);
  });
  // Restore Processing orders
  builder.addCase(restoreProcessingOrders.pending, state => ({
    ...state,
    restoreProcessingOrdersStatus: Status.PROCESSING,
  }));
  builder.addCase(restoreProcessingOrders.rejected, state => ({
    ...state,
    restoreProcessingOrdersStatus: Status.ERROR,
  }));
  builder.addCase(restoreProcessingOrders.fulfilled, (state) => ({
    ...state,
    restoreProcessingOrdersStatus: Status.SUCCESS,
  }));
});

export default ordersReducer;
