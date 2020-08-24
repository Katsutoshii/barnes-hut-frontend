const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = (_, { mode }) => ({
  entry: {
    index: "./js/index.js",
  },
  output: {
    path: dist,
    filename: "[name].js",
  },
  module: {
    rules: [
      // other rules here
      {
        test: /\.s?css$/i,
        use: [
          mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devServer: {
    contentBase: dist,
  },
  plugins: [
    new CopyPlugin([path.resolve(__dirname, "static")]),

    new WasmPackPlugin({
      crateDirectory: __dirname,
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
});
