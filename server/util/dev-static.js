const axios = require('axios')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')
// fs是在硬盘上读取文件，但读取速度慢，mfs是在内存中读取文件，读取速度快
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const path =  require('path')
const proxy = require('http-proxy-middleware')

// 我们可以通过axios获取webpack-dev-server编译的最新的实时编译文件
const getTemplate = () => {
    return new Promise((resolve,reject) => {
        return axios.get('http://localhost:8888/public/index.html')
            .then(res => {
                resolve(res.data)
            })
            .catch(reject)
    })
}

// hack：创造一个module构造函数
const Module = module.constructor
let serverBundle

// 我们还需要实时获取服务端渲染的代码server bundle
// 我们可以在这里启动webpack，通过获取webpack的打包结果来获取这部分内容
const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({},(err,stats) => {
    if(err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(warning => console.log(warning))

    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    )
    // 读取webpack编译的内容
    const bundle = mfs.readFileSync(bundlePath,'utf-8')
    const m = new Module()
    // 让modlue去解析bundle的内容,生成一个新的模块
    m._compile(bundle,'server-entry.js')
    serverBundle = m.exports.default
})

module.exports = (app) => {
    // 我们需要增加一个静态目录，否则返回的内容都是html
    // 这里通过代理来完成功能  
    app.use('/public',proxy({
        target:'http://localhost:8888'
    }))
    app.get('*',(req,res) => {
        getTemplate().then(template => {
            // 获取模板文件并将server bundle插入到模板文件中
            const content = ReactDomServer.renderToString(serverBundle)
            res.send(template.replace('<!-- app -->',content))
        })
    })
}