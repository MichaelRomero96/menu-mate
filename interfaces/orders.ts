import { Meal } from '../api/theMealDB';

export interface IOrder {
	id: number;
	clientName: string;
	detail: OrderDetail;
	status: OrderStatus;
	receiptTime: Date;
	createdAt: Date;
	updatedAt?: Date;
}

export interface OrderDetail {
	dishes: Meal[];
	estimatedTime: number;
	totalDishes: number;
}

export enum OrderStatus {
	PENDING = 'pending',
	COOKING = 'cooking',
	READY = 'ready'
}
