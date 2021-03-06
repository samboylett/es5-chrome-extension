const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Crx = require('crx-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const moment = require('moment');
const { URL } = require('url');

const date = moment().format('YYYY-MM-DD_HH:mm');
const buildName = `es5-extension-${ date }`;

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: false,
    entry: {
        devtools: './src/devtools.js',
        panel: './src/panel.js',
        background: './src/background.js',
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
        ...[
            'icon.png',
            'devtools.html',
            'panel.html',
        ].map(f => new CopyPlugin([
            {
                from: `./src/${ f }`,
                to: `./${ f }`,
            },
        ])),

        new GenerateJsonPlugin(
            './manifest.json',
            require('./src/manifest'),
        ),

        new VueLoaderPlugin(),

        new ZipPlugin({
            path: path.resolve(__dirname, 'zips'),
            filename: `${ buildName }.zip`,
        }),

        new Crx({
            keyFile: 'key.pem',
            contentPath: 'build',
            outputPath: 'dist',
            name: buildName,
        }),
    ],
};
