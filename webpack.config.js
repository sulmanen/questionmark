const path = require('path');

module.exports = {
  entry: './client/src/app.jsx',
  output: {
    path: path.resolve(__dirname, 'resources/public'),
    filename: 'questionmark.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },
};
