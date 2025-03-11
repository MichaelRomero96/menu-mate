import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchMealsCountries, fetchMealsByCountry } from '../store/menu/menu.actions';
import Layout from '../layout';
import { Card, Text, List, IconButton } from 'react-native-paper';

const MenuScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mealsCountries, selectedMeals } = useSelector((state: RootState) => state.menu);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const loading = mealsCountries.length === 0;

  useEffect(() => {
    dispatch(fetchMealsCountries());
  }, [dispatch]);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    dispatch(fetchMealsByCountry(country));
  };

  return (
    <Layout>
      <View style={{ flex: 1, padding: 16 }}>
        {/* Back Button (only when a country is selected) */}
        {selectedCountry && (
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => setSelectedCountry(null)}
            style={{ alignSelf: 'flex-start' }}
          />
        )}

        {/* Title */}
        <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
          {selectedCountry ? `Meals from ${selectedCountry}` : 'Select a Country'}
        </Text>

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />}

        {/* Country List (Only when no country is selected) */}
        {!selectedCountry && (
          <FlatList
            data={mealsCountries}
            keyExtractor={(item) => item.strArea}
            renderItem={({ item }) => (
              <List.Item
                title={item.strArea}
                onPress={() => handleCountrySelect(item.strArea)}
                left={(props) => <List.Icon {...props} icon="earth" />}
                style={{ borderBottomWidth: 0, paddingVertical: 10, marginBottom: 5 }}
              />
            )}
          />
        )}

        {/* Meals Grid (Only when a country is selected) */}
        {selectedCountry && (
          <FlatList
            data={selectedMeals}
            keyExtractor={(item) => item.idMeal}
            numColumns={2} // Grid layout
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <Card
                mode="elevated"
                style={{
                  flex: 1,
                  margin: 6,
                  borderRadius: 10,
                  elevation: 4,
                  backgroundColor: '#fff',
                }}
              >
                <Card.Cover source={{ uri: item.strMealThumb }} style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                <Card.Content>
                  <Text variant="titleMedium" style={{ textAlign: 'center', marginTop: 5 }}>
                    {item.strMeal}
                  </Text>
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>
    </Layout>
  );
};

export default MenuScreen;
