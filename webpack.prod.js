const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");

const extractCSS = new ExtractTextPlugin("stylesheets/[name]-one.css");
const extractSASS = new ExtractTextPlugin("stylesheets/[name]-two.css");

module.exports = merge(common, {
  mode: "production",
  entry: {
    index: "./src/index.tsx"
  },
  module: {
    rules: [
      {
        test: /consts\.tsx/,
        loader: "ip.js",
        options: {
          web: { host: "music.ewpan.com" },
          list: { host: "music.ewpan.com" }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      prod: true,
      template: "./src/index.hbs",
      react: "production.min"
    }),
    new CopyWebpackPlugin([
      { from: "./src/vendors/", to: "vendors" },
      {
        from: "./node_modules/react/umd/react.production.min.js",
        to: "./"
      },
      {
        from: "./node_modules/react-dom/umd/react-dom.production.min.js",
        to: "./"
      }
    ])

    // new UglifyJSPlugin({
    //   uglifyOptions: {
    //     output: { comments: false }
    //   }
    // }),
    // new webpack.DefinePlugin({
    //   "process.env.NODE_ENV": JSON.stringify("production")
    // }),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.HashedModuleIdsPlugin(),
    // extractCSS,
    // extractSASS,
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src/index.html"),
    //   path: "./",
    //   excludeChunks: ["base"],
    //   filename: "index.html",
    //   minify: {
    //     collapseWhitespace: true,
    //     collapseInlineTagWhitespace: true,
    //     removeComments: true,
    //     removeRedundantAttributes: true
    //   }
    // }),
    // new StyleExtHtmlWebpackPlugin({
    //   minify: true
    // }),
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ]
});
