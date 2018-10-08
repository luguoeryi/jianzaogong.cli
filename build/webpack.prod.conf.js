const path = require('path')
const glob = require('glob-all') // 处理多路径

const webpack = require('webpack')
const PurifyCSS = require('purifycss-webpack') // 去除废代码 css
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin') // 将代码块插入html
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清除目录
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包资源map图

module.exports = {
    plugins: [

        // new BundleAnalyzerPlugin(),

        new webpack.NamedChunksPlugin(), // 模块id换成模块名称代替 -- 用于长缓存

        new webpack.NamedModulesPlugin(), // 解决模块引入位置变化导致的hash变化 -- 用于长缓存

        new PurifyCSS({
            paths: glob.sync([
                './*.html',
                './src/*.js'
            ])
        }),

        // 提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),

        // 提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        new HtmlWebpackInlineChunkPlugin({
            inlineChunks: ['manifest']
        }),

        // 去除废代码js
        new webpack.optimize.UglifyJsPlugin(),

        // 清除目录
        new CleanWebpackPlugin(path.resolve(__dirname, '../dist'))
        
    ]
}