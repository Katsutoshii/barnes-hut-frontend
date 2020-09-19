const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = (_, { mode }) => ({
  context: path.join(__dirname, "js"),
  entry: {
    index: "./index.js",
  },
  watchOptions: {
    poll: 1000,
  },
  output: {
    path: dist,
    filename: "[name].js",
  },
  module: {
    rules: [
      // other rules here
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.s?css$/i,
        use: [
          mode === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
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
