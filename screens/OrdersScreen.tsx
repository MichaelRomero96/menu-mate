import React, {useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store';
import {
  getOrders,
  newOrder,
  restoreProcessingOrders,
} from '../store/orders/orders.actions';
import {ICreateOrder} from '../interfaces/orders';
import {Card, Text, Button} from 'react-native-paper';
import { prepareDB } from '../db/orders';

const OrdersScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {ordersList} = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    prepareDB();
    dispatch(restoreProcessingOrders());
    dispatch(getOrders());
  }, [dispatch]);

  const handleNewOrder = () => {
    const dishes = [
      {
        idMeal: '53060',
        strMeal: 'Burek',
        quantity: 1,
        strMealThumb:
          'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
      },
    ];
    const order: ICreateOrder = {
      clientName: 'John Doe',
      detail: {
        dishes,
        totalDishes: dishes.length,
      },
    };
    dispatch(newOrder(order)).then(() => dispatch(getOrders()));
  };

  if (ordersList.length === 0) {
    return (
      <View style={{flex: 1, padding: 16}}>
        <Text
          style={{textAlign: 'center', marginBottom: 10}}>
          There are no orders to display
        </Text>

        {/* Create Order Button */}
        <Button
          mode="contained"
          onPress={handleNewOrder}
          style={{marginBottom: 20}}>
          Create New Order
        </Button>
      </View>
    );
  }

  return (
    <View style={{flex: 1, padding: 16}}>
      <Text
        variant="titleLarge"
        style={{fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>
        Orders
      </Text>

      {/* Create Order Button */}
      <Button
        mode="contained"
        onPress={handleNewOrder}
        style={{marginBottom: 20}}>
        Create New Order
      </Button>

      {/* Orders List */}
      <FlatList
        data={ordersList}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Card mode="elevated" style={{marginBottom: 10, elevation: 3}}>
            <Card.Content>
              <Text variant="titleMedium">{item.clientName}</Text>
              <Text>Status: {item.status}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

export default OrdersScreen;
