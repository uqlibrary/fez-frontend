'use strict';

const {resolve} = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const OfflinePlugin = require('offline-plugin'); // turn off for staging while co-existing with legacy
const InjectPreloader = require('preloader-html-webpack-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackStrip = require('strip-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


// get branch name for current build, if running build locally CI_BRANCH is not set (it's set in codeship)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';

// get configuration for the branch
const config = require('./config').default[branch] || require('./config').default['development'];

// local port to serve production build
const port = 9000;

// use mock data if required
let useMock = (process && process.env && !!process.env.USE_MOCK) || false;

// config for development deployment
if(config.environment === 'development') {
    config.basePath += branch + '/';
}

module.exports = {
    devtool: 'source-map',
    // The entry file. All your app roots from here.
    entry: {
        main: resolve(__dirname, './src/index.js'),
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux']
    },
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: 'frontend-js/[name]-[hash].min.js',
        publicPath: config.publicPath
    },
    devServer: {
        contentBase: resolve(__dirname, './dist/', config.basePath),
        compress: true,
        port: port,
        host: '0.0.0.0'
    },
    plugins: [
        new FaviconsWebpackPlugin({
            logo: './public/images/logo.png',
            prefix: 'mobile-icons/',
            background: '#49075E',
            title: config.title
        }),
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            title: config.title,
            gtm: config.gtm,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(':percent')} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            __DEVELOPMENT__: !process.env.CI_BRANCH,    // always production build on CI
            'process.env.NODE_ENV': JSON.stringify('production'),       // always production build on CI
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.API_URL': JSON.stringify(config.api),
            'process.env.APP_URL': JSON.stringify(config.url(process.env.CI_BRANCH)),
            'process.env.BRANCH': JSON.stringify(config.environment),
            'process.env.ORCID_URL': JSON.stringify(config.orcidUrl),
            'process.env.ORCID_CLIENT_ID': JSON.stringify(config.orcidClientId),
            'process.env.PUBLIC_PATH': JSON.stringify(config.basePath),
            'process.env.GOOGLE_MAP_KEY': JSON.stringify(config.googleMaps),
            'process.env.ENABLE_LOG': JSON.stringify(!!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test'),
            'process.env.TITLE_SUFFIX': JSON.stringify(config.titleSuffix),
            'process.env.FEZ_URL': JSON.stringify('https://espace.library.uq.edu.au/'),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // Put it in the end to capture all the HtmlWebpackPlugin's
        // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
        // new OfflinePlugin({
        //     relativePaths: false,
        //     publicPath: config.basePath,
        //     caches: {
        //       main: [':rest:'],
        //     },
        //     AppCache : {
        //       directory: './'
        //     }
        // }),
        new InjectPreloader(),
        new UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: config.environment === 'production' ? 'disabled' : 'static',
            openAnalyzer: !process.env.CI_BRANCH
        })
    ],
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
                exclude: [
                    /node_modules/,
                    /custom_modules/
                ],
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
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                            publicPath: 'assets/'
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: WebpackStrip.loader('console.log')
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
            'custom_modules'
        ]
    },
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
        hints: 'warning'
    },
};
