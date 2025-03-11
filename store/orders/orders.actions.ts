import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICreateOrder, IOrder, OrderStatus } from '../../interfaces/orders';
import OrdersService from '../../services/orders.service';

export const getOrders = createAsyncThunk<IOrder[], OrderStatus | undefined>(
  'orders/get',
  async (status?: OrderStatus) => {
    return await OrdersService.getOrders(status);
  },
);

export const newOrder = createAsyncThunk<IOrder, ICreateOrder>(
  'orders/new',
  async (order: ICreateOrder) => {
    const createdOrder = await OrdersService.addNewOrder(order);
    return createdOrder;
  },
);

export const restoreProcessingOrders = createAsyncThunk<void, void>(
  'orders/restoreProcessing',
  async () => {
    await OrdersService.restoreProcessingOrders();
  }
);

export const listenForOrderUpdates = createAsyncThunk<void>(
  'orders/listenForUpdates',
  async (_, { dispatch }) => {
    OrdersService.on('ordersUpdated', () => {
      dispatch(getOrders()); // Refresh orders when service updates
    });
  }
);
