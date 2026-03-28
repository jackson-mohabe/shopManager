const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    global_defs: {
      "process.on": undefined,
    },
  },
};

module.exports = config;
