const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@Assets': path.resolve(__dirname, 'src/assets'),
      '@Components': path.resolve(__dirname, 'src/components'),
      '@Context': path.resolve(__dirname, 'src/context'),
      '@Utils': path.resolve(__dirname, 'src/utils')
    }
  },
};