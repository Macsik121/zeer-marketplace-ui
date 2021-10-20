require('dotenv').config();
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.mode || 'development';
const uiEndpoint = (
    mode == 'development'
        ? process.env.devUIEndpoint
        : process.env.deployUIEndpoint
);
const apiEndpoint = (
    mode == 'development'
        ? process.env.devAPIEndpoint + '/graphql'
        : process.env.deployAPIEndpoint + '/graphql'
);
const apiLoaderEndpoint = (
    mode == 'development'
        ? process.env.devAPIEndpoint + '/api_loader'
        : process.env.deployAPIEndpoint + '/api_loader'
)
const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

console.log(`uiEndpoint/apiEndpoint: ${uiEndpoint}/${apiEndpoint}`);

const browserConfig = {
    mode,
    entry: {
        app: './browser/App.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-react',
                                ['@babel/preset-env', {
                                    targets: {
                                        "edge": "17",
                                        "firefox": "60",
                                        "chrome": "67",
                                        "safari": "11.1"
                                    }
                                }]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|eot|ttf|woff)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                    name: '[name].[ext]'
                },
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'vendor'
        },
        minimize: mode == 'development' ? false : true,
        minimizer: mode == 'development' ? [] : [new TerserPlugin(), new CssMinimizerPlugin()]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].styles.css'
        }),
        new webpack.DefinePlugin({
            __isBrowser__: true,
            __SERVER_ENDPOINT_ADDRESS__: JSON.stringify(apiEndpoint),
            __UI_SERVER_ENDPOINT__: JSON.stringify(uiEndpoint),
            __API_LOADER_ENDPOINT__: JSON.stringify(apiLoaderEndpoint),
            __RECAPTCHA_KEY__: JSON.stringify(RECAPTCHA_KEY),
            __RECAPTCHA_SECRET__: JSON.stringify(RECAPTCHA_SECRET)
        })
    ]
};

const serverConfig = {
    mode,
    entry: { server: './server/uiserver.js' },
    target: 'node',
    externals: [nodeExternals()],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        "edge": "17",
                                        "firefox": "60",
                                        "chrome": "67",
                                        "safari": "11.1"
                                    },
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __isBrowser__: false,
            __SERVER_ENDPOINT_ADDRESS__: JSON.stringify(apiEndpoint),
            __UI_SERVER_ENDPOINT__: JSON.stringify(uiEndpoint),
            __API_LOADER_ENDPOINT__: JSON.stringify(apiLoaderEndpoint),
            __RECAPTCHA_KEY__: JSON.stringify(RECAPTCHA_KEY),
            __RECAPTCHA_SECRET__: JSON.stringify(RECAPTCHA_SECRET)
        })
    ]
};

module.exports = [browserConfig, serverConfig];