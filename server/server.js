const express = require('express')
const reactSSR = require('react-dom/server')
const path = require('path')
// server-entry导出的是es6模块，而这里是commonjs模块
const serverEntry = require('../dist/server-entry').default
const fs = require('fs')
// 读取模板html
const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8')

const app = express()

// 设置静态目录，只有访问public才返回服务端代码
app.use('/public',express.static(path.join(__dirname,'../dist')))

app.get('*',(req,res) => {
    // 服务端入口
    const appString = reactSSR.renderToString(serverEntry)
    // 将服务端入口代码注入到模板html中
    res.send(template.replace('<app></app>',appString))
})


app.listen(3333,() => {
    console.log('server is listening on 3333')
})