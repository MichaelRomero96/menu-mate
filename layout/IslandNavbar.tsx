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
      <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.iconWrapper}>
        <Icon name="food" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Orders')} style={styles.iconWrapper}>
        <Icon name="clipboard-list" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: '45%',
    transform: [{ translateX: -60 }],
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 25,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 30,
  },
});

export default IslandNavbar;
