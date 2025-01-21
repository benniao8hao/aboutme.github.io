var path = require("path")
var webpack = require("webpack")
const AssetsPlugin = require('assets-webpack-plugin')
const package = require('../package.json')

module.exports = {
  entry: {
    //通过cdn 外部引用的组件 已经设置到 webpack.base.conf.js中的externals除外
    //排除 vux ，因为 vux 自己的 vux-loader，会导致失败
    //如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
    vendor: Object.keys(package.dependencies).filter((item) => {
      return item != 'vux' &&
        item != 'vue' &&
        item != 'vue-router' &&
        item != 'moment' &&
        item != 'vue-lazyload' &&
        item != 'html2canvas' &&
        item != 'fastclick' &&
        item != 'axios'
    })
  },
  output: {
    path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: 'dll.[name]_[hash:6].js', // vendor.dll.js中暴露出的全局变量名。
    library: '[name]_[hash:6]' // 与webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      //path: path.join(__dirname,'../', '[name]-manifest.json'),
      path: path.join(__dirname, '../', '[name]-manifest.json'), //用来做关联id的，打包的时候不会打包进去，所以不用放到static里
      name: "[name]_[hash:6]",
      context: __dirname
    }),
    // 把dll插入到html中
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: './'
    })
  ]
};
