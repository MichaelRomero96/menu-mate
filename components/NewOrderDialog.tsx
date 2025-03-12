import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { Dialog, Portal, Button, Text, Card, Chip, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchMealsCountries, fetchMealsByCountry } from '../store/menu/menu.actions';
import { ICreateOrder } from '../interfaces/orders';

interface OrderDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onCreateOrder: (order: ICreateOrder) => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({ visible, onDismiss, onCreateOrder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mealsCountries, selectedMeals } = useSelector((state: RootState) => state.menu);
  const [clientName, setClientName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchMealsCountries());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchMealsByCountry(selectedCountry));
    }
  }, [selectedCountry, dispatch]);

  const handleAddDish = (meal: any) => {
    setSelectedDishes([...selectedDishes, meal]);
  };

  const handleRemoveDish = (mealId: string) => {
    setSelectedDishes(selectedDishes.filter(dish => dish.idMeal !== mealId));
  };

  const handleSubmit = () => {
    if (!clientName.trim()) {
      alert('Please enter the client name');
      return;
    }

    const order: ICreateOrder = {
      clientName,
      detail: {
        dishes: selectedDishes,
        totalDishes: selectedDishes.length,
      },
    };

    onCreateOrder(order);
    onDismiss();
    setClientName('');
    setSelectedDishes([]);
    setSelectedCountry(null);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>Create New Order</Text>
            <IconButton icon="close" size={24} onPress={onDismiss} />
          </View>
        </SafeAreaView>

        <Dialog.Content style={styles.content}>
          {/* Client Name Input */}
          <Text style={styles.label}>Client Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter client name"
            value={clientName}
            onChangeText={setClientName}
          />

          {/* Country Selector */}
          <Text style={styles.label}>Select a Country:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {mealsCountries.map((item) => (
              <Chip
                key={item.strArea}
                style={styles.chip}
                onPress={() => setSelectedCountry(item.strArea)}
                selected={selectedCountry === item.strArea}
              >
                {item.strArea}
              </Chip>
            ))}
          </ScrollView>

          {/* Scrollable Meals Grid */}
          <ScrollView style={styles.mealScrollView}>
            {selectedCountry && (
              <FlatList
                data={selectedMeals}
                keyExtractor={(item) => item.idMeal}
                numColumns={2}
                columnWrapperStyle={styles.gridWrapper}
                renderItem={({ item }) => (
                  <Card
                    mode="elevated"
                    onPress={() => handleAddDish(item)}
                    style={styles.mealCard}
                  >
                    <Card.Cover source={{ uri: item.strMealThumb }} style={styles.mealImage} />
                    <Card.Content>
                      <Text variant="titleSmall" style={styles.mealText}>{item.strMeal}</Text>
                    </Card.Content>
                  </Card>
                )}
              />
            )}
          </ScrollView>

          {/* Selected Dishes */}
          {selectedDishes.length > 0 && (
            <View>
              <Text style={styles.label}>Selected Dishes:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                {selectedDishes.map((dish) => (
                  <Chip key={dish.idMeal} onClose={() => handleRemoveDish(dish.idMeal)} style={styles.chip}>
                    {dish.strMeal}
                  </Chip>
                ))}
              </ScrollView>
            </View>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button mode="contained" onPress={handleSubmit} disabled={selectedDishes.length === 0}>
            Confirm Order
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    width: '95%',
    alignSelf: 'center',
    maxHeight: '90%', // Ensures the dialog does not take full screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    marginRight: 6,
    paddingHorizontal: 10,
  },
  mealScrollView: {
    maxHeight: 300, // Allows scrolling within the dialog
    marginTop: 10,
  },
  gridWrapper: {
    justifyContent: 'space-between',
  },
  mealCard: {
    flex: 1,
    maxWidth: '48%', // Smaller cards for better layout
    margin: 6,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
  },
  mealImage: {
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  mealText: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default OrderDialog;
