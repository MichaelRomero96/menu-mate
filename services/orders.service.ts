import db from '../db';
import { IOrder, OrderStatus } from '../interfaces/orders';

class OrdersService {
  private static instance: OrdersService;
  private orderQueue: number[] = []; // Queue to manage orders
  private availableCooks = 5;

  private constructor() {}

  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  public async getOrders(status?: OrderStatus): Promise<IOrder[]> {
    return new Promise((resolve, reject) => {
      const query = status ? 'SELECT * FROM orders WHERE status = ?' : 'SELECT * FROM orders';
      const params = status ? [status] : [];

      db.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (_, results) => {
            const orders = [];
            for (let i = 0; i < results.rows.length; i++) {
              orders.push(results.rows.item(i));
            }
            resolve(orders);
          },
          (_, error) => {
            console.error('Error fetching orders:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  public async addNewOrder(order: IOrder): Promise<IOrder> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO orders (clientName, status, detail) VALUES (?, ?, ?)',
          [order.clientName, OrderStatus.PENDING, JSON.stringify(order.detail)],
          (_, results) => {
            const insertedId = results.insertId;
            resolve({ ...order, id: insertedId });
          },
          (_, error) => {
            console.error('Error inserting order:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  public async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE orders SET status = ?, updatedAt = datetime(\'now\') WHERE id = ?',
          [status, orderId],
          () => resolve(),
          (_, error) => {
            console.error('Error updating order status:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  public async restoreProcessingOrders(): Promise<void> {
    const orders = await this.getOrders(OrderStatus.PENDING);
    this.orderQueue = orders.map(order => order.id);
    this.processNextOrder();
  }

  private async processNextOrder(): Promise<void> {
    if (this.orderQueue.length === 0 || this.availableCooks === 0) {return;}

    const orderId = this.orderQueue.shift();
    if (!orderId) {return;}

    await this.updateOrderStatus(orderId, OrderStatus.COOKING);
    console.log(`Order ${orderId} is being cooked.`);

    this.availableCooks--;

    setTimeout(async () => {
      await this.updateOrderStatus(orderId, OrderStatus.READY);
      console.log(`Order ${orderId} is completed.`);
      this.availableCooks++;
      this.processNextOrder();
    }, 3000); // Simulating cook time
  }
}

export default OrdersService.getInstance();
