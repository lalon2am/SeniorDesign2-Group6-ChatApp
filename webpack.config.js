const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust this to your entry file
  output: {
    path: path.resolve(__dirname, 'dist'), // Adjust this to your desired output folder
    filename: 'bundle.js',
    clean: true, // Clean the output directory before emit
  },
  resolve: {
    extensions: ['.js', '.jsx', '.cjs', '.mjs'], // Add .cjs and .mjs
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|cjs|mjs)$/, // Include .cjs and .mjs
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Adjust presets as needed
          },
        },
      },
      {
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Example for handling CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Example for handling image files
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
  mode: 'development', // Change to 'production' for production builds
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000, // Change this to your desired port
  },
  ignoreWarnings: [
    {
      message: /Failed to parse source map/,
    },
  ],
};