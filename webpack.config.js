const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const InjectPreloader = require('preloader-html-webpack-plugin');

const port = 3000;
const url = process.env.URL || 'localhost';
const useMock = !!process.env.USE_MOCK || false;
const publicPath = '';

const orcidUrl = 'https://sandbox.orcid.org';
const orcidClientId = 'APP-OXX6M6MBQ77GUVWX';

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname),
    devtool: 'source-map',
    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${url}:${port}`,
        'webpack/hot/only-dev-server',
        path.join(__dirname, 'src', 'index.js'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname),
        pathinfo: true,
        publicPath: `http://${url}:${port}/${publicPath}`,
    },
    devServer: {
        clientLogLevel: 'info',
        compress: true,
        contentBase: __dirname,
        headers: { 'X-Custom-Header': 'yes' },
        historyApiFallback: true,
        host: url,
        hot: true,
        https: false,
        inline: true,
        lazy: false,
        noInfo: true,
        open: false,
        port: port,
        publicPath: `/${publicPath}`,
        quiet: false,
        stats: 'errors-only',
        watchContentBase: false,
        disableHostCheck: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /custom_modules/
                ],
                enforce: 'pre',
                use: 'eslint-loader'
            },
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: [
                    /node_modules/,
                    /custom_modules/,
                    '/src/mocks/',
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                            ["@babel/plugin-transform-spread", { "loose": true }]
                        ]
                    }
                }
            },
            {
                test: /\.json$/,
                exclude: [
                    /node_modules/,
                    /custom_modules/
                ],
                use: [
                    'json-loader',
                ],
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.scss|\.styl/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/uqlibrary-react-toolbox/src')
                ],
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                            publicPath: 'assets/'
                        }
                    }
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: path.join(__dirname, 'public', 'favicon.ico'),
            filename: 'index.html',
            inject: true,
            template: path.join(__dirname, 'public', 'index.html'),
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(':percent')} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        new InjectPreloader(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [
                        path.resolve(__dirname, './src'),
                    ],
                    outputStyle: 'expanded',
                    sourceMap: true,
                },
                eslint: {
                    configFile: '.eslintrc',
                    failOnWarning: false,
                    failOnError: true
                },
                postcss: {},
                context: path.join(__dirname),
            },
        }),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.APP_URL': JSON.stringify(`http://${url}:${port}/`),
            'process.env.ORCID_URL': JSON.stringify(orcidUrl),
            'process.env.ORCID_CLIENT_ID': JSON.stringify(orcidClientId),
            'process.env.TITLE_SUFFIX': JSON.stringify('LOCAL'),
            'process.env.ENABLE_LOG': JSON.stringify(!!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test'),
            'process.env.BRANCH': JSON.stringify('development'),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
            'process.env.SESSION_COOKIE_NAME': JSON.stringify(process.env.SESSION_COOKIE_NAME),
        })
    ],
    resolve: {
        descriptionFiles: [
            'package.json',
        ],
        enforceExtension: false,
        extensions: [
            '.jsx',
            '.js',
            '.json',
        ],
        modules: [
            'src',
            'node_modules',
            'custom_modules'
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all'
                }
            }
        }
    }
};
