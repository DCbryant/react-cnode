import React from 'react'
import {
    Route,
    Redirect,
} from 'react-router-dom'
import TopicList from '../views/topic-list/index.jsx'
import TopicDetail from '../views/topic-detail/index.jsx'
import UserLogin from '../views/user/login'

export default () => [
    <Route path='/' exact render={() => <Redirect to='list' />} key='/' />,
    <Route path='/list'  component={TopicList} key='list' />,
    <Route path='/detail/:id' component={TopicDetail}  key='detail' />,
    <Route path='/user/login' component={UserLogin} key='login' />,
]