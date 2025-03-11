import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './IslandNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
