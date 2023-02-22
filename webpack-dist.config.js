'use strict';

const { resolve, join } = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RobotstxtPlugin = require('robotstxt-webpack-plugin');

const options = {
    policy: [
        {
            userAgent: '*',
            allow: [
                '/$',
                '/index.html$',
                '/about$',
                '/view/*',
                '/data/*',
                '/assets/*.svg',
                '/sitemap/*.xml',
                '/list-by-year/*.html',
                '/*.js',
                '/*.css',
            ],
            disallow: ['/'],
        },
    ],
    sitemap: 'https://espace.library.uq.edu.au/sitemap/sitemap-index.xml',
};

// get branch name for current build, if running build locally CI_BRANCH is not set (it's set in codeship)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';

// get configuration for the branch
const config = require('./config').default[branch] || require('./config').default.development;

// local port to serve production build
const port = 9000;

// use mock data if required
const useMock = (process && process.env && !!process.env.USE_MOCK) || false;

// config for development deployment
if (config.environment === 'development') {
    config.basePath += branch + '/';
}

const webpackConfig = {
    mode: 'production',
    devtool: 'source-map',
    // The entry file. All your app roots from here.
    entry: {
        browserUpdate: join(__dirname, 'public', 'browser-update.js'),
        main: resolve(__dirname, './src/index.js'),
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'moment', 'redux-form'],
    },
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: 'frontend-js/[name].min.js',
        publicPath: config.publicPath,
    },
    devServer: {
        compress: true,
        port: port,
        host: '0.0.0.0',
        static: {
            publicPath: resolve(__dirname, './dist/', config.basePath),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            title: config.title,
            gtm: config.gtm,
            hash: true,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(
                ':percent',
            )} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        // new ExtractTextPlugin('[name]-[hash].min.css'),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].min.css',
        }),

        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            __DEVELOPMENT__: !process.env.CI_BRANCH, // always production build on CI
            'process.env.NODE_ENV': JSON.stringify('production'), // always production build on CI
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.API_URL': JSON.stringify(config.api),
            'process.env.AUTH_LOGIN_URL': JSON.stringify(config.auth_login),
            'process.env.AUTH_LOGOUT_URL': JSON.stringify(config.auth_logout),
            'process.env.APP_URL': JSON.stringify(config.url(process.env.CI_BRANCH)),
            'process.env.FULL_PATH': JSON.stringify(config.fullPath(process.env.CI_BRANCH)),
            'process.env.BRANCH': JSON.stringify(config.environment),
            'process.env.ORCID_URL': JSON.stringify(config.orcidUrl),
            'process.env.ORCID_CLIENT_ID': JSON.stringify(config.orcidClientId),
            'process.env.PUBLIC_PATH': JSON.stringify(config.basePath),
            'process.env.GOOGLE_MAPS_URL': JSON.stringify(config.googleMaps),
            'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
            'process.env.ENABLE_LOG': JSON.stringify(
                !!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc',
            ),
            'process.env.TITLE_SUFFIX': JSON.stringify(config.titleSuffix),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
        }),
        new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
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
        new BundleAnalyzerPlugin({
            analyzerMode: config.environment === 'production' ? 'disabled' : 'static',
            openAnalyzer: !process.env.CI_BRANCH,
        }),
        new RobotstxtPlugin(options),
    ],
    optimization: {
        moduleIds: 'deterministic',
        removeAvailableModules: true,
        splitChunks: {
            automaticNameDelimiter: '-',
            minChunks: 5,
            chunks: 'all',
            cacheGroups: {
                commons: {
                    chunks: 'all',
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    sourceMap: false,
                    compress: {
                        drop_console: true,
                    },
                },
                parallel: true,
                extractComments: true,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /custom_modules/],
                enforce: 'pre',
                use: 'eslint-loader',
            },
            {
                test: /\.js?$/,
                include: [resolve(__dirname, 'src')],
                exclude: [/node_modules/, /custom_modules/, '/src/mocks/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                            ['@babel/plugin-transform-spread', { loose: true }],
                        ],
                    },
                },
            },
            {
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            outputPath: 'assets/',
                            publicPath: 'assets/',
                        },
                    },
                ],
            },
        ],
    },
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
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
        hints: 'warning',
    },
};

// this is separated out because it causes local build to fail as the env vars required by Sentry arent available
if (!!process.env.SENTRY_AUTH_TOKEN) {
    const SentryCliPlugin = require('@sentry/webpack-plugin');

    // if you need to run this locally, create .sentryclirc and add the variables from the codeship env variables
    // per https://docs.sentry.io/learn/cli/configuration/#configuration-file
    // and comment out the if around this section
    webpackConfig.plugins.push(
        new SentryCliPlugin({
            release: process.env.CI_COMMIT_ID,
            include: './dist',
            ignore: ['node_modules', 'webpack-dist.config.js', 'custom_modules'],
        }),
    );
}

// enable profiler
if (process.env.CI_BRANCH === 'your-branch') {
    webpackConfig.resolve.alias['react-dom$'] = resolve(__dirname, 'node_modules', 'react-dom/profiling');
    webpackConfig.resolve.alias['scheduler/tracing'] = resolve(
        __dirname,
        'node_modules',
        'scheduler/tracing-profiling',
    );
}

module.exports = webpackConfig;
