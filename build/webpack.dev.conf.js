const webpack = require('webpack')

module.exports = {
    devtool: 'cheap-module-source-map',

    devServer: {
        port: 9001,

        overlay: true,

        proxy: {
            '/api': {
                target: 'https://m.weibo.cn',
                changeOrigin: true
            }
        },
        // 模块热更新
        hot: true,
        // 禁止全局刷新
        hotOnly: true,

        // iframe 模式，显示编译状态
        // inline: false,

        // html5 api, 404重定向到index
        // historyApiFallback: true
        historyApiFallback: {
            rewrites: [
                {
                    from: /\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
                    to: function (context) {
                        return '/' + context.match[1] + context.match[2] + '.html'
                    }
                }
            ]
        }
    },

    plugins: [

        // 热更新
        new webpack.HotModuleReplacementPlugin(),

        // 热更新信息
        new webpack.NamedModulesPlugin()

    ]
}