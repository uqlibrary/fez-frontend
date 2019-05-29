'use strict';

const {resolve} = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InjectPreloader = require('preloader-html-webpack-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackStrip = require('strip-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RobotstxtPlugin = require('robotstxt-webpack-plugin');

const options = {
    policy: [
        {
            userAgent: "*",
            allow: [
                "/$",
                "/index.html$",
                "/contact$",
                "/view/*",
                "/data/*?*Signature=*&Key-Pair-Id=*",
                "/assets/*.svg",
                "/sitemap/*.xml",
                "/list-by-year/*.html",
                "/*.js",
                "/*.css"
            ],
            disallow: [
                "/"
            ]
        }
    ],
    sitemap: "https://espace.library.uq.edu.au/sitemap/sitemap-index.xml"
};

// get branch name for current build, if running build locally CI_BRANCH is not set (it's set in codeship)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';

// get configuration for the branch
const config = require('./config').default[branch] || require('./config').default.development;

// local port to serve production build
const port = 9000;

// use mock data if required
let useMock = (process && process.env && !!process.env.USE_MOCK) || false;

// config for development deployment
if(config.environment === 'development') {
    config.basePath += branch + '/';
}

const webpackConfig = {
    mode: 'production',
    devtool: 'source-map',
    // The entry file. All your app roots from here.
    entry: {
        main: resolve(__dirname, './src/index.js'),
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'moment', 'redux-form']
    },
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: 'frontend-js/[name]-[hash].min.js',
        publicPath: config.publicPath,
    },
    devServer: {
        contentBase: resolve(__dirname, './dist/', config.basePath),
        compress: true,
        port: port,
        host: '0.0.0.0'
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            title: config.title,
            gtm: config.gtm,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new WebpackPwaManifest({
            name: config.title,
            short_name: 'eSpace',
            description: 'The University of Queensland`s institutional repository.',
            background_color: '#49075E',
            theme_color: '#49075E',
            inject: true,
            ios: true,
            icons: [
                {
                    src: resolve(__dirname, './public/images', 'logo.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: 'icons',
                    ios: true
                }
            ],
            fingerprints: false
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(':percent')} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        // new ExtractTextPlugin('[name]-[hash].min.css'),
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].min.css'
        }),

        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            __DEVELOPMENT__: !process.env.CI_BRANCH,    // always production build on CI
            'process.env.NODE_ENV': JSON.stringify('production'),       // always production build on CI
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
            'process.env.ENABLE_LOG': JSON.stringify(!!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test'),
            'process.env.TITLE_SUFFIX': JSON.stringify(config.titleSuffix),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
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
        new BundleAnalyzerPlugin({
            analyzerMode: config.environment === 'production' ? 'disabled' : 'static',
            openAnalyzer: !process.env.CI_BRANCH
        }),
        new RobotstxtPlugin(options),
    ],
    optimization: {
        splitChunks: {
            automaticNameDelimiter: '-',
            cacheGroups: {
                commons: {
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                parallel: true
            })
        ]
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
                    resolve(__dirname, 'src'),
                    resolve(__dirname, 'node_modules/uqlibrary-react-toolbox/src')
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
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
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

// this is separated out because it causes local build to fail as the env vars required by Sentry arent available
if (!!process.env.SENTRY_AUTH_TOKEN) {
    const SentryCliPlugin = require('@sentry/webpack-plugin');

    // if you need to run this locally, create .sentryclirc and add the variables from the codeship env variables
    // per https://docs.sentry.io/learn/cli/configuration/#configuration-file
    // and comment out the if around this section
    webpackConfig.plugins.push(new SentryCliPlugin({
            release: process.env.CI_COMMIT_ID,
            include: './dist',
            ignore: ['node_modules', 'webpack-dist.config.js', 'custom_modules']
        })
    );
}

module.exports = webpackConfig;
