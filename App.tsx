import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './store';
import MenuScreen from './screens/MenuScreen';
import OrdersScreen from './screens/OrdersScreen';
import { RootStackParamList } from './navigation/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Menu">
        <RootStack.Screen name="Menu" component={MenuScreen} />
        <RootStack.Screen name="Orders" component={OrdersScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}

export default App;
