require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const process = require("process");
const fs = require("fs");
module.exports = {
  
  entry: ["./src/index.js"],
  devtool: "inline-source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [["@babel/transform-runtime"]],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        //loader: require.resolve('babel-loader')
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-syntax-jsx"]],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(.svg|.png|.jpg|.jpeg|.gif|.webp|.ttf)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets",
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp|ttf)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "build.css" }),
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            context: "./src/",
            from: "./assets/**/*",
            to: path.resolve(__dirname, "./dist/"),
            force: true,
          },
          {
            context: "./src/",
            from: "./font.css",
            to: path.resolve(__dirname, "./dist/"),
            force: true,
          },
          {
            context: "./src/",
            from: "./lib/**.*",
            to: path.resolve(__dirname, "./dist/"),
            force: true,
          },
        ],
      },
      { copyUnmodified: true }
    ),
  ],
};
