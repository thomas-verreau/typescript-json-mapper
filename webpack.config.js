const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    
    module: {
        rules: [
            {test: /\.(js|jsx)$/, use: 'babel-loader'},
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],
        loaders: [
            {test: path.join(__dirname, 'src'), loader: 'babel-loader'}
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'})
    ]
};