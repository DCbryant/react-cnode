import ReactDOM from 'react-dom'
import React from 'react'
import App from './views/App.jsx'
import {AppContainer} from 'react-hot-loader'
import {
    BrowserRouter 
} from 'react-router-dom'
import {Provider} from 'mobx-react'
import AppState from './store/app-state'

const initialState = window.__INITIAL__STATE__  || {}


const root = document.getElementById('root')
const render = (Component,renderMethod) => {
    ReactDOM[renderMethod](
        <AppContainer>
            <Provider appState={new AppState(initialState.appState)}>
                <BrowserRouter>
                    <Component />
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root
    )
}

render(App,'render')


if(module.hot){
    module.hot.accept('./views/App.jsx',() => {
        const nextApp = require('./views/App.jsx').default
        render(nextApp,'hydrate')
    })
}