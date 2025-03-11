import { OrderStatus } from '../interfaces/orders';
import Order from '../db/models/order';

class OrderScheduler {
  private static instance: OrderScheduler;

  private config = {
    cooks: 5, // Number of cooks
    cookTimePerDish: 1, // Minutes per dish
  };

  private availableCooks: number;

  private constructor() {
    this.availableCooks = this.config.cooks;
  }

  // Singleton to ensure only one instance
  public static getInstance(): OrderScheduler {
    if (!OrderScheduler.instance) {
      OrderScheduler.instance = new OrderScheduler();
    }
    return OrderScheduler.instance;
  }

  /**
   * Allows updating the configuration at runtime.
   */
  public updateConfig(newConfig: Partial<{ cooks: number; cookTimePerDish: number }>) {
    if (newConfig.cooks !== undefined) {
      this.config.cooks = newConfig.cooks;
      this.availableCooks = newConfig.cooks;
    }
    if (newConfig.cookTimePerDish !== undefined) {
      this.config.cookTimePerDish = newConfig.cookTimePerDish;
    }
    console.log('Updated configuration:', this.config);
  }

  private calculateEstimatedTime(dishes: number): number {
    const baseTime = dishes * this.config.cookTimePerDish;
    return Math.ceil(baseTime / this.availableCooks);
  }

  public async processOrder(orderId: number): Promise<void> {
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.log(`Order ${orderId} not found.`);
      return;
    }

    const estimatedTime = this.calculateEstimatedTime(order.detail.totalDishes);
    await order.update({ estimatedTime, status: OrderStatus.COOKING });

    console.log(`Order ${orderId} is being processed. Estimated time: ${estimatedTime} minutes.`);

    this.availableCooks = Math.max(0, this.availableCooks - 1);

    setTimeout(async () => {
      await order.update({ status: OrderStatus.READY });
      console.log(`Order ${orderId} has been completed.`);
      this.availableCooks = Math.min(this.config.cooks, this.availableCooks + 1);
    }, estimatedTime * 60 * 1000);
  }

  public async addNewOrder(totalDishes: number): Promise<void> {
    const estimatedTime = this.calculateEstimatedTime(totalDishes);
    const order = await Order.create({ totalDishes, estimatedTime, status: OrderStatus.PENDING });

    console.log(`New order created. ID: ${order.id}, Estimated time: ${estimatedTime} minutes.`);
    this.processOrder(order.id);
  }
}

export default OrderScheduler.getInstance();
