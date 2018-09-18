const path = require('path')
const glob = require('glob-all') // 处理多路径

const webpack = require('webpack')
const PurifyCSS = require('purifycss-webpack') // 去除废代码 css
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin') // 将代码块插入html
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清除目录

module.exports = {
    plugins: [

        new PurifyCSS({
            paths: glob.sync([
                './*.html',
                './src/*.js'
            ])
        }),

        // 提取公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
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