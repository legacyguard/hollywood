module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@legacyguard/ui': '../packages/ui/src',
            '@legacyguard/logic': '../packages/logic/src',
            '@hollywood/shared': '../packages/shared/src'
          }
        }
      ],
      [
        '@tamagui/babel-plugin',
        {
          components: ['@legacyguard/ui', 'tamagui'],
          config: '../packages/ui/src/tamagui.config.ts',
        },
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
