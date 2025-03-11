import { Meal } from '../api/theMealDB';

export interface ICreateOrder {
	clientName: string;
	detail: OrderDetail;
}

export interface IOrder {
	id: number;
	clientName: string;
	detail: OrderDetail | string;
	status: OrderStatus;
	createdAt: string;
	updatedAt?: string;
	receiptTime?: string;
}

export interface OrderDetail {
	dishes: Dish[];
	estimatedTime?: number;
	totalDishes: number;
}

interface Dish extends Meal {
	quantity: number;
}

export enum OrderStatus {
	PENDING = 'Pending',
	COOKING = 'Cooking',
	READY = 'Ready'
}
