import React from 'react'
import Route from '../config/router.jsx'
import {Link} from 'react-router-dom'
import MainAppBar from './layout/app-bar.jsx'
class App extends React.Component{
    render(){
        return [
            <MainAppBar key='appbar' />,
            <Route key='route' />,
        ]
    }
}

export default App
