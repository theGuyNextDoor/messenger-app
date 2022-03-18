
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./static/src/index.jsx",
  output: {
    path: path.resolve(__dirname, "./static/dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  // plugins: [
  //   new webpack.DefinePlugin({
  //     "process.env": {
  //       // This has effect on the react lib size
  //       NODE_ENV: JSON.stringify("production"),
  //     },
  //   }),
  // ],
};