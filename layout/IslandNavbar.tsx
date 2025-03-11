import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import Colors from '../theme/Colors';

const IslandNavbar = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <Icon name="food" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
        <Icon name="clipboard-list" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default IslandNavbar;
