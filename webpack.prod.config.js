const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.js");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    open: true, // Automatically opens the browser
    hot: true,  // Enables Hot Module Replacement
  },
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "./dist/"),
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/index.html",
          to: "./index.html",
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  stats: {
    warnings: false, // Disable warning logs
  },
});
