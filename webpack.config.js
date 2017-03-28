const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const port = 3000;
let url = 'localhost';
let useMock = false;

if (process.env.URL)
    url = process.env.URL;

if (process.env.USE_MOCK)
    useMock = process.env.USE_MOCK;


module.exports = {
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
        publicPath: `http://${url}:${port}/`,
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
        publicPath: '/',
        quiet: false,
        stats: 'errors-only',
        watchContentBase: false,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: 'eslint-loader'
            },
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/uqlibrary-react-toolbox/src')
                ],
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.json$/,
                exclude: [
                    /node_modules/,
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
                    'file-loader',
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
            'process.env.USE_MOCK': JSON.stringify(useMock)
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
        ]
    },
};
