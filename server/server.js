const express = require('express')
// const reactSSR = require('react-dom/server')
const path = require('path')
const fs = require('fs')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const serverRender = require('./util/server-render')

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
    const template = fs.readFileSync(path.join(__dirname,'../dist/server.ejs'),'utf8')
    // 设置静态目录，只有访问public才返回服务端代码
    app.use('/public',express.static(path.join(__dirname,'../dist')))
    // server-entry导出的是es6模块，而这里是commonjs模块
    const serverEntry = require('../dist/server-entry')
    app.get('*',(req,res,next) => {
        // 服务端入口
        // const appString = reactSSR.renderToString(serverEntry)
        // 将服务端入口代码注入到模板html中
        // res.send(template.replace('<!-- app -->',appString))
        serverRender(serverEntry,template,req,res).catch(next)
    }) 
}else{
    // 开发时就使用dev-static
    const devStatic = require('./util/dev-static')
    devStatic(app)
}

app.use((error,req,res,next) => {
    console.log(error)
    res.status(500).send(error + '服务端渲染错误')
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3333

app.listen(3333,port,host,() => {
    console.log('server is listening on 3333')
})