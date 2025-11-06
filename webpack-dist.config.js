'use strict';

const { resolve, join } = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
const branchType = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';

// get configuration for the branch
const config = require('./config').default[branchType] || require('./config').default.development;

// local port to serve production build
const port = 9000;

// use mock data if required
const useMock = (process && process.env && !!process.env.USE_MOCK) || false;

// config for development deployment
if (config.environment === 'development') {
    config.basePath += branchType + '/';
}

/**
 * Get some Git Commit Hash information.
 *
 * [currentCommitHash] (the most recent commit) is used in the path naming
 * for JS and CSS files, both for cache busting and to simplify housekeeping.
 *
 * [outputLastCommitHashes] when called will generate a file [hashFilenameFull] containing X amount of
 * previous commit hashes. This is used to perform housekeeping tasks
 * on files stored in the production S3 bucket.
 * Note: any errors occurred making this call will populate the [hashErrorFilenameFull] file
 * with details as to the cause.
 */

const { spawnSync, execSync } = require('child_process');
const fs = require('fs');

const outputLastCommitHashes = ({
    outputPath = resolve(__dirname, './dist/'),
    amount = 20,
    hashFilename = 'hash.txt',
    errorFilename = 'hashErrors.txt',
} = {}) => {
    const hashFilenameFull = `${outputPath}/${hashFilename}`;
    const hashErrorFilenameFull = `${outputPath}/${errorFilename}`;

    // get last [amount] commit hashes
    const stdio = [0, fs.openSync(hashFilenameFull, 'w'), fs.openSync(hashErrorFilenameFull, 'w')];
    spawnSync('git', ['log', '--format="%h"', `-n ${amount}`], { stdio });
};

// get last commit hash, and use in output filenames.
const currentCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

/** */

const webpackConfig = {
    mode: 'production',
    // The entry file. All your app roots from here.
    entry: {
        browserUpdate: join(__dirname, 'public', 'browser-update.js'),
        main: resolve(__dirname, './src/index.js'),
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'moment'],
    },
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: `frontend-js/${currentCommitHash}/[name]-[contenthash].min.js`,
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
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                include: [resolve(__dirname, 'src')],
                exclude: [/node_modules/, /custom_modules/, '/src/mocks/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            '@babel/plugin-proposal-export-default-from',
                            ['@babel/plugin-transform-spread', { loose: true }],
                        ].filter(Boolean),
                    },
                },
            },
            {
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    publicPath: `/${config.basePath}assets/`,
                    outputPath: 'assets/',
                    filename: '[hash][ext]',
                },
            },
        ],
    },
    plugins: [
        // this plugin is required for highlighting TS errors, please do not remove it
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: 'tsconfig.webpack-dist.json',
            },
            async: false,
            devServer: false,
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
        }),
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            reusablejs: config.reusablejs,
            title: config.title,
            gtm: config.gtm,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(
                ':percent',
            )} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        new MiniCssExtractPlugin({
            filename: `frontend-css/${currentCommitHash}/[name]-[contenthash].min.css`,
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

        new BundleAnalyzerPlugin({
            analyzerMode: config.environment === 'production' ? 'disabled' : 'static',
            openAnalyzer: !process.env.CI_BRANCH,
        }),
        new ESLintPlugin({ exclude: ['node_modules', 'custom_modules'] }),
        new RobotstxtPlugin(options),
        {
            // custom plugin that fires at the end of the build process, and outputs
            // a list of the last 20 git hashes to a file. Note that the function is
            // called like this to ensure [outputPath] exists. Were it to be called
            // sooner the command would fail and the build process would bomb.
            // The call to [outputLastCommitHashes] can be moved to the top of the
            // file if the output path does not need to contain [config.basePath].
            apply: compiler => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
                    const outputPath = resolve(__dirname, './dist/', config.basePath);
                    outputLastCommitHashes({ outputPath });
                });
            },
        },
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
    resolve: {
        descriptionFiles: ['package.json'],
        enforceExtension: false,
        extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
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
    const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

    // if you need to run this locally, create .sentryclirc and add the variables from the codeship env variables
    // per https://docs.sentry.io/learn/cli/configuration/#configuration-file
    // and comment out the if around this section
    webpackConfig.devtool = 'source-map';
    webpackConfig.plugins.push(
        sentryWebpackPlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            // Auth tokens can be obtained from https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/
            authToken: process.env.SENTRY_AUTH_TOKEN,
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
