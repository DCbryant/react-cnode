const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
module.exports = webpackMerge(baseConfig,{
    target:'node',
    entry:{
        app:path.join(__dirname,'../client/server-entry.js'),
    },
    // 除去依赖
    externals:Object.keys(require('../package.json').dependencies),
    output:{
        filename:'server-entry.js',
        path:path.join(__dirname,'../dist'),
        publicPath:'/public/',
        libraryTarget:'commonjs2'
    },
})