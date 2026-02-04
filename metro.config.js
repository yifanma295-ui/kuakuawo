const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Disable forceWriteFileSystem for production builds
  // This fixes the "Failed to get SHA-1" error on Vercel
  forceWriteFileSystem: false,
});
