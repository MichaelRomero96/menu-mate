import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  Dialog,
  Portal,
  Text,
  Button,
  IconButton,
  Card,
} from 'react-native-paper';
import {IOrder} from '../interfaces/orders';

interface OrderDetailDialogProps {
  order: IOrder | null;
  onDismiss: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  order,
  onDismiss,
}) => {
  if (!order) {
    return null;
  }

  // Ensure order details are parsed correctly
  let orderDetail = {dishes: []};

  if (typeof order.detail === 'string') {
    try {
      orderDetail = JSON.parse(order.detail);
    } catch (error) {
      console.warn('JSON Parse Error:', error);
    }
  } else if (typeof order.detail === 'object' && order.detail !== null) {
    orderDetail = order.detail;
  }

  return (
    <Portal>
      <Dialog
        visible={!!order}
        onDismiss={onDismiss}
        style={{
          marginTop: 40,
          width: '95%',
          alignSelf: 'center',
        }}>

        <Dialog.Title>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text variant="titleMedium">Order Details</Text>
            <IconButton icon="close" onPress={onDismiss} />
          </View>
        </Dialog.Title>

        <Dialog.Content>
          <Text variant="titleSmall" style={{fontWeight: 'bold'}}>
            Client: {order.clientName}
          </Text>
          <Text variant="bodyMedium" style={{marginBottom: 10}}>
            Status: {order.status}
          </Text>

          <ScrollView style={{maxHeight: 300}}>
            {orderDetail.dishes.length > 0 ? (
              orderDetail.dishes.map((dish: any, index: number) => (
                <Card key={index} style={{marginBottom: 10}}>
                  <Card.Content>
                    <Text variant="titleSmall" style={{fontWeight: 'bold'}}>
                      {dish.strMeal}
                    </Text>
                    <Text>
                      Quantity:{' '}
                      <Text style={{fontWeight: 'bold'}}>{dish.quantity || 1}</Text>
                    </Text>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={{textAlign: 'center', marginTop: 10}}>
                No dishes found.
              </Text>
            )}
          </ScrollView>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default OrderDetailDialog;
