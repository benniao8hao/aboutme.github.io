"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const bundleConfig = require("../bundle-config.json");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const fs = require("fs");
const env = require("../config/prod.env");
const CompressionPlugin = require("compression-webpack-plugin");

const webpackConfig = merge(baseWebpackConfig, {
  //合并、覆盖webpack配置
  module: {
    loaders: [{
        test: /\.css$/,
        // loader: 'style-loader!css-loader!autoprefixer-loader'
        // 打包提取css
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!autoprefixer-loader"
        })
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!autoprefixer-loader!less-loader"
      }
    ],
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath("js/[name].[chunkhash:6].js"),
    chunkFilename: utils.assetsPath("js/[id].[chunkhash:6].js")
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      "process.env": env
    }),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      parallel: true, //4
      sourceMap: false,
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        },
        warnings: false
      },
      extractComments: false
    }),
    //通过合并小于 minChunkSize 大小的 chunk，将 chunk 体积保持在指定大小限制以上。
    //以减少文件数量达到减少http请求目的
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 20000 // Minimum number of characters
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath("css/[name].[contenthash:4].css"), // 抽离css文件
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: "index.html",
      inject: true,
      // 加载dll文件
      vendorJsName: bundleConfig.vendor.js,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: "dependency",
      serviceWorkerLoader: `<script>${fs.readFileSync(
        path.join(__dirname, "./service-worker-prod.js"),
        "utf-8"
      )}</script>`
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    //忽略指定路径下指定内容不打包 https://webpack.docschina.org/plugins/ignore-plugin/
    //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), //忽略 moment 的本地化内容
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../static"),
      to: config.build.assetsSubDirectory,
      ignore: [".*"]
    }]),
    // service worker caching
    new SWPrecacheWebpackPlugin({
      cacheId: "my-vue-app",
      filename: "service-worker.js",
      staticFileGlobs: ["dist/**/*.{js,html,css}"],
      minify: true,
      stripPrefix: "dist/"
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor" //把webpack.base.config.js中 entry 中的 vendor 那些公共的东西抽离
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   async: "used-twice",
    //   minChunks: (module, count) => count >= 2
    // })
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
