import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'orders.db', location: 'default' },
  () => console.log('Database connected!'),
  error => console.error('Database error:', error)
);

export default db;
