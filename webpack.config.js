const path = require("path");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const lambdas = glob.sync("./src/backend/functions/**/lambda.ts");
const entry = lambdas.reduce((map, name) => {
  const pathParts = name.split("/");
  const canonicalName = pathParts[pathParts.length - 2];
  map[canonicalName] = name;
  return map;
}, {});

module.exports = {
  target: "node",
  mode: process.env.NODE_ENV || "development",
  entry,
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.build.json",
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin({})],
  },
  output: {
    filename: "functions/[name]/index.js",
    path: path.resolve(__dirname, "build"),
    libraryTarget: "commonjs",
  },
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    removeEmptyChunks: false,
    mergeDuplicateChunks: false,
    concatenateModules: false,
  },
  stats: "errors-only",
  plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
  externals: {
    "aws-sdk": "commonjs2 aws-sdk",
  },
  profile: false,
};
