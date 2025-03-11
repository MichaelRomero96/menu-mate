module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'], // 👈 Asegura que jest.setup.js corre después de inicializar Jest
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-navigation|@react-navigation)/)',
  ],
};
