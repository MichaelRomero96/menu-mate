import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Colors from '../theme/Colors';

type ButtonVariant = 'primary' | 'secondary';
type TextVariant = 'title' | 'body1' | 'body2';

interface ButtonProps extends TouchableOpacityProps {
  variant: ButtonVariant;
  textVariant: TextVariant;
  iconName?: string;
}

const Button: React.FC<ButtonProps> = ({ textVariant, variant, children, ...props }) => {
  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        styles[variant],
      ]}
      onPress={props.onPress}
    >
      <Text style={[
        styles[textVariant],
        styles[variant],
      ]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  primary: {
    backgroundColor: Colors.primary,
    color: Colors.white,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 14,
  },
});

export default Button;
