import { Model, DataTypes } from 'sequelize';
import sequelize from '../';
import { IOrder, OrderDetail, OrderStatus } from '../../interfaces/orders';

class Order extends Model implements IOrder {
  public id!: number;
  public clientName!: string;
  public status!: OrderStatus;
  public createdAt!: Date;
  public updatedAt!: Date;
  public detail!: OrderDetail;
  public receiptTime!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: OrderStatus.PENDING,
    },
    detail: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
  },
);

export default Order;
