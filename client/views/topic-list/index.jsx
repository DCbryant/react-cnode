import React from 'react'
import {inject,observer} from 'mobx-react'
import PropTypes from 'prop-types'
import {AppState} from '../../store/store'
import Helmet from 'react-helmet'
import Button from 'material-ui/Button'
import Container from '../layout/container'
import Tabs,{Tab} from 'material-ui/Tabs'
import TopicListItem from './list-item.jsx'

@inject('appState')
@observer
export default class TopicList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            tabIndex:0
        }
    }
    asyncBootstrap(){
        return new Promise(resolve => {
            setTimeout(() => {
                this.props.appState.count = 3
                resolve(true)
            } )
        })
    }

    changeTab = (e,index) => {
        this.setState({
            tabIndex:index
        })
    }

    ListItemClick = () => {

    }

    render(){
        const {tabIndex} = this.state
        const topic = {
            title:'it is a title',
            username:'dcbryant',
            reply_count:20,
            visit_count:30,
            create_at:'2017/12/29',
            tab:'share'
        }
        return(
            <Container>
                <Helmet>
                    <title>topic list</title>
                    <meta name='description' content='description' />
                </Helmet>
                <Tabs value={tabIndex} onChange={this.changeTab}>
                    <Tab label='全部' />
                    <Tab label='精华' />
                    <Tab label='分享' />
                    <Tab label='问答' />
                    <Tab label='招聘' />
                    <Tab label='客户端测试' />
                </Tabs>
                <TopicListItem topic={topic} onClick={this.ListItemClick} />
            </Container>
        )
    }
}

TopicList.propTypes = {
    appState:PropTypes.instanceOf(AppState),
}