const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const isDev = process.env.NODE_ENV === 'development'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const NameAllModulesPlugin = require('name-all-modules-plugin')
const cdnConfig = require('../app.config').cdn
const config = webpackMerge(baseConfig,{
    entry:{
        app:path.join(__dirname,'../client/app.js'),
    },
    output:{
        filename:'[name].[hash].js',
        path:path.join(__dirname,'../dist'),
        //publicPath加在我们引用前面的路径 
        // 这里不加/会导致HotModuleReplacementPlugin出现路径错误从而导致触发historyApiFallback
        // 这个插件，从而让我们的热更新没有触发，导致页面每次更新
        publicPath:'/public/',
    },
    
    plugins:[
        new HtmlPlugin({
            template:path.join(__dirname,'../client/template.html')
        }),
        new HtmlPlugin({
            template:'!!ejs-compiled-loader!' + path.join(__dirname,'../client/server.template.ejs'),
            filename:'server.ejs',
        })
    ]
})
// localhost:8888/filename,而上面output我们配置了publicPath，所以下面也需要配置
// 同时还有一个坑，我们必须把dist删除掉，因为webpack默认先读取磁盘上的内容，然后才读取内存上的内容
// 而webpack-dev-server需要读取内存上的内容，因为磁盘上的内容没有我们需要编译的内容
if(isDev){
    config.devtool = '#cheap-module-eval-source-map'
    config.entry = {
        app:[
            'react-hot-loader/patch',
            path.join(__dirname,'../client/app.js'),
        ]
    }
    config.devServer = {
        host:'0.0.0.0',
        port:'8888',
        contentBase:path.join(__dirname,'../dist'),
        hot:true,
        overlay:{
            errors:true
        },
        publicPath:'/public',
        historyApiFallback:{
            // 所有404的内容都需要返回index.html
            index:'/public/index.html'
        },
        proxy:{
            '/api':'http://localhost:3333'
        }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}else{
    config.entry = {
        app:path.join(__dirname,'../client/app.js'),
        // 以下依赖包不再更新
        vendor:[
            'react',
            'react-dom',
            'react-router-dom',
            'mobx',
            'mobx-react',
            'axios',
            'query-string',
            'dateformat',
            'marked'
        ]
    }
    config.output.publicPath = cdnConfig.host
    config.output.filename = '[name].[chunkhash].js'
    // 压缩js
    config.plugins.push(
        new UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'manifest',
            minChunks:Infinity,
        }),
        new webpack.NamedModulesPlugin(),
        new NameAllModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:JSON.stringify('production')
            }
        }),
        new webpack.NamedChunksPlugin((chunk) => {
            if(chunk.name){
                return chunk.name
            }
            return chunk.mapModules(m => path.relative(m.context,m.request)).join('_')
        })
    )
    // 9M -> 856k
}

module.exports = config