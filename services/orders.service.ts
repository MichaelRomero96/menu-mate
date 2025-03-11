import {IOrder, OrderStatus} from '../interfaces/orders';
import Order from '../db/models/order';

class OrdersService {
  private static instance: OrdersService;
  private config = {
    cooks: 5, // Number of cooks
    cookTimePerDish: 1, // Minutes per dish
    processTime: 1, // Additional minute for processing the order
  };

  private availableCooks: number;
  private orderQueue: number[] = []; // Queue to manage orders

  private constructor() {
    this.availableCooks = this.config.cooks;
  }

  private calculateEstimatedTime(dishes: number): number {
    const baseTime = dishes * this.config.cookTimePerDish;
    return this.config.processTime + Math.ceil(baseTime / this.availableCooks);
  }

  private async processNextOrder(): Promise<void> {
    if (this.orderQueue.length === 0 || this.availableCooks === 0) {
      return; // No orders to process or no cooks available
    }

    const orderId = this.orderQueue.shift(); // Get the next order
    if (!orderId) {
      return;
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      console.log(`Order ${orderId} not found.`);
      return;
    }

    console.log(
      `Order ${orderId} is being prepared. Processing time: ${this.config.processTime} minute(s).`,
    );

    setTimeout(async () => {
      const estimatedTime = this.calculateEstimatedTime(
        order.detail.totalDishes,
      );
      await order.update({estimatedTime, status: OrderStatus.COOKING});

      console.log(
        `Order ${orderId} is now being cooked. Estimated cooking time: ${
          estimatedTime - this.config.processTime
        } minutes.`,
      );

      this.availableCooks--;

      setTimeout(async () => {
        await order.update({status: OrderStatus.READY});
        console.log(`Order ${orderId} has been completed.`);
        this.availableCooks++;

        // Continue processing the next order
        this.processNextOrder();
      }, (estimatedTime - this.config.processTime) * 60 * 1000);
    }, this.config.processTime * 60 * 1000);
  }

  // Singleton to ensure only one instance
  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  public async getOrders(status?: OrderStatus): Promise<IOrder[]> {
    try {
      const whereClause = status ? {where: {status}} : {};
      const orders = await Order.findAll(whereClause);
      console.log(
        `Fetched ${orders.length} order(s)${
          status ? ` with status: ${status}` : ''
        }.`,
      );
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders.');
    }
  }

  /**
   * Allows updating the configuration at runtime.
   */
  public updateConfig(
    newConfig: Partial<{
      cooks: number;
      cookTimePerDish: number;
      processTime: number;
    }>,
  ) {
    if (newConfig.cooks !== undefined) {
      this.config.cooks = newConfig.cooks;
      this.availableCooks = newConfig.cooks;
    }
    if (newConfig.cookTimePerDish !== undefined) {
      this.config.cookTimePerDish = newConfig.cookTimePerDish;
    }
    if (newConfig.processTime !== undefined) {
      this.config.processTime = newConfig.processTime;
    }
    console.log('Updated configuration:', this.config);
  }

  public async addNewOrder(order: IOrder): Promise<Order> {
    const estimatedTime = this.calculateEstimatedTime(order.detail.totalDishes);
    const createdOrder = await Order.create({
      estimatedTime,
      clientName: order.clientName,
      status: OrderStatus.PENDING,
      detail: order.detail,
    });

    console.log(
      `New order created. ID: ${createdOrder.id}, Estimated time: ${estimatedTime} minutes (including processing time).`,
    );

    this.orderQueue.push(createdOrder.id);
    this.processNextOrder(); // Start processing if possible
    return createdOrder;
  }

  public async restoreProcessingOrders(): Promise<void> {
    try {
      const ongoingOrders = await Order.findAll({
        where: {status: [OrderStatus.PENDING, OrderStatus.COOKING]},
        order: [['createdAt', 'ASC']], // Preserve the original queue order
      });

      this.orderQueue = ongoingOrders.map(order => order.id);
      console.log(`Restored ${this.orderQueue.length} orders to the queue.`);

      // Start processing if cooks are available
      this.processNextOrder();
    } catch (error) {
      console.error('Error restoring orders:', error);
    }
  }
}

export default OrdersService.getInstance();
