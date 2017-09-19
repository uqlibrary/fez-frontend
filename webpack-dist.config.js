'use strict';

const {resolve} = require('path');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const OfflinePlugin = require('offline-plugin');
const InjectPreloader = require('preloader-html-webpack-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const port = 9000;

// options for deployment: global title, Google tag manager id
const title = 'eSpace - The University of Queensland';
const gtm = 'GTM-T4NPC25';

let useMock = false;
if (process.env.USE_MOCK)
    useMock = process.env.USE_MOCK;

let URL_BASE_PATH = '';
let publicPath = '';
let publicPathOffline = '/';
let environment = 'staging';

if (process.env.CI_BRANCH !== 'production') {
    URL_BASE_PATH += 'espace/' + process.env.CI_BRANCH + '/';
    publicPathOffline += URL_BASE_PATH;
} else {
    environment = 'production';
    publicPath = '/';
}

module.exports = {
    devtool: 'source-map',
    // The entry file. All your app roots from here.
    entry: [
        "babel-polyfill",
        resolve(__dirname, './src/index.js')
    ],
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', URL_BASE_PATH),
        filename: '[name]-[hash].min.js',
        publicPath: publicPath
    },
    devServer: {
        contentBase: resolve(__dirname, './dist/', URL_BASE_PATH),
        compress: true,
        port: port,
        host: '0.0.0.0'
    },
    plugins: [
        new FaviconsWebpackPlugin({
            logo: './public/images/logo.png',
            prefix: 'mobile-icons/',
            background: '#49075E',
            title: title
        }),
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            title: title,
            gtm: gtm,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(':percent')} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,

            },
            output: {
                comments: false,
            },
        }),
        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            __DEVELOPMENT__: false,
            'process.env.NODE_ENV': JSON.stringify(environment),
            'process.env.BASE_PATH': JSON.stringify(URL_BASE_PATH),
            'process.env.USE_MOCK': JSON.stringify(useMock)
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                postcss: [
                    autoprefixer
                ],
                eslint: {
                    configFile: '.eslintrc',
                    failOnWarning: false,
                    failOnError: true
                }
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // Put it in the end to capture all the HtmlWebpackPlugin's
        // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
        new OfflinePlugin({
            relativePaths: false,
            publicPath: publicPathOffline,
            caches: {
              main: [':rest:'],
            },
            AppCache : {
              directory: './'
            }
        }),
        new InjectPreloader()
    ],
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
                exclude: /node_modules/,
                include: [
                    resolve(__dirname, 'src'),
                    resolve(__dirname, 'node_modules/uqlibrary-react-toolbox/src')
                ],
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader",
                }),
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader',
                ],
            }
        ]
    },
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
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
        hints: 'warning'
    },
};
