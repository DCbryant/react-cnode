import ReactDOM from 'react-dom'
import React from 'react'
import App from './App.jsx'
import {AppContainer} from 'react-hot-loader'

const root = document.getElementById('root')
const render = (Component,renderMethod) => {
    ReactDOM[renderMethod](
        <AppContainer>
            <Component />
        </AppContainer>,
        root
    )
}

render(App,'render')

// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// )

if(module.hot){
    module.hot.accept('./App.jsx',() => {
        const nextApp = require('./App.jsx').default
        // ReactDOM.hydrate(
        //     <App />,
        //     document.getElementById('root')
        // )
        render(nextApp,'hydrate')
    })
}