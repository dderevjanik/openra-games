const path = require("path");
const Webpack = require("webpack");

const baseConfig = {
  entry: "./src/Index.tsx",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "app.js"
  },
  devServer: {
    contentBase: __dirname + "/docs"
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        loader: 'ts-loader?configFile="tsconfig.json"',
        options: {
          configFile: "tsconfig.json"
        }
      }
    ]
  },
  plugins: []
};

module.exports = baseConfig;
