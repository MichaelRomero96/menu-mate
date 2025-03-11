/* eslint-disable no-undef */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn().mockReturnValue({
    Navigator: jest.fn(({ children }) => children),
    Screen: jest.fn(() => null),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  createStaticNavigation: jest.fn().mockReturnValue(() => null),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  return {
    PaperProvider: ({ children }) => <>{children}</>,
  };
});
