module.exports = (api) => {
  api.cache(true);
  return {
    // babel-preset-expo 57 enables the `import.meta` transform by default and
    // automatically adds `react-native-worklets/plugin` for Reanimated 4.
    presets: ['babel-preset-expo'],
  };
};
