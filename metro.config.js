const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuração para resolver problemas com expo-sqlite na web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Adiciona configuração para resolver módulos web do expo-sqlite
config.resolver.alias = {
  ...config.resolver.alias,
};

// Configuração específica para web - desabilita expo-sqlite na web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Configuração para ignorar expo-sqlite na web
config.resolver.blockList = [
  /node_modules\/expo-sqlite\/web\/.*/,
];

// Configuração específica para web
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;