import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStaticNavigation} from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import {PaperProvider} from 'react-native-paper';

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default App;
