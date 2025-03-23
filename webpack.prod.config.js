const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.js");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  // entry: '',
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "./dist/"),
  },

  plugins: [
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: "./src/index.html",
            to: "./index.html",
          },
        ],
      },
      { copyUnmodified: true }
    ),
  ],
  optimization: {
    minimizer: [ new TerserPlugin()],
  },
});
