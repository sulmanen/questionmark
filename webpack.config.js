const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: ['./client/src/app.jsx'],
  output: {
    path: path.resolve(__dirname, 'resources/public/'),
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
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
