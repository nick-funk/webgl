const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new CopyPlugin(
        [
            { from: './src/index.html', to: './', flatten: true },
            { from: './textures/*.*', to: 'textures/', flatten: true }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' /* creates style nodes from JS strings */ },
                    { loader: 'css-loader' /* translates CSS into CommonJS */ },
                    { loader: 'less-loader' /* compiles Less to CSS */ }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|server)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    }
};