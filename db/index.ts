import { Sequelize } from 'sequelize';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const databasePath =
  Platform.OS === 'ios'
    ? `${RNFS.LibraryDirectoryPath}/database.sqlite`
    : `${RNFS.DocumentDirectoryPath}/database.sqlite`;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: false,
});

export default sequelize;
