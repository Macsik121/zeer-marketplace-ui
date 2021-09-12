require('dotenv').config();
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.mode || 'development';
const uiEndpoint = (
    mode == 'development'
        ? 'http://localhost:8080'
        : 'https://zeer-marketplace-ui-macsik121.herokuapp.com'
);
const apiEndpoint = (
    mode == 'development'
        ? 'localhost:3000/graphql'
        : 'https://zeer-marketplace-api-macsik121.herokuapp.com/graphql'
);

console.log(`uiEndpoint/apiEndpoint: ${uiEndpoint}/${apiEndpoint}`)

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
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            __isBrowser__: true,
            __SERVER_ENDPOINT_ADDRESS__: JSON.stringify(apiEndpoint),
            __UI_SERVER_ENDPOINT__: JSON.stringify(uiEndpoint)
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
            __isBrowser__: false
        })
    ]
};

module.exports = [browserConfig, serverConfig];