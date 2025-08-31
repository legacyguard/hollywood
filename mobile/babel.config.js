module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['@legacyguard/ui', 'tamagui'],
          config: './node_modules/@legacyguard/ui/src/tamagui.config.ts',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
