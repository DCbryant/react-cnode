import ReactDOM from 'react-dom'
import React from 'react'
import App from './views/App.jsx'
import {AppContainer} from 'react-hot-loader'
import {
    BrowserRouter 
} from 'react-router-dom'

const root = document.getElementById('root')
const render = (Component,renderMethod) => {
    ReactDOM[renderMethod](
        <AppContainer>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
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