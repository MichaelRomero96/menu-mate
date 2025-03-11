import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getOrders, newOrder, restoreProcessingOrders } from '../store/orders/orders.actions';
import { Card, Text, Button, Snackbar, Divider, IconButton } from 'react-native-paper';
import { prepareDB } from '../db/orders';
import OrderDialog from '../components/NewOrderDialog';
import OrderDetailDialog from '../components/NewOrderDialog';
import { ICreateOrder, IOrder } from '../interfaces/orders';
import Colors from '../theme/Colors';

const OrdersScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ordersList } = useSelector((state: RootState) => state.orders);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    prepareDB();
    dispatch(restoreProcessingOrders());
    dispatch(getOrders());
  }, [dispatch]);

  // Handle new orders
  const handleCreateOrder = (order: ICreateOrder) => {
    dispatch(newOrder(order)).then(() => dispatch(getOrders()));
  };

  // Handle opening order details
  const openOrderDetails = (order: IOrder) => {
    let orderDetail;

    if (typeof order.detail === 'string') {
      try {
        orderDetail = JSON.parse(order.detail);
      } catch (error) {
        console.warn('JSON Parse Error:', error);
        orderDetail = { dishes: [], totalDishes: 0 };
      }
    } else if (typeof order.detail === 'object' && order.detail !== null) {
      orderDetail = order.detail;
    } else {
      orderDetail = { dishes: [], totalDishes: 0 };
    }

    setSelectedOrder({ ...order, parsedDetail: orderDetail });
  };

  // Show Snackbar notification when order status updates
  useEffect(() => {
    const latestOrder = ordersList[0];
    if (latestOrder && latestOrder.status) {
      setSnackbarMessage(`Order ${latestOrder.clientName} is now ${latestOrder.status}`);
      setSnackbarVisible(true);
    }
  }, [ordersList]);

  // Order status stepper icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'clock-outline';
      case 'Cooking':
        return 'chef-hat';
      case 'Ready':
        return 'check-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        Orders
      </Text>

      {/* Create Order Button */}
      <Button mode="contained" onPress={() => setDialogVisible(true)} style={{ marginBottom: 20, backgroundColor: Colors.primary }}>
        Create New Order
      </Button>

      {/* Orders List - Two Columns */}
      <FlatList
        data={ordersList}
        keyExtractor={item => item.id.toString()}
        numColumns={2} // Display orders in two columns
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Add space between columns
        renderItem={({ item }) => (
          <Card
            mode="elevated"
            style={{
              flex: 1,
              marginBottom: 10,
              marginHorizontal: 5,
              elevation: 3,
            }}
            onPress={() => openOrderDetails(item)}
          >
            <Card.Content style={{ alignItems: 'center' }}>
              <IconButton icon={getStatusIcon(item.status)} size={24} />
              <Text variant="titleMedium">{item.clientName}</Text>
              <Text>Status: {item.status}</Text>
            </Card.Content>
          </Card>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      {/* Order Dialog for Creating New Orders */}
      <OrderDialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} onCreateOrder={handleCreateOrder} />

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog order={selectedOrder} onDismiss={() => setSelectedOrder(null)} />
      )}

      {/* Snackbar Notifications */}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default OrdersScreen;
