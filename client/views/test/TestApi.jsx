import React from 'react'
import axios from 'axios'
export default class TestApi extends React.Component{

    getTopic = () => {
        axios.get('/api/topics')
            .then(resp => {
                console.log(resp)
            })
            .catch(err => {
                console.log(err)
            })
    }

    login = () => {
        axios.post('/api/user/login',{
            accessToken:'157d5760-2e5f-4081-955e-3fcf20ec1067'
        })
            .then(resp => {
                console.log(resp)
            })
            .catch(err => {
                console.log(err)
            })
    }

    markall = () => {
        axios.post('/api/message/mark_all?needAccessToken=true')
            .then(resp => {
                console.log(resp)
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        return(
            <div>
                <button onClick={this.getTopic}>topics</button>
                <button onClick={this.login}>login</button>
                <button onClick={this.markall}>markall</button>
            </div>
        )
    }
}