import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { prepareDB } from '../db/orders';
import Layout from '../layout';

const MenuScreen = () => {
  useEffect(() => {
    prepareDB();
  }, []);

  return (
    <Layout>
      <View>
      <Text>MenuScreen</Text>
      </View>
    </Layout>
  );
};

export default MenuScreen;
