import React from 'react'
import {StaticRouter} from 'react-router-dom'
import {Provider,useStaticRendering} from 'mobx-react'
import App from './views/App.jsx'
import {createStoreMap} from './store/store'
import {JssProvider} from 'react-jss'
import {MuiThemeProvider} from 'material-ui/styles'

// 让mobx在服务端渲染的时候不会重复数据变换
useStaticRendering(true)


export default  (stores,routerContext,sheetsRegistry,jss,theme,url) => {
    return (
        <Provider {...stores}>
            <StaticRouter context={routerContext} location={url}>
                <JssProvider registry={sheetsRegistry} jss={jss}>
                    <MuiThemeProvider theme={theme}>
                        <App />
                    </MuiThemeProvider>
                </JssProvider>
            </StaticRouter>
        </Provider>
    )
}

export {createStoreMap}