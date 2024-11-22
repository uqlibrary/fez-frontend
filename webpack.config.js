'use strict';

const chalk = require('chalk');
const { resolve, join } = require('path');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const port = 3000;
const url = process.env.URL || 'localhost';
const useMock = !!process.env.USE_MOCK || false;
const publicPath = '';
const enableFastRefresh =
    process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc' && process.env.NODE_ENV !== 'production';

const orcidUrl = 'https://sandbox.orcid.org';
const orcidClientId = 'APP-OXX6M6MBQ77GUVWX';

module.exports = {
    mode: 'development',
    context: resolve(__dirname),
    devtool: 'source-map',
    entry: {
        webpackDevClient: `webpack-dev-server/client?http://${url}:${port}`,
        webPackDevServer: 'webpack/hot/only-dev-server',
        browserUpdate: join(__dirname, 'public', 'browser-update.js'),
        index: join(__dirname, 'src', 'index.js'),
    },
    output: {
        pathinfo: true,
        publicPath: `http://${url}:${port}/${publicPath}`,
    },
    devServer: {
        allowedHosts: 'all',
        compress: true,
        headers: { 'X-Custom-Header': 'yes' },
        historyApiFallback: true,
        host: url,
        https: false,
        open: false,
        port: port,
        client: {
            logging: 'info',
        },
        devMiddleware: {
            publicPath: `/${publicPath}`,
            stats: 'errors-only',
        },
        static: {
            directory: path.join(__dirname, 'public'),
            watch: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [resolve(__dirname, 'src')],
                exclude: [/node_modules/, /custom_modules/, '/src/mocks/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-export-default-from',
                            ['@babel/plugin-transform-spread', { loose: true }],
                            enableFastRefresh && 'react-refresh/babel',
                            'istanbul',
                        ].filter(Boolean),
                    },
                },
            },
            {
                test: /\.json$/,
                exclude: [/node_modules/, /custom_modules/],
                use: ['json-loader'],
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss|\.styl/,
                include: [resolve(__dirname, 'src')],
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            outputPath: '/assets/',
                            publicPath: '/assets/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
        }),
        new HtmlWebpackPlugin({
            favicon: join(__dirname, 'public', 'favicon.ico'),
            filename: 'index.html',
            reusablejs: 'https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js',
            // reusablejs: 'http://localhost:8080/uq-lib-reusable.min.js',
            inject: true,
            template: join(__dirname, 'public', 'index.html'),
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(
                ':percent',
            )} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        enableFastRefresh && new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [resolve(__dirname, './src')],
                    outputStyle: 'expanded',
                    sourceMap: true,
                },
                eslint: {
                    configFile: '.eslintrc',
                    failOnWarning: false,
                    failOnError: true,
                },
                postcss: {},
                context: join(__dirname),
            },
        }),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.APP_URL': JSON.stringify(`http://${url}:${port}/`),
            'process.env.FULL_PATH': JSON.stringify(process.env.FULL_PATH),
            'process.env.ORCID_URL': JSON.stringify(orcidUrl),
            'process.env.ORCID_CLIENT_ID': JSON.stringify(orcidClientId),
            'process.env.TITLE_SUFFIX': JSON.stringify('LOCAL'),
            'process.env.ENABLE_LOG': JSON.stringify(
                !!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc',
            ),
            'process.env.BRANCH': JSON.stringify('development'),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
            'process.env.SESSION_COOKIE_NAME': JSON.stringify(process.env.SESSION_COOKIE_NAME),
        }),
        new ESLintPlugin({ exclude: ['node_modules', 'custom_modules'] }),
        new Dotenv(),
    ].filter(Boolean),
    resolve: {
        descriptionFiles: ['package.json'],
        enforceExtension: false,
        extensions: ['.jsx', '.js', '.json'],
        modules: ['src', 'node_modules', 'custom_modules'],
        fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            console: require.resolve('console-browserify'),
            constants: require.resolve('constants-browserify'),
            crypto: require.resolve('crypto-browserify'),
            domain: require.resolve('domain-browser'),
            events: require.resolve('events'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            punycode: require.resolve('punycode'),
            process: require.resolve('process/browser'),
            querystring: require.resolve('querystring-es3'),
            stream: require.resolve('stream-browserify'),
            string_decoder: require.resolve('string_decoder'),
            sys: require.resolve('util'),
            timers: require.resolve('timers-browserify'),
            tty: require.resolve('tty-browserify'),
            url: require.resolve('url'),
            util: require.resolve('util'),
            vm: require.resolve('vm-browserify'),
            zlib: require.resolve('browserify-zlib'),
        },
    },
    optimization: {
        emitOnErrors: false,
        // moduleIds: 'named',
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
    },
};
