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
import queryString from 'query-string'
import {tabs} from '../../util/vairable-define'


@inject(stores => {
    return {
        appState:stores.appState,
        topicStore:stores.topicStore,
    }
})
@observer
export default class TopicList extends React.Component{
    static contextTypes = {
        router:PropTypes.object,
    }

    componentDidMount(){
        const tab = this.getTab()
        this.props.topicStore.fetchTopics(tab)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location.search !== this.props.location.search){
            this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
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

    changeTab = (e,value) => {
        this.context.router.history.push({
            pathname:'/list',
            search:`?tab=${value}`,
        })
    }

    ListItemClick = (topic) => {
        this.context.router.history.push(`/detail/${topic.id}`)
    }

    getTab = (search) => {
        search = search || this.props.location.search
        const query = queryString.parse(search)
        return query.tab || 'all'
    }

    render(){
        const {topicStore} = this.props
        const topicList = topicStore.topics
        const syncingTopics = topicStore.syncing
        const tab = this.getTab()
        return(
            <Container>
                <Helmet>
                    <title>topic list</title>
                    <meta name='description' content='description' />
                </Helmet>
                <Tabs value={tab} onChange={this.changeTab}>
                    {
                        Object.keys(tabs).map(t => (
                            <Tab label={tabs[t]} value={t} key={t} />
                        ))
                    }
                </Tabs>
                <List>
                    {
                        topicList.map(topic => (
                            <TopicListItem 
                                key={topic.id}
                                topic={topic} 
                                onClick={() => {this.ListItemClick(topic)}} 
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

TopicList.propTypes = {
    location:PropTypes.object.isRequired
}