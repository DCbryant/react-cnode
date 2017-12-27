const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV = 'development'

const config = {
    entry:{
        app:path.join(__dirname,'../client/app.js'),
    },
    output:{
        filename:'[name].[hash].js',
        path:path.join(__dirname,'../dist'),
        //publicPath加在我们引用前面的路径 
        publicPath:'/public',
    },
    module:{
        rules:[
            {
                test:/\.jsx$/,
                loader:'babel-loader',
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:[
                    path.join(__dirname,'../node_modules')
                ]
            }
        ]
    },
    plugins:[
        new HtmlPlugin({
            template:path.join(__dirname,'../client/template.html')
        }),
    ]
}
// localhost:8888/filename,而上面output我们配置了publicPath，所以下面也需要配置
// 同时还有一个坑，我们必须把dist删除掉，因为webpack默认先读取磁盘上的内容，然后才读取内存上的内容
// 而webpack-dev-server需要读取内存上的内容，因为磁盘上的内容没有我们需要编译的内容
if(isDev){
    config.devServer = {
        host:'0.0.0.0',
        port:'8888',
        contentBase:path.join(__dirname,'../dist'),
        // hot:true,
        overlay:{
            errors:true
        },
        publicPath:'/public',
        historyApiFallback:{
            // 所有404的内容都需要返回index.html
            index:'/public/index.html'
        }
    }
}


module.exports = config