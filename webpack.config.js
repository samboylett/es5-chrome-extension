const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Crx = require('crx-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const moment = require('moment');
const { URL } = require('url');

const buildName = moment().format('YYYY-MM-DD_HH:mm');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: false,
    entry: {
        devtools: './src/devtools.js',
        panel: './src/panel.js',
    },
    output: {
        filename: './[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /.(vue|js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin([
            { from: './src/icon.png', to: './icon.png' },
        ]),

        new CopyPlugin([
            { from: './src/devtools.html', to: './devtools.html' },
        ]),

        new CopyPlugin([
            { from: './src/panel.html', to: './panel.html' },
        ]),

        new GenerateJsonPlugin(
            './manifest.json',
            require('./src/manifest'),
        ),

        new VueLoaderPlugin(),

        new ZipPlugin({
            path: path.resolve(__dirname, 'zips'),
            filename: `${ buildName }.zip`,
        }),

        // Doesn't work with node 10, easy fix we can PR in when we need it..
        // new Crx({
        //     keyFile: 'key.pem',
        //     contentPath: 'build',
        //     outputPath: 'dist',
        //     name: buildName,
        // }),
    ],
};
