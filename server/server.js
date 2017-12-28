const express = require('express')
const reactSSR = require('react-dom/server')
const path = require('path')
const fs = require('fs')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')


const isDev = process.env.NODE_ENV === 'development'
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({
    maxAge:60*1000*10,
    name:'tid',
    resave:false,
    secret:'react cnode',
    saveUninitialized:false,
}))
app.use(favicon(path.join(__dirname,'../favicon.ico')))

app.use('/api/user',require('./util/handle-login'))
app.use('/api',require('./util/proxy'))

if(!isDev){
    // 读取模板html
    const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8')
    // 设置静态目录，只有访问public才返回服务端代码
    app.use('/public',express.static(path.join(__dirname,'../dist')))
    // server-entry导出的是es6模块，而这里是commonjs模块
    const serverEntry = require('../dist/server-entry').default
    app.get('*',(req,res) => {
        // 服务端入口
        const appString = reactSSR.renderToString(serverEntry)
        // 将服务端入口代码注入到模板html中
        res.send(template.replace('<!-- app -->',appString))
    }) 
}else{
    // 开发时就使用dev-static
    const devStatic = require('./util/dev-static')
    devStatic(app)
}


app.listen(3333,() => {
    console.log('server is listening on 3333')
})