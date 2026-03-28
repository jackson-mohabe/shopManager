const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/node_modules\/electron\/.*/];

config.resolver.extraNodeModules = {
  electron: false,
  fs: false,
  path: require.resolve("path-browserify"),
  util: require.resolve("util/"),
  os: require.resolve("os-browserify/browser"),
};

module.exports = config;
