const path = require("path");
const Webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseConfig = {
  entry: "./src/Index.tsx",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "ora-games-browser.js",
    library: "gamesBrowser",
    libraryTarget: "var"
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
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   loader: "style-loader"
          // },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "ora-games-browser.css",
      chunkFilename: "[id].css"
    })
  ]
};

module.exports = baseConfig;
