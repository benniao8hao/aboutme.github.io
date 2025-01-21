"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const vuxLoader = require("vux-loader");
const manifest = require("../vendor-manifest.json");
const webpack = require("webpack");
const AssetsPlugin = require("assets-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

let webpackConfig = {
  context: path.resolve(__dirname, "../"),
  entry: {
    app: ['babel-polyfill',
      './src/main.js'
    ]
  },
  output: {
    path: config.build.assetsRoot, //webpack输出的目标文件夹路径（例如：/dist）
    filename: "[name].js", //// webpack输出bundle文件命名格式，基于文件的md5生成Hash名称的script来防止缓存
    library: "[name]",
    publicPath: process.env.NODE_ENV === "production" ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath // webpack编译输出的发布路径(判断是正式环境或者开发环境等)
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    // 创建import或require的别名，一些常用的，路径长的都可以用别名
    alias: {
      //'vue$': 'vue/dist/vue.esm.js',
      "@": resolve("src")
    }
  },
  externals: {
    vue: "Vue",
    "vue-router": "VueRouter",
    moment: "moment",
    "vue-lazyload": "VueLazyload",
    html2canvas: "html2canvas",
    fastClick: "FastClick",
    axios: "axios"
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: "vue-loader",
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [resolve("src")],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 8192, //8192字节以上生成文件，否则base6
          name: utils.assetsPath("images/[name].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[ext]")
        }
      }
    ]
  },
  plugins: [
    // 关联dll拆分出去的依赖
    new webpack.DllReferencePlugin({
      manifest
    })
  ]
};

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ["vux-ui"] //, 'progress-bar', 'duplicate-style']
});
