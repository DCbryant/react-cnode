import React from 'react'
import {inject,observer} from 'mobx-react'
import PropTypes from 'prop-types'
import {AppState,TopicStore} from '../../store/store'
import Helmet from 'react-helmet'
import Button from 'material-ui/Button'
import Container from '../layout/container'
import Tabs,{Tab} from 'material-ui/Tabs'
import TopicListItem from './list-item.jsx'
import List from 'material-ui/List' //这里错了，引入错了！！！
import {CircularProgress} from 'material-ui/Progress'

@inject(stores => {
    return {
        appState:stores.appState,
        topicStore:stores.topicStore,
    }
})
@observer
export default class TopicList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            tabIndex:0
        }
    }

    componentDidMount(){
        this.props.topicStore.fetchTopics()
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
        const {topicStore} = this.props
        const topicList = topicStore.topics
        const syncingTopics = topicStore.syncing
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
                <List>
                    {
                        topicList.map(topic => (
                            <TopicListItem 
                                topic={topic} 
                                onClick={this.ListItemClick} 
                                key={topic.id}
                            />
                        ))
                    }
                </List>
                {
                    syncingTopics ? 
                    (
                        <div style={{
                            display:'flex',
                            justifyContent:'space-around',
                            padding:'40ox 0',
                        }}>
                            <CircularProgress color='accent' size={100} />
                        </div>
                    ):
                    null
                }
            </Container>
        )
    }
}

TopicList.wrappedComponent.propTypes = {
    appState:PropTypes.instanceOf(AppState),
    topicStore:PropTypes.instanceOf(TopicStore),
}