import ReactDOM from 'react-dom'
import React from 'react'
import App from './views/App.jsx'
import {AppContainer} from 'react-hot-loader'
import {
    BrowserRouter 
} from 'react-router-dom'
import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles'
import {lightBlue,pink} from 'material-ui/colors'
import {Provider} from 'mobx-react'
import {AppState,TopicStore} from './store/store'

const theme = createMuiTheme({
    palette:{
        primary:pink,
        accent:lightBlue,
        type:'light'
    }
})

const createApp = (TheApp) => {
    class Main extends React.Component {
        // Remove the server-side injected CSS.
        componentDidMount() {
            const jssStyles = document.getElementById('jss-server-side')
            if (jssStyles && jssStyles.parentNode) {
                jssStyles.parentNode.removeChild(jssStyles)
            }
        }
        
        render() {
            return <TheApp />
        }
    }
    return Main
}


// 获取模板中的state，并且注入到appState中
const initialState = window.__INITIAL__STATE__  || {}
const root = document.getElementById('root')

const appState = new AppState()
// 服务端渲染用initialState.appState.user port:3333
// 前端用initialState.appState port:8888
appState.init(initialState.appState.user)
const topicStore = new TopicStore(initialState.topicStore)

const render = (Component,renderMethod) => {
    ReactDOM[renderMethod](
        <AppContainer>
            <Provider appState={appState} topicStore={topicStore}>
                <BrowserRouter>
                    <MuiThemeProvider theme={theme}>
                        <Component />
                    </MuiThemeProvider>
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root
    )
}

render(createApp(App),'render')


if(module.hot){
    module.hot.accept('./views/App.jsx',() => {
        const nextApp = require('./views/App.jsx').default
        render(createApp(nextApp),'hydrate')
    })
}