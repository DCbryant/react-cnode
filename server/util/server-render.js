// 异步获取数据
const asyncBootstrap = require('react-async-bootstrapper').default
const ejs = require('ejs')
// 将对象序列化(变成字符串)
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default
const ReactDomServer = require('react-dom/server')
const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default
const colors = require('material-ui/colors')


const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result,storeName) => {
        result[storeName] = stores[storeName].toJson()
        return result
    },{})
}

module.exports = (bundle,template,req,res) => {
    return new Promise((resolve,reject) => {
        const createStoreMap = bundle.createStoreMap
        const createApp = bundle.default 
        const routerContext = {}
        const stores = createStoreMap()
        const theme = createMuiTheme({
            palette:{
                primary:colors.pink,
                accent:colors.lightBlue,
                type:'light'
            }
        })
        const sheetsRegistry = new SheetsRegistry()
        const jss = create(preset())
        jss.options.createGenerateClassName = createGenerateClassName 
        const app = createApp(stores,routerContext,sheetsRegistry,jss,theme,req.url)
        
        // 可以在这里进行数据初始化，然后再进行react的渲染
        asyncBootstrap(app).then(() => {
            if(routerContext.url){
                res.status(302).setHeader('Location',routerContext.url)
                res.end()
                return
            }
            const helmet = Helmet.rewind()
            const state = getStoreState(stores)
            // 获取模板文件并将server bundle插入到模板文件中
            const content = ReactDomServer.renderToString(app)
            // 将state、服务端代码注入到模板中
            const html = ejs.render(template,{
                appString:content,
                initialState:serialize(state),
                meta:helmet.meta.toString(),
                title:helmet.title.toString(),
                style:helmet.style.toString(),
                link:helmet.link.toString(),
                materialCss:sheetsRegistry.toString(),
            })
            res.send(html)
            resolve()
            // res.send(template.replace('<!-- app -->',content))
        }).catch(reject)
    })
}