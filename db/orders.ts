import db from '.';
import { OrderStatus } from '../interfaces/orders';

// Initialize orders table
export const prepareDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientName TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT '${OrderStatus.PENDING}',
        detail TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      );`,
      [],
      () => console.log('Orders table created successfully!'),
      (_, error) => console.error('Error creating orders table:', error)
    );
  });
};
