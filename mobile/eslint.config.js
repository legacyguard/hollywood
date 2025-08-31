import rootConfig from '../eslint.config.js';

export default [
  ...rootConfig,
  {
    ignores: ['*.config.js', 'metro.config.js', 'babel.config.js', 'app.config.js', '.expo/', 'node_modules/']
  }
];
