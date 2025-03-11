import { createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, OrderStatus } from '../../interfaces/orders';
import OrdersService from '../../services/orders.service';
import Order from '../../db/models/order';

export const getOrders = createAsyncThunk<IOrder[], OrderStatus | undefined>(
  'orders/get',
  async (status?: OrderStatus) => {
    return await OrdersService.getOrders(status);
  },
);

export const newOrder = createAsyncThunk<Order, IOrder>(
  'orders/new',
  async (order: IOrder) => {
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
