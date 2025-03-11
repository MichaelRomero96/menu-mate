import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Menu: undefined;
  Orders: undefined;
};

// Define the type for navigation prop
export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
