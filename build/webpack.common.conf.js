const productionConfig = require('./webpack.prod.conf.js')
const developmentConfig = require('./webpack.dev.conf.js')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // 提取css
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动注入依赖

const generateConfig = env => {

    const extractScss = new ExtractTextWebpackPlugin({
        filename: 'assets/css/[name]-bundle-[chunkhash:5].css',
        allChunks: false // 只提取初始化css
    })

    const scriptLoader = ['babel-loader']

    const cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                minimize: true,
                sourceMap: env === 'development'                            
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                sourceMap: env === 'development',   
                plugins: [
                    // require('autoprefixer')(),
                    require('postcss-sprites')({
                        spritePath: './dist/assets/img',
                        retina: true
                    }), // 合成雪碧图
                    require('postcss-preset-env')() // 添加css前缀及蔚来语法
                ]
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: env === 'development'
            }
        }
    ]

    const styleLoader = env === 'production'
        ? extractScss.extract({
            fallback: {
                loader: 'style-loader',
                options: {
                    // singleton: true, // 合并
                    transform: './css.transform.js', // 浏览器环境处理
                    sourceMap: env === 'development'
                }
            },
            use: cssLoaders
        }) : [{
            loader: 'style-loader',
            options: {
                // singleton: true, // 合并
                transform: './css.transform.js', // 浏览器环境处理
                sourceMap: env === 'development'
            }
        }].concat(cssLoaders)

    const fileLoader = (publicPath, outputPath) => {
        return env === 'development'
        ? [{
            loader: 'file-loader',
            options: {
                name: '[name]-[hash:5].[ext]',
                publicPath: publicPath,
                outputPath: outputPath
            }
        }] : [{
            loader: 'url-loader',
            options: {
                name: '[name]-[hash:5].[ext]',
                limit: 5000,
                fallback: 'file-loader',
                publicPath: publicPath,
                outputPath: outputPath
                // useRelativePath: true
            }
        }]
    }

    return {
        entry: {
            vendor: ['jquery'],
            app: './src/app.js'
        },

        output: {
            path: path.resolve(__dirname, '../dist'),
            publicPath: '/',
            filename: 'assets/js/[name]-bundle-[chunkhash:5].js',
            chunkFilename: 'assets/js/[name]-bundle-[chunkhash:5].js' // 动态打包名称
        },

        // resolve: { 本地引入需要指定路径
        //     alias: {
        //         jquery$: path.resolve(__dirname, '../src/assets/lib/jquery/jquery.js')
        //     }
        // },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [path.resolve(__dirname, '../src')],
                    exclude: [path.resolve(__dirname, '../src/assets/lib')],
                    use: scriptLoader
                },

                {
                    test: /\.scss$/, 
                    use: styleLoader
                },

                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: fileLoader('/assets/img', 'assets/img').concat(
                        env === 'production'
                        ? {
                            loader: 'img-loader',
                            options: {
                                pngquant: {
                                    quality: 80
                                }
                            }
                        } : []
                    )
                },

                {
                    test: /\.(eot|woff2|woff|ttf|svg)$/,
                    use: fileLoader('../fonts', 'assets/fonts')
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

            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './index.html',
                minify: {
                    collapseWhitespace: true
                }
                // inject: false,
                // chunks: ['app']
            }),

            // 配置全局插件
            new webpack.ProvidePlugin({
                $: 'jquery'
            })
         ]
    }
}

module.exports = env => {
    let config = env === 'production'
        ? productionConfig
        : developmentConfig

    return merge(generateConfig(env), config)
}