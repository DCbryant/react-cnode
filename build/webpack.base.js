const path = require('path')
module.exports = {
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
            },
            {
                test:/\.(png|jpg|gif|svg)$/,
                loader:'file-loader',
                options:{
                    name:'[name].[ext]?hash'
                }
            }
        ]
    },
    resolve:{
        extensions:['.js','.jsx']
    }
}