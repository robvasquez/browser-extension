const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const webpack = require('webpack');
const getClientEnvironment = require('./env');
const paths = require('./paths');

// Ensure the environment variables are read.
const publicUrl = paths.servedPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
    mode: 'production',
    bail: true,
    devtool: 'source-map',
    entry: paths.appIndexJs,
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].[contenthash:8].js',
        publicPath: publicUrl,
        clean: true,
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`,
        },
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: paths.appSrc,
                loader: require.resolve('babel-loader'),
                options: {
                    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                    presets: [
                        [
                            require.resolve('babel-preset-react-app'),
                            {
                                runtime: 'automatic',
                            },
                        ],
                    ],
                    plugins: [
                        require.resolve('react-refresh/babel'),
                    ],
                },
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                auto: true,
                            },
                        },
                    },
                    require.resolve('postcss-loader'),
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                auto: true,
                            },
                        },
                    },
                    require.resolve('sass-loader'),
                ],
            },
            {
                loader: require.resolve('file-loader'),
                exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            templateParameters: {
                PUBLIC_URL: publicUrl,
            },
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        new webpack.DefinePlugin(env.stringified),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    performance: false,
};
