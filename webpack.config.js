const path = require('path');
const glob = require('glob-all'); // 处理多路径

const Webpack = require('webpack');

const PurifyCSS = require('purifycss-webpack'); // 去除废代码 css
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 提取css
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动注入依赖
const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin'); // 将代码块插入html
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除目录

var extractScss = new ExtractTextWebpackPlugin({
    filename: 'assets/css/[name]-bundle-[hash:5].css',
    allChunks: false // 只提取初始化css
})

module.exports = {
    entry: {
        app: './src/app.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'assets/js/[name]-bundle-[hash:5].js',
        chunkFilename: 'assets/js/[name]-bundle-[hash:5].js' // 动态打包名称
    },

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

    // resolve: { 本地引入需要指定路径
    //     alias: {
    //         jquery$: path.resolve(__dirname, 'src/assets/lib/jquery/jquery.js')
    //     }
    // },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                ]
            },

            {
                test: /\.scss$/, 
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            // singleton: true, // 合并
                            transform: './css.transform.js', // 浏览器环境处理
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            sourceMap: true                            
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',   
                            plugins: [
                                // require('autoprefixer')(),
                                require('postcss-sprites')({
                                    spritePath: './dist/assets/img',
                                    retina: true
                                }), // 合成雪碧图
                                require('postcss-preset-env')() // 添加css前缀及蔚来语法
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },

            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].[ext]',
                            limit: 5000,
                            fallback: 'file-loader',
                            publicPath: '/assets/img',
                            outputPath: 'assets/img'
                            // useRelativePath: true
                        }
                    },

                    {
                        loader: 'img-loader',
                        options: {
                            pngquant: {
                                quality: 80
                            }
                        }
                    }
                ]
            },

            {
                test: /\.(eot|woff2|woff|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].[ext]',
                            limit: 5000,
                            fallback: 'file-loader',
                            publicPath: '../fonts',
                            outputPath: 'assets/fonts'
                            // useRelativePath: true
                        }
                    }
                ]
            },

            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', 'img:data-src', 'audio:src'],
                            minimize: true
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        extractScss,

        new PurifyCSS({
            paths: glob.sync([
                path.join(__dirname, './*.html'),
                path.join(__dirname, './src/*.js')
            ])
        }),

        // 提取公共代码
        new Webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),

        new HtmlWebpackInlineChunkPlugin({
            inlineChunks: ['manifest']
        }),

        // 配置全局插件
        new Webpack.ProvidePlugin({
            $: 'jquery'
        }),
        
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            minify: {
                collapseWhitespace: true
            }
            // inject: false,
            // chunks: ['app']
        }),

        // 去除废代码js
        // new Webpack.optimize.UglifyJsPlugin(),

        // 清除目录
        new CleanWebpackPlugin(['dist']),

        // 热更新
        new Webpack.HotModuleReplacementPlugin(),

        // 热更新信息
        new Webpack.NamedModulesPlugin()
    ]
}