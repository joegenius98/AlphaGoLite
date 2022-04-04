const path = require("path");
const webpack = require("webpack");
const process = require("process");

module.exports = {
  entry: "./play_go_web_app/frontend/src/index.js",
  output: {
    path: path.resolve(__dirname, "./play_go_web_app/frontend/static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: "DJANGO_SECRET_KEY" in process.env ? JSON.stringify("production") : JSON.stringify("development"),
      },
    }),
  ],
};
