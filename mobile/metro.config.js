const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [
  workspaceRoot,
  path.resolve(workspaceRoot, 'packages/ui'),
  path.resolve(workspaceRoot, 'packages/logic'),
  path.resolve(workspaceRoot, 'packages/shared'),
];

// Ensure Metro includes monorepo packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add support for TypeScript files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'ts', 'tsx'];

// Fix for @legacyguard packages
config.resolver.extraNodeModules = {
  '@legacyguard/ui': path.resolve(workspaceRoot, 'packages/ui'),
  '@legacyguard/logic': path.resolve(workspaceRoot, 'packages/logic'),
  '@hollywood/shared': path.resolve(workspaceRoot, 'packages/shared'),
};

module.exports = config;

// Configure watchman to use less file handles
config.watchFolders = [__dirname];
config.resolver.disableHierarchicalLookup = true;

// Add node_modules to blacklist to reduce file watching
config.resolver.blacklistRE = /node_modules\/.*\/node_modules/;

// Configure the transformer
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Use fewer workers to reduce file handle usage
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Limit concurrent connections
      return middleware(req, res, next);
    };
  },
};

// Export config with maxWorkers as a top-level option
module.exports = {
  ...config,
  maxWorkers: 2,
};
