import EventEmitter from 'eventemitter3';
import db from '../db';
import {ICreateOrder, IOrder, OrderDetail, OrderStatus} from '../interfaces/orders';

class OrdersService extends EventEmitter {
  private static instance: OrdersService;
  private orderQueue: number[] = [];
  private availableCooks = 5;

  private constructor() {
    super();
  }

  private async getOrderById(orderId: number): Promise<IOrder | null> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM orders WHERE id = ?',
          [orderId],
          (_, results) => {
            if (results.rows.length > 0) {
              resolve(results.rows.item(0));
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          },
        );
      });
    });
  }

  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  public async getOrders(status?: OrderStatus): Promise<IOrder[]> {
    return new Promise((resolve, reject) => {
      const query = status
        ? 'SELECT * FROM orders WHERE status = ?'
        : 'SELECT * FROM orders';
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
          },
        );
      });
    });
  }

  public async addNewOrder(order: ICreateOrder): Promise<IOrder> {
    return new Promise((resolve, reject) => {
      console.log('Adding new order:', order);
      const createdAt = new Date().toISOString();
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO orders (clientName, status, detail, createdAt) VALUES (?, ?, ?, ?)',
            [
              order.clientName,
              OrderStatus.PENDING,
              JSON.stringify(order.detail),
              createdAt,
            ],
            (_, results) => {
              const insertedId = results.insertId;
              if (!insertedId) {
                reject(new Error('Order insertion failed, no ID returned'));
                return;
              }

              const newOrder: IOrder = {
                ...order,
                id: insertedId,
                status: OrderStatus.PENDING,
                createdAt,
              };

              this.orderQueue.push(insertedId); // Add order to queue
              this.emit('ordersUpdated'); // Notify listeners
              resolve(newOrder);

              // ✅ Start processing queue immediately
              this.processNextOrder();
            },
            (_, error) => {
              reject(new Error(error?.message || 'Unknown SQLite error'));
              return false;
            },
          );
        },
        txError => {
          reject(new Error(txError?.message || 'Transaction failed'));
        },
      );
    });
  }

  public async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE orders SET status = ?, updatedAt = datetime('now', 'localtime') WHERE id = ?",
          [status, orderId],
          (_, result) => {
            if (result.rowsAffected === 0) {
              console.error(
                `⚠️ Order ${orderId} update failed, no rows affected`,
              );
              reject(
                new Error(`Order ${orderId} not found or already updated`),
              );
              return false;
            }
            console.log(`✅ Order ${orderId} updated to status: ${status}`);
            this.emit('ordersUpdated'); // Notify listeners
            resolve();
          },
          (_, error) => {
            console.error(`❌ Error updating order ${orderId}:`, error);
            reject(error);
            return false;
          },
        );
      });
    });
  }

  public async restoreProcessingOrders(): Promise<void> {
    const orders = await this.getOrders(OrderStatus.PENDING);
    if (orders.length === 0) {
      console.log('⚠️ No pending orders to restore.');
      return;
    }

    console.log(`🔄 Restoring ${orders.length} pending orders...`);
    this.orderQueue = orders.map(order => order.id);
    this.processNextOrder();
  }

  private async processNextOrder(): Promise<void> {
    if (this.orderQueue.length === 0 || this.availableCooks === 0) {
      console.log('⚠️ No orders to process or no available cooks.');
      return;
    }

    console.log('continuing with pending order', this.orderQueue);

    const orderId = this.orderQueue.shift();
    if (!orderId) {
      return;
    }

    const order = await this.getOrderById(orderId);
    if (!order) {
      console.error(`❌ Order ${orderId} not found, skipping.`);
      this.processNextOrder();
      return;
    }

    const orderDetail = order?.detail as string;
    const parsedOrderDetail = JSON.parse(orderDetail) as OrderDetail;
    const orderItems = parsedOrderDetail.dishes.length || 1; // Default to 1 if no details

    console.log({ orderItems });

    // Calculate cooking time based on number of items and available cooks
    const baseCookingTime = orderItems * 20 * 1000; // 20s per dish
    const cookingTime = Math.max(20 * 1000, baseCookingTime / this.availableCooks); // At least 20s

    console.log(`🔥 Order ${orderId} will be cooked for ${cookingTime / 1000} seconds.`);

    try {
      await this.updateOrderStatus(orderId, OrderStatus.COOKING);
      this.availableCooks--;

      setTimeout(async () => {
        try {
          await this.updateOrderStatus(orderId, OrderStatus.READY);
          console.log(`✅ Order ${orderId} is completed.`);
          this.availableCooks++;
          this.processNextOrder();
        } catch (error) {
          console.error(`❌ Failed to update order ${orderId} to READY:`, error);
        }
      }, cookingTime);
    } catch (error) {
      console.error(`❌ Failed to update order ${orderId} to COOKING:`, error);
    }
}
}

export default OrdersService.getInstance();
