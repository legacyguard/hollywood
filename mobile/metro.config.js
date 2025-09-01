const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Increase the transformer worker pool to handle more files
config.maxWorkers = 2;

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

module.exports = config;
