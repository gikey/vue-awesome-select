const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.conf')

module.exports = merge(webpackBaseConfig, {
    entry: './src/vselect/index.js',
    mode: 'production',
    output: {
        filename: 'vselect.js',
        libraryTarget: "commonjs2"
    }
})
