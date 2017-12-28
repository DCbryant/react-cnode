import React from 'react'
import Route from '../config/router.jsx'
import {Link} from 'react-router-dom'
class App extends React.Component{
    render(){
        return [
            <div key='app'>
                <Link to='/' >home</Link>
                <br />
                <Link to='/detail'>detail</Link>
            </div>,
            <Route key='route' />,
        ]
    }
}

export default App
